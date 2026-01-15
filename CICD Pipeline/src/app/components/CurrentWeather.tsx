import { MapPin, CloudSun } from 'lucide-react';

export function CurrentWeather() {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-xl">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Location */}
          <div className="flex items-center gap-2 mb-8">
            <MapPin className="w-6 h-6 text-blue-500" />
            <span className="text-2xl font-medium text-gray-800">San Francisco, CA</span>
          </div>
          
          {/* Temperature */}
          <div className="flex items-start gap-6 mb-8">
            <div className="text-9xl font-bold text-gray-900 leading-none">72°</div>
            <div className="pt-6">
              <div className="text-3xl font-semibold text-gray-700 mb-2">Partly Cloudy</div>
              <div className="text-lg text-gray-500">
                H: 78° L: 65°
              </div>
            </div>
          </div>
          
          {/* Date/Time */}
          <div className="text-base text-gray-500">
            Monday, January 14 • 2:30 PM
          </div>
        </div>
        
        {/* Weather Icon */}
        <div className="flex items-center justify-center">
          <CloudSun className="w-40 h-40 text-amber-400 drop-shadow-lg" strokeWidth={1.5} />
        </div>
      </div>
    </div>
  );
}