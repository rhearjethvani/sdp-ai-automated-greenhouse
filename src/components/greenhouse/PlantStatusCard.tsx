import { Leaf, Calendar } from 'lucide-react';
import plantHero from '@/assets/plant-hero.png';
import { plantInfo } from '@/lib/greenhouse-data';

const healthColors = {
  'Healthy': 'status-dot-healthy',
  'Needs Attention': 'status-dot-warning',
  'Critical': 'status-dot-critical',
};

const healthTextColors = {
  'Healthy': 'status-healthy',
  'Needs Attention': 'status-warning',
  'Critical': 'status-critical',
};

const PlantStatusCard = () => {
  return (
    <div className="greenhouse-card overflow-hidden relative">
      <div className="flex flex-col md:flex-row gap-5">
        {/* Plant image */}
        <div className="w-full md:w-48 h-36 md:h-auto rounded-lg overflow-hidden flex-shrink-0">
          <img
            src={plantHero}
            alt="Radish seedling in greenhouse"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Plant info */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Leaf className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">{plantInfo.variety}</span>
            </div>
            <h1 className="text-2xl font-serif font-semibold text-foreground mb-2">
              {plantInfo.name}
            </h1>
            <div className="flex items-center gap-2 mb-3">
              <span className={`w-2.5 h-2.5 rounded-full ${healthColors[plantInfo.health]}`} />
              <span className={`text-sm font-semibold ${healthTextColors[plantInfo.health]}`}>
                {plantInfo.health}
              </span>
            </div>
          </div>

          {/* AI Summary */}
          <div className="ai-panel mt-2">
            <p className="text-sm text-foreground/80 leading-relaxed">
              <span className="font-semibold text-primary">🧠 AI Insight:</span>{' '}
              {plantInfo.aiSummary}
            </p>
          </div>

          <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground">
            <Calendar className="w-3.5 h-3.5" />
            <span>Day {plantInfo.daysSincePlanting} since planting</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlantStatusCard;
