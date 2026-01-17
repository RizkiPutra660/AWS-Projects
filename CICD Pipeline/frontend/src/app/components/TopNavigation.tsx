import { Search, MapPin, X, Heart } from 'lucide-react';
import { useState } from 'react';

interface TopNavigationProps {
  onOpenSavedLocations: () => void;
  onOpenHealthForecast: () => void;
  onSearchOpen?: (isOpen: boolean) => void;
}

export function TopNavigation({ onOpenSavedLocations, onOpenHealthForecast, onSearchOpen }: TopNavigationProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleSearchToggle = (open: boolean) => {
    setIsSearchOpen(open);
    onSearchOpen?.(open);
  };

  return (
    <>
      <nav className="bg-white/10 backdrop-blur-md border-b border-white/20 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <div className="w-6 h-6 bg-white/40 rounded-full"></div>
            </div>
            <span className="text-xl font-semibold text-white">Weather</span>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => handleSearchToggle(true)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <Search className="w-5 h-5 text-white" />
            </button>
            <button 
              onClick={onOpenHealthForecast}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg transition-colors"
            >
              <Heart className="w-4 h-4 text-white" />
              <span className="text-sm font-medium text-white">Health</span>
            </button>
            <button 
              onClick={onOpenSavedLocations}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg transition-colors"
            >
              <MapPin className="w-4 h-4 text-white" />
              <span className="text-sm font-medium text-white">Saved Locations</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Search Modal */}
      {isSearchOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-20 px-4"
          onClick={() => handleSearchToggle(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Header */}
            <div className="flex items-center gap-3 p-4 border-b border-gray-200">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for a city..."
                className="flex-1 text-lg outline-none text-gray-800 placeholder:text-gray-400"
                autoFocus
              />
              <button
                onClick={() => handleSearchToggle(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Search Results */}
            <div className="p-4 space-y-2">
              {['New York, USA', 'London, UK', 'Tokyo, Japan', 'Paris, France', 'Sydney, Australia'].map((city, index) => (
                <button
                  key={index}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-3"
                  onClick={() => handleSearchToggle(false)}
                >
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700">{city}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}