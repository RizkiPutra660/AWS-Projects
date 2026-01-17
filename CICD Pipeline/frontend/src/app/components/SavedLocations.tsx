import { MapPin, Trash2, GripVertical, Plus, X, ArrowLeft } from 'lucide-react';
import { Sun, Cloud, CloudRain, CloudSun } from 'lucide-react';
import { useState } from 'react';
import { motion, Reorder } from 'motion/react';

interface SavedLocation {
  id: string;
  city: string;
  country: string;
  temp: number;
  condition: string;
  icon: string;
  high: number;
  low: number;
}

interface SavedLocationsProps {
  onClose: () => void;
  onOpenSearch: () => void;
}

export function SavedLocations({ onClose, onOpenSearch }: SavedLocationsProps) {
  const [locations, setLocations] = useState<SavedLocation[]>([
    {
      id: '1',
      city: 'San Francisco',
      country: 'USA',
      temp: 22,
      condition: 'Partly Cloudy',
      icon: 'CloudSun',
      high: 26,
      low: 18,
    },
    {
      id: '2',
      city: 'New York',
      country: 'USA',
      temp: 14,
      condition: 'Cloudy',
      icon: 'Cloud',
      high: 17,
      low: 12,
    },
    {
      id: '3',
      city: 'London',
      country: 'UK',
      temp: 11,
      condition: 'Rainy',
      icon: 'CloudRain',
      high: 13,
      low: 9,
    },
    {
      id: '4',
      city: 'Tokyo',
      country: 'Japan',
      temp: 20,
      condition: 'Sunny',
      icon: 'Sun',
      high: 23,
      low: 17,
    },
    {
      id: '5',
      city: 'Paris',
      country: 'France',
      temp: 16,
      condition: 'Partly Cloudy',
      icon: 'CloudSun',
      high: 18,
      low: 13,
    },
  ]);

  const getWeatherIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sun':
        return Sun;
      case 'Cloud':
        return Cloud;
      case 'CloudRain':
        return CloudRain;
      case 'CloudSun':
        return CloudSun;
      default:
        return Sun;
    }
  };

  const handleDelete = (id: string) => {
    setLocations(locations.filter(loc => loc.id !== id));
  };

  const handleAddLocation = () => {
    onOpenSearch();
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-cyan-400 via-sky-300 to-blue-200 z-40 overflow-y-auto">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <h1 className="text-2xl font-bold text-white">My Saved Locations</h1>
          </div>
          <button
            onClick={handleAddLocation}
            className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5 text-white" />
            <span className="text-sm font-medium text-white">Add Location</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-6">
          <p className="text-white/90 text-lg">
            {locations.length} {locations.length === 1 ? 'location' : 'locations'} saved
          </p>
          <p className="text-white/70 text-sm mt-1">
            Drag to reorder • Tap a city to view details
          </p>
        </div>

        {/* Saved Locations List */}
        {locations.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 text-center">
            <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
              <MapPin className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No saved locations</h3>
            <p className="text-gray-600 mb-6">Start adding cities to track their weather</p>
            <button
              onClick={handleAddLocation}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
            >
              Add Your First Location
            </button>
          </div>
        ) : (
          <Reorder.Group axis="y" values={locations} onReorder={setLocations} className="space-y-4">
            {locations.map((location) => {
              const Icon = getWeatherIcon(location.icon);
              
              return (
                <Reorder.Item
                  key={location.id}
                  value={location}
                  className="cursor-grab active:cursor-grabbing"
                >
                  <motion.div
                    layout
                    className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden"
                  >
                    <div className="flex items-center p-5">
                      {/* Drag Handle */}
                      <div className="mr-4 text-gray-400 hover:text-gray-600 transition-colors">
                        <GripVertical className="w-6 h-6" />
                      </div>

                      {/* City Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0" />
                          <h3 className="text-xl font-semibold text-gray-900 truncate">
                            {location.city}
                          </h3>
                        </div>
                        <p className="text-sm text-gray-500">{location.country}</p>
                      </div>

                      {/* Weather Info */}
                      <div className="flex items-center gap-6 mr-4">
                        {/* Icon and Condition */}
                        <div className="flex items-center gap-3">
                          <Icon className="w-10 h-10 text-amber-400" strokeWidth={1.5} />
                          <div className="text-right">
                            <p className="text-sm text-gray-600">{location.condition}</p>
                            <p className="text-xs text-gray-500">H: {location.high}° L: {location.low}°</p>
                          </div>
                        </div>

                        {/* Temperature */}
                        <div className="text-right">
                          <p className="text-4xl font-bold text-gray-900">{location.temp}°</p>
                        </div>
                      </div>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDelete(location.id)}
                        className="ml-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </motion.div>
                </Reorder.Item>
              );
            })}
          </Reorder.Group>
        )}

        {/* Tips Section */}
        {locations.length > 0 && (
          <div className="mt-8 bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
            <h3 className="text-lg font-semibold text-white mb-3">Tips</h3>
            <ul className="space-y-2 text-white/80 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-white/60">•</span>
                <span>Click and drag the grip icon to reorder your locations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-white/60">•</span>
                <span>Tap on a city card to view its detailed weather forecast</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-white/60">•</span>
                <span>Use the trash icon to remove locations you no longer need</span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
