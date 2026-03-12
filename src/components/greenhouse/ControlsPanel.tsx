import { useState } from 'react';
import { Power, Droplets, Sun, Wind, ShieldCheck, Hand } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

type Mode = 'auto' | 'manual';

interface DeviceState {
  light: boolean;
  fan: boolean;
}

// ── helpers ────────────────────────────────────────────────────────────────

async function callDeviceApi(device: keyof DeviceState, on: boolean) {
  try {
    await fetch(`/api/${device}/${on ? 'on' : 'off'}`, { method: 'POST' });
  } catch (err) {
    console.error(`[ControlsPanel] API call failed for ${device}:`, err);
  }
}

// ── component ──────────────────────────────────────────────────────────────

const ControlsPanel = () => {
  const [mode, setMode] = useState<Mode>('auto');
  const [autoStates] = useState({ light: true, fan: false });
  const [manualStates, setManualStates] = useState<DeviceState>({
    light: false,
    fan: false,
  });

  const toggleManual = async (device: keyof DeviceState) => {
    const next = !manualStates[device];
    setManualStates(prev => ({ ...prev, [device]: next }));
    await callDeviceApi(device, next);
  };

  const handleModeChange = async (next: Mode) => {
    if (next === 'auto') {
      const toTurnOff = (Object.keys(manualStates) as (keyof DeviceState)[]).filter(
        d => manualStates[d],
      );
      setManualStates({ light: false, fan: false });
      await Promise.all(toTurnOff.map(d => callDeviceApi(d, false)));
    }
    setMode(next);
  };

  const manualDevices = [
    { key: 'light' as const, label: 'Grow Light', icon: Sun },
    { key: 'fan' as const, label: 'Ventilation Fan', icon: Wind },
  ];

  return (
    <div className="greenhouse-card animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Power className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-serif font-semibold text-foreground">Controls</h2>
        </div>
      </div>

      {/* Mode Toggle */}
      <div className="flex rounded-lg bg-secondary p-1 mb-4">
        <button
          onClick={() => handleModeChange('auto')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-sm font-medium transition-colors ${
            mode === 'auto'
              ? 'bg-card text-primary shadow-sm'
              : 'text-muted-foreground'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          Auto
        </button>
        <button
          onClick={() => handleModeChange('manual')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-sm font-medium transition-colors ${
            mode === 'manual'
              ? 'bg-card text-accent shadow-sm'
              : 'text-muted-foreground'
          }`}
        >
          <Hand className="w-4 h-4" />
          Manual
        </button>
      </div>

      {/* Irrigation Pump – auto only, no manual control */}
      <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Droplets className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Irrigation Pump</p>
            <p className="text-xs text-muted-foreground">
              Waters automatically when soil is dry
            </p>
          </div>
        </div>
        <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
          Auto
        </span>
      </div>

      {/* Manual-control devices */}
      <div className="space-y-3">
        {manualDevices.map(device => {
          const Icon = device.icon;
          const isOn = mode === 'auto' ? autoStates[device.key] : manualStates[device.key];

          return (
            <div
              key={device.key}
              className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${isOn ? 'bg-primary/10' : 'bg-muted'}`}>
                  <Icon className={`w-4 h-4 ${isOn ? 'text-primary' : 'text-muted-foreground'}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{device.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {mode === 'auto' ? 'AUTO' : isOn ? 'ON' : 'OFF'}
                  </p>
                </div>
              </div>

              {mode === 'auto' ? (
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  isOn ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                }`}>
                  {isOn ? 'Active' : 'Standby'}
                </span>
              ) : (
                <Switch
                  checked={isOn}
                  onCheckedChange={() => toggleManual(device.key)}
                />
              )}
            </div>
          );
        })}
      </div>

      {mode === 'manual' && (
        <p className="text-xs text-accent mt-3 flex items-center gap-1">
          <Hand className="w-3 h-3" />
          Manual override active — automation paused
        </p>
      )}
    </div>
  );
};

export default ControlsPanel;
