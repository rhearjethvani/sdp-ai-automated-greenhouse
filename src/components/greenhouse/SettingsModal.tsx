import { useState } from 'react';
import { Settings, X } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const SettingsModal = () => {
  const [moistureThreshold, setMoistureThreshold] = useState([30]);
  const [lightDuration, setLightDuration] = useState([14]);
  const [tempRange, setTempRange] = useState([60, 85]);
  const [predictionWindow, setPredictionWindow] = useState<6 | 12>(6);
  const [experimentalMode, setExperimentalMode] = useState(false);
  const [learningMode, setLearningMode] = useState(true);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="p-2.5 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors">
          <Settings className="w-5 h-5 text-secondary-foreground" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">Greenhouse Settings</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Moisture threshold */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Moisture Threshold: {moistureThreshold[0]}%
            </label>
            <Slider
              value={moistureThreshold}
              onValueChange={setMoistureThreshold}
              min={10}
              max={80}
              step={1}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Irrigation triggers below this level
            </p>
          </div>

          {/* Light duration */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Light Exposure: {lightDuration[0]}h / day
            </label>
            <Slider
              value={lightDuration}
              onValueChange={setLightDuration}
              min={4}
              max={20}
              step={0.5}
              className="w-full"
            />
          </div>

          {/* Temperature range */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Temperature Range: {tempRange[0]}°F – {tempRange[1]}°F
            </label>
            <Slider
              value={tempRange}
              onValueChange={setTempRange}
              min={40}
              max={100}
              step={1}
              className="w-full"
            />
          </div>

          {/* Prediction window */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              AI Prediction Window
            </label>
            <div className="flex rounded-lg bg-secondary p-1">
              <button
                onClick={() => setPredictionWindow(6)}
                className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  predictionWindow === 6 ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground'
                }`}
              >
                6 hours
              </button>
              <button
                onClick={() => setPredictionWindow(12)}
                className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  predictionWindow === 12 ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground'
                }`}
              >
                12 hours
              </button>
            </div>
          </div>

          {/* Advanced */}
          <div className="border-t border-border pt-4 space-y-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Advanced
            </p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Experimental Predictive Mode</p>
                <p className="text-xs text-muted-foreground">Use beta AI models</p>
              </div>
              <Switch checked={experimentalMode} onCheckedChange={setExperimentalMode} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Learning Mode</p>
                <p className="text-xs text-muted-foreground">Collect more data before adjusting</p>
              </div>
              <Switch checked={learningMode} onCheckedChange={setLearningMode} />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;
