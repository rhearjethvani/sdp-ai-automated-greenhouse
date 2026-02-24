import { useState } from 'react';
import { Sprout } from 'lucide-react';
import PlantStatusCard from '@/components/greenhouse/PlantStatusCard';
import SensorCard from '@/components/greenhouse/SensorCard';
import PredictionPanel from '@/components/greenhouse/PredictionPanel';
import ControlsPanel from '@/components/greenhouse/ControlsPanel';
import AlertBanner from '@/components/greenhouse/AlertBanner';
import SettingsModal from '@/components/greenhouse/SettingsModal';
import GrowthInsights from '@/components/greenhouse/GrowthInsights';
import { sensorData } from '@/lib/greenhouse-data';

type Tab = 'dashboard' | 'insights';

const Index = () => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sprout className="w-6 h-6 text-primary" />
            <h1 className="text-lg font-serif font-semibold text-foreground">GreenMind</h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Tab switcher */}
            <div className="flex rounded-lg bg-secondary p-1">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'dashboard'
                    ? 'bg-card text-primary shadow-sm'
                    : 'text-muted-foreground'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('insights')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'insights'
                    ? 'bg-card text-primary shadow-sm'
                    : 'text-muted-foreground'
                }`}
              >
                Insights
              </button>
            </div>
            <SettingsModal />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Alerts */}
        <AlertBanner />

        {activeTab === 'dashboard' ? (
          <>
            {/* Plant Status */}
            <PlantStatusCard />

            {/* Sensor Grid */}
            <section>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Real-Time Sensors
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {sensorData.map(sensor => (
                  <SensorCard key={sensor.label} sensor={sensor} />
                ))}
              </div>
            </section>

            {/* Prediction + Controls */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <PredictionPanel />
              </div>
              <div>
                <ControlsPanel />
              </div>
            </div>
          </>
        ) : (
          <GrowthInsights />
        )}
      </main>
    </div>
  );
};

export default Index;
