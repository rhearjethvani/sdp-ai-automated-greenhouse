// Mock greenhouse sensor data

export type SensorStatus = 'healthy' | 'warning' | 'critical';
export type PlantHealth = 'Healthy' | 'Needs Attention' | 'Critical';
export type DeviceMode = 'auto' | 'manual';

export interface SensorReading {
  time: string;
  value: number;
}

export interface SensorData {
  label: string;
  unit: string;
  current: number;
  threshold: { low: number; high: number };
  status: SensorStatus;
  icon: string;
  history: SensorReading[];
}

export interface Alert {
  id: string;
  type: 'info' | 'warning' | 'critical';
  message: string;
  time: string;
}

function generateHistory(base: number, variance: number, points = 24): SensorReading[] {
  const data: SensorReading[] = [];
  const now = new Date();
  for (let i = points; i >= 0; i--) {
    const t = new Date(now.getTime() - i * 60 * 60 * 1000);
    const hour = t.getHours();
    const label = `${hour.toString().padStart(2, '0')}:00`;
    data.push({
      time: label,
      value: Math.round((base + (Math.random() - 0.5) * variance) * 10) / 10,
    });
  }
  return data;
}

function generateForecast(lastValue: number, trend: number, points = 6): SensorReading[] {
  const data: SensorReading[] = [];
  const now = new Date();
  for (let i = 1; i <= points; i++) {
    const t = new Date(now.getTime() + i * 60 * 60 * 1000);
    const hour = t.getHours();
    data.push({
      time: `${hour.toString().padStart(2, '0')}:00`,
      value: Math.round((lastValue + trend * i + (Math.random() - 0.3) * 2) * 10) / 10,
    });
  }
  return data;
}

export const sensorData: SensorData[] = [
  {
    label: 'Soil Moisture',
    unit: '%',
    current: 42,
    threshold: { low: 30, high: 80 },
    status: 'warning',
    icon: 'droplets',
    history: generateHistory(50, 15),
  },
  {
    label: 'Temperature',
    unit: '°F',
    current: 74,
    threshold: { low: 60, high: 85 },
    status: 'healthy',
    icon: 'thermometer',
    history: generateHistory(73, 6),
  },
  {
    label: 'Humidity',
    unit: '%',
    current: 62,
    threshold: { low: 40, high: 80 },
    status: 'healthy',
    icon: 'cloud',
    history: generateHistory(60, 10),
  },
  {
    label: 'Light Intensity',
    unit: 'lux',
    current: 850,
    threshold: { low: 400, high: 1200 },
    status: 'healthy',
    icon: 'sun',
    history: generateHistory(700, 300),
  },
];

export const moistureHistory = generateHistory(50, 15);
export const moistureForecast = generateForecast(42, -2.5, 6);

export const alerts: Alert[] = [
  { id: '1', type: 'warning', message: 'Moisture trending below threshold', time: '2 min ago' },
  { id: '2', type: 'info', message: 'Grow light turned on automatically', time: '1 hour ago' },
  { id: '3', type: 'info', message: 'All sensors reporting normally', time: '3 hours ago' },
];

export const plantInfo = {
  name: 'Radish Batch #1',
  health: 'Needs Attention' as PlantHealth,
  aiSummary: 'Moisture trending down. Predicted dry in 3.2 hours.',
  daysSincePlanting: 12,
  variety: 'Cherry Belle Radish',
};

export const weeklyInsights = {
  waterUsage: '2.4 L',
  lightExposure: '14.2 hrs/day',
  optimalMoisture: 87,
  aiSummary: 'Your plant maintained optimal moisture levels 87% of the week. Light exposure was slightly above target — consider reducing by 30 minutes.',
};
