import { AlertTriangle, Info, X } from 'lucide-react';
import { useState } from 'react';
import { alerts } from '@/lib/greenhouse-data';

const iconMap = {
  info: Info,
  warning: AlertTriangle,
  critical: AlertTriangle,
};

const styleMap = {
  info: 'bg-secondary border-border text-secondary-foreground',
  warning: 'bg-accent/10 border-sensor-yellow/30 text-accent-foreground',
  critical: 'bg-destructive/10 border-destructive/30 text-destructive',
};

const AlertBanner = () => {
  const [dismissed, setDismissed] = useState<string[]>([]);
  const visible = alerts.filter(a => !dismissed.includes(a.id));

  if (visible.length === 0) return null;

  return (
    <div className="space-y-2 animate-fade-in">
      {visible.map(alert => {
        const Icon = iconMap[alert.type];
        return (
          <div
            key={alert.id}
            className={`flex items-center justify-between p-3 rounded-lg border ${styleMap[alert.type]}`}
          >
            <div className="flex items-center gap-2">
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm">{alert.message}</span>
              <span className="text-xs text-muted-foreground ml-2">{alert.time}</span>
            </div>
            <button
              onClick={() => setDismissed(prev => [...prev, alert.id])}
              className="p-1 hover:bg-muted rounded"
            >
              <X className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default AlertBanner;
