import { Droplets, Thermometer, Cloud, Sun } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, ReferenceLine, YAxis } from 'recharts';
import type { SensorData } from '@/lib/greenhouse-data';

const iconMap: Record<string, React.ElementType> = {
  droplets: Droplets,
  thermometer: Thermometer,
  cloud: Cloud,
  sun: Sun,
};

const statusBorderClass: Record<string, string> = {
  healthy: 'border-l-sensor-green',
  warning: 'border-l-sensor-yellow',
  critical: 'border-l-sensor-red',
};

const statusLineColor: Record<string, string> = {
  healthy: 'hsl(145, 60%, 42%)',
  warning: 'hsl(42, 90%, 55%)',
  critical: 'hsl(0, 70%, 55%)',
};

interface SensorCardProps {
  sensor: SensorData;
}

const SensorCard = ({ sensor }: SensorCardProps) => {
  const Icon = iconMap[sensor.icon] || Droplets;
  const lineColor = statusLineColor[sensor.status];

  return (
    <div className={`greenhouse-card border-l-4 ${statusBorderClass[sensor.status]} animate-fade-in`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-secondary">
            <Icon className="w-4 h-4 text-secondary-foreground" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">{sensor.label}</p>
            <p className="text-2xl font-serif font-bold text-foreground">
              {sensor.current}
              <span className="text-sm font-sans font-normal text-muted-foreground ml-1">
                {sensor.unit}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Mini chart */}
      <div className="h-16 mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sensor.history}>
            <YAxis domain={['dataMin - 5', 'dataMax + 5']} hide />
            <Line
              type="monotone"
              dataKey="value"
              stroke={lineColor}
              strokeWidth={2}
              dot={false}
            />
            <ReferenceLine
              y={sensor.threshold.low}
              stroke="hsl(0, 70%, 55%)"
              strokeDasharray="3 3"
              strokeWidth={1}
              strokeOpacity={0.5}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-between mt-2 text-xs text-muted-foreground">
        <span>24h ago</span>
        <span>Now</span>
      </div>
    </div>
  );
};

export default SensorCard;
