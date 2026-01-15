import { TopNavigation } from '@/app/components/TopNavigation';
import { CurrentWeather } from '@/app/components/CurrentWeather';
import { HourlyForecast } from '@/app/components/HourlyForecast';
import { WeeklyForecast } from '@/app/components/WeeklyForecast';
import { DetailedMetrics } from '@/app/components/DetailedMetrics';
import { DetailedWeatherCard } from '@/app/components/DetailedWeatherCard';
import { SavedLocations } from '@/app/components/SavedLocations';
import { PersonalHealthForecast } from '@/app/components/PersonalHealthForecast';
import { useState } from 'react';

export default function App() {
  const [showSavedLocations, setShowSavedLocations] = useState(false);
  const [showHealthForecast, setShowHealthForecast] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Mock time: 2 PM (14:00) - daytime
  const hour = 14;
  
  // Determine gradient based on time
  // Night: 0-5, 21-23 -> deep blue
  // Morning: 6-11 -> blue to cyan
  // Day: 12-17 -> light cyan
  // Evening: 18-20 -> cyan to blue
  const getGradient = (hour: number) => {
    if (hour >= 0 && hour < 6) {
      return 'from-slate-900 via-blue-900 to-indigo-900'; // Night
    } else if (hour >= 6 && hour < 12) {
      return 'from-blue-400 via-cyan-300 to-sky-200'; // Morning
    } else if (hour >= 12 && hour < 18) {
      return 'from-cyan-400 via-sky-300 to-blue-200'; // Day (2 PM falls here)
    } else if (hour >= 18 && hour < 21) {
      return 'from-orange-400 via-pink-300 to-purple-400'; // Evening
    } else {
      return 'from-indigo-900 via-blue-900 to-slate-900'; // Night
    }
  };

  const handleOpenSearch = () => {
    setIsSearchOpen(true);
    setShowSavedLocations(false);
    setShowHealthForecast(false);
  };

  return (
    <>
      {showHealthForecast ? (
        <PersonalHealthForecast onClose={() => setShowHealthForecast(false)} />
      ) : showSavedLocations ? (
        <SavedLocations 
          onClose={() => setShowSavedLocations(false)} 
          onOpenSearch={handleOpenSearch}
        />
      ) : (
        <div className={`min-h-screen bg-gradient-to-br ${getGradient(hour)} transition-colors duration-1000`}>
          <TopNavigation 
            onOpenSavedLocations={() => setShowSavedLocations(true)}
            onOpenHealthForecast={() => setShowHealthForecast(true)}
            onSearchOpen={setIsSearchOpen}
          />
          
          <main className="max-w-7xl mx-auto px-6 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Main Dashboard */}
              <div className="lg:col-span-2 space-y-6">
                <DetailedWeatherCard />
                <HourlyForecast />
                <DetailedMetrics />
              </div>
              
              {/* Right Column - Weekly Forecast */}
              <div className="lg:col-span-1">
                <WeeklyForecast />
              </div>
            </div>
          </main>
        </div>
      )}
    </>
  );
}