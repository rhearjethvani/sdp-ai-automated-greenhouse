import { useState, useEffect, useMemo } from 'react';
import { Brain, TrendingDown, Clock, Activity } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Legend,
} from 'recharts';
import { moistureHistory, buildDryForecast, sensorData } from '@/lib/greenhouse-data';

// helper: convert historical percent readings to binary moisture sensor (0=wet,1=dry)
function toBinary(value: number, threshold = 30) {
  return value < threshold ? 1 : 0;
}

const PredictionPanel = () => {
  const [showPredicted, setShowPredicted] = useState(true);
  const [showHistorical, setShowHistorical] = useState(true);

  // Combine data for the chart (historical is binary 0/1, predicted is percentage 0-100)
  const [forecastData, setForecastData] = useState<Array<{ time: string; predicted: number }>>([]);

  const historicalData = moistureHistory.map(d => ({
    time: d.time,
    actual: toBinary(d.value),
    predicted: null as number | null,
  }));

  // Bridge point based on last historical sample
  const lastActual = moistureHistory[moistureHistory.length - 1];
  const bridgePoint = {
    time: lastActual.time,
    actual: toBinary(lastActual.value),
    predicted: null as number | null,
  };

  // Load predictions from backend on mount. Prefer live hardware via `/api/status`,
  // fall back to bundled `sensorData` mock when the Flask server is not running.
  useEffect(() => {
    let mounted = true;

    (async () => {
      // try live status from Flask backend (proxied at /api/status)
      try {
        const resp = await fetch('/api/status');
        if (!resp.ok) throw new Error('no-status');
        const status = await resp.json();

        // `status` shape from server.py: { soil: 'wet'|'dry', temp_f: number, humidity: number, ... }
        let currentBinary = 0;
        if (typeof status.soil === 'string') {
          currentBinary = status.soil.toLowerCase() === 'dry' ? 1 : 0;
        } else if (typeof status.soil === 'number') {
          // hardware might report 0/1
          currentBinary = status.soil ? 1 : 0;
        }

        const temp = status.temp_f ?? (sensorData.find(s => s.label === 'Temperature') || sensorData[1]).current;
        const hum = status.humidity ?? (sensorData.find(s => s.label === 'Humidity') || sensorData[2]).current;

        const preds = await buildDryForecast(currentBinary, temp as number, hum as number, 6);
        if (!mounted) return;
        setForecastData(preds.map(p => ({ time: p.time, predicted: p.value })));
        return;
      } catch (e) {
        // fallback to bundled mock
      }

      // fallback: use bundled mock sensorData
      const soil = sensorData.find(s => s.label === 'Soil Moisture') || sensorData[0];
      const temp = (sensorData.find(s => s.label === 'Temperature') || sensorData[1]).current;
      const hum = (sensorData.find(s => s.label === 'Humidity') || sensorData[2]).current;
      const currentBinary = toBinary(soil.current, soil.threshold.low);
      const preds = await buildDryForecast(currentBinary, temp as number, hum as number, 6);
      if (!mounted) return;
      setForecastData(preds.map(p => ({ time: p.time, predicted: p.value })));
    })();

    return () => { mounted = false; };
  }, []);

  const chartData = (() => {
    if (showHistorical && showPredicted) {
      return [
        ...historicalData,
        bridgePoint,
        ...forecastData.map(d => ({ time: d.time, actual: null, predicted: d.predicted })),
      ];
    }
    if (showHistorical) return historicalData;
    if (showPredicted) return [bridgePoint, ...forecastData.map(d => ({ time: d.time, actual: null, predicted: d.predicted }))];
    return [];
  })();

  return (
    <div className="ai-panel animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-lg bg-primary/10">
          <Brain className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-serif font-semibold text-foreground">Predictive Insights</h2>
          <p className="text-xs text-muted-foreground">AI moisture forecasting</p>
        </div>
      </div>

          {/* Key metrics: threshold breach, time-to-dry, confidence (derived from predictions) */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-card/70 rounded-lg p-3 text-center">
              <TrendingDown className="w-4 h-4 mx-auto mb-1 text-sensor-yellow" />
              <p className="text-xs text-muted-foreground">Threshold breach</p>
              <p className="text-sm font-semibold text-foreground">{/* display soil threshold info */}
                {(() => {
                  const soil = sensorData.find(s => s.label === 'Soil Moisture');
                  return soil ? `${soil.threshold.low}${soil.unit ?? ''}` : '30%';
                })()}
              </p>
            </div>
            <div className="bg-card/70 rounded-lg p-3 text-center">
              <Clock className="w-4 h-4 mx-auto mb-1 text-primary" />
              <p className="text-xs text-muted-foreground">Time to dry</p>
              <p className="text-sm font-semibold text-foreground">
                {useMemo(() => {
                  if (!forecastData || forecastData.length === 0) return '—';
                  // find first hour where predicted >= 50%
                  const idx = forecastData.findIndex(f => (f.predicted ?? 0) >= 50);
                  if (idx === -1) return '>6h';
                  return `${idx + 1}h`;
                }, [forecastData])}
              </p>
            </div>
            <div className="bg-card/70 rounded-lg p-3 text-center">
              <Activity className="w-4 h-4 mx-auto mb-1 text-sensor-green" />
              <p className="text-xs text-muted-foreground">Confidence</p>
              <p className="text-sm font-semibold text-foreground">
                {useMemo(() => {
                  if (!forecastData || forecastData.length === 0) return '—';
                  // confidence = max predicted probability across forecast (rounded)
                  const max = Math.max(...forecastData.map(f => f.predicted ?? 0));
                  return `${Math.round(max)}%`;
                }, [forecastData])}
              </p>
            </div>
          </div>

      {/* Toggles */}
      <div className="flex gap-3 mb-3">
        <button
          onClick={() => setShowHistorical(!showHistorical)}
          className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
            showHistorical
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-secondary-foreground'
          }`}
        >
          Historical
        </button>
        <button
          onClick={() => setShowPredicted(!showPredicted)}
          className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
            showPredicted
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-secondary-foreground'
          }`}
        >
          Predicted
        </button>
      </div>

      {/* Chart */}
      <div className="h-52 bg-card/50 rounded-lg p-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(35, 20%, 88%)" />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 10, fill: 'hsl(150, 8%, 46%)' }}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 10, fill: 'hsl(150, 8%, 46%)' }}
              domain={[20, 80]}
            />
            <Tooltip
              contentStyle={{
                background: 'hsl(40, 20%, 99%)',
                border: '1px solid hsl(35, 20%, 88%)',
                borderRadius: '8px',
                fontSize: '12px',
              }}
            />
            <ReferenceLine
              y={30}
              stroke="hsl(0, 70%, 55%)"
              strokeDasharray="5 5"
              label={{ value: 'Min', position: 'right', fontSize: 10, fill: 'hsl(0, 70%, 55%)' }}
            />
            {showHistorical && (
              <Line
                type="monotone"
                dataKey="actual"
                stroke="hsl(152, 30%, 38%)"
                strokeWidth={2}
                dot={false}
                name="Actual"
                connectNulls={false}
              />
            )}
            {showPredicted && (
              <Line
                type="monotone"
                dataKey="predicted"
                stroke="hsl(38, 75%, 55%)"
                strokeWidth={2}
                strokeDasharray="6 4"
                dot={false}
                name="Predicted"
                connectNulls={false}
              />
            )}
            <Legend
              wrapperStyle={{ fontSize: '11px' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PredictionPanel;
