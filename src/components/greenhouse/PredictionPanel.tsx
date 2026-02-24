import { useState } from 'react';
import { Brain, TrendingDown, Clock, Activity } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Legend,
} from 'recharts';
import { moistureHistory, moistureForecast } from '@/lib/greenhouse-data';

const PredictionPanel = () => {
  const [showPredicted, setShowPredicted] = useState(true);
  const [showHistorical, setShowHistorical] = useState(true);

  // Combine data for the chart
  const historicalData = moistureHistory.map(d => ({
    time: d.time,
    actual: d.value,
    predicted: null as number | null,
  }));

  const forecastData = moistureForecast.map(d => ({
    time: d.time,
    actual: null as number | null,
    predicted: d.value,
  }));

  // Bridge point
  const lastActual = moistureHistory[moistureHistory.length - 1];
  const bridgePoint = {
    time: lastActual.time,
    actual: lastActual.value,
    predicted: lastActual.value,
  };

  const chartData = showHistorical && showPredicted
    ? [...historicalData, bridgePoint, ...forecastData]
    : showHistorical
      ? historicalData
      : showPredicted
        ? [bridgePoint, ...forecastData]
        : [];

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

      {/* Key metrics */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-card/70 rounded-lg p-3 text-center">
          <TrendingDown className="w-4 h-4 mx-auto mb-1 text-sensor-yellow" />
          <p className="text-xs text-muted-foreground">Threshold breach</p>
          <p className="text-sm font-semibold text-foreground">~3.2 hrs</p>
        </div>
        <div className="bg-card/70 rounded-lg p-3 text-center">
          <Clock className="w-4 h-4 mx-auto mb-1 text-primary" />
          <p className="text-xs text-muted-foreground">Recommended</p>
          <p className="text-sm font-semibold text-foreground">Water in 2.5h</p>
        </div>
        <div className="bg-card/70 rounded-lg p-3 text-center">
          <Activity className="w-4 h-4 mx-auto mb-1 text-sensor-green" />
          <p className="text-xs text-muted-foreground">Confidence</p>
          <p className="text-sm font-semibold text-foreground">91%</p>
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
