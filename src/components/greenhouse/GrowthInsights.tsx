import { TrendingUp, Droplets, Sun, Sparkles } from 'lucide-react';
import { weeklyInsights } from '@/lib/greenhouse-data';

const GrowthInsights = () => {
  return (
    <div className="greenhouse-card animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-accent" />
        <h2 className="text-lg font-serif font-semibold text-foreground">Growth Insights</h2>
        <span className="text-xs bg-secondary text-muted-foreground px-2 py-0.5 rounded-full">Weekly</span>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-secondary/50 rounded-lg p-3 text-center">
          <Droplets className="w-4 h-4 mx-auto mb-1 text-primary" />
          <p className="text-xs text-muted-foreground">Water Used</p>
          <p className="text-lg font-serif font-bold text-foreground">{weeklyInsights.waterUsage}</p>
        </div>
        <div className="bg-secondary/50 rounded-lg p-3 text-center">
          <Sun className="w-4 h-4 mx-auto mb-1 text-accent" />
          <p className="text-xs text-muted-foreground">Light/Day</p>
          <p className="text-lg font-serif font-bold text-foreground">{weeklyInsights.lightExposure}</p>
        </div>
        <div className="bg-secondary/50 rounded-lg p-3 text-center">
          <TrendingUp className="w-4 h-4 mx-auto mb-1 text-sensor-green" />
          <p className="text-xs text-muted-foreground">Optimal</p>
          <p className="text-lg font-serif font-bold text-foreground">{weeklyInsights.optimalMoisture}%</p>
        </div>
      </div>

      <div className="ai-panel">
        <p className="text-sm text-foreground/80 leading-relaxed">
          <span className="font-semibold text-primary">🧠 Weekly Summary:</span>{' '}
          {weeklyInsights.aiSummary}
        </p>
      </div>
    </div>
  );
};

export default GrowthInsights;
