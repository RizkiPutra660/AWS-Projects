import { MapPin, Thermometer, Droplets, Wind, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

export function DetailedWeatherCard() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 shadow-2xl border border-white/50 backdrop-blur-sm">
      {/* Header: City and Time */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-5 h-5 text-blue-500" />
            <h1 className="text-3xl font-bold text-gray-900">San Francisco</h1>
          </div>
          <p className="text-gray-500 text-sm">California, United States</p>
        </div>
        <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full">
          <Clock className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-600">{formatTime(currentTime)}</span>
        </div>
      </div>

      {/* Main Content: Temperature and Icon */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex-1">
          {/* Temperature Display */}
          <div className="flex items-start mb-4">
            <motion.span 
              className="text-[120px] font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-cyan-500 leading-none tracking-tighter"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              72
            </motion.span>
            <span className="text-6xl font-bold text-gray-400 mt-4">°F</span>
          </div>

          {/* Condition Description */}
          <div className="space-y-2">
            <h2 className="text-4xl font-semibold text-gray-800">Partly Cloudy</h2>
            <p className="text-lg text-gray-500">Comfortable weather with scattered clouds</p>
          </div>
        </div>

        {/* Animated Weather Icon */}
        <div className="relative">
          <motion.div
            className="relative"
            animate={{ 
              y: [0, -10, 0],
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut" 
            }}
          >
            {/* Sun */}
            <motion.div
              className="absolute top-0 left-0"
              animate={{ 
                rotate: 360,
              }}
              transition={{ 
                duration: 20,
                repeat: Infinity,
                ease: "linear" 
              }}
            >
              <svg width="180" height="180" viewBox="0 0 180 180" fill="none">
                {/* Sun rays */}
                {[...Array(8)].map((_, i) => (
                  <motion.line
                    key={i}
                    x1="90"
                    y1="20"
                    x2="90"
                    y2="5"
                    stroke="#FCD34D"
                    strokeWidth="4"
                    strokeLinecap="round"
                    transform={`rotate(${i * 45} 90 90)`}
                    initial={{ opacity: 0.5 }}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.1,
                      ease: "easeInOut" 
                    }}
                  />
                ))}
                {/* Sun circle */}
                <circle cx="90" cy="90" r="35" fill="#FCD34D" />
                <circle cx="90" cy="90" r="30" fill="#FDE68A" />
              </svg>
            </motion.div>

            {/* Cloud */}
            <motion.svg 
              width="180" 
              height="180" 
              viewBox="0 0 180 180" 
              fill="none"
              className="relative"
              animate={{ 
                x: [0, 15, 0],
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut" 
              }}
            >
              <g transform="translate(20, 80)">
                <ellipse cx="35" cy="25" rx="25" ry="20" fill="#E5E7EB" />
                <ellipse cx="60" cy="20" rx="30" ry="25" fill="#F3F4F6" />
                <ellipse cx="85" cy="25" rx="25" ry="20" fill="#D1D5DB" />
                <rect x="10" y="25" width="100" height="20" fill="#E5E7EB" />
              </g>
            </motion.svg>
          </motion.div>
        </div>
      </div>

      {/* Supplementary Data Points */}
      <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
        {/* Feels Like */}
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-5 border border-orange-200">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 bg-orange-200 rounded-lg flex items-center justify-center">
              <Thermometer className="w-5 h-5 text-orange-600" strokeWidth={2.5} />
            </div>
            <span className="text-sm font-medium text-orange-900">Feels Like</span>
          </div>
          <p className="text-3xl font-bold text-orange-900">68°</p>
          <p className="text-xs text-orange-700 mt-1">Slightly cooler</p>
        </div>

        {/* Humidity */}
        <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-2xl p-5 border border-cyan-200">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 bg-cyan-200 rounded-lg flex items-center justify-center">
              <Droplets className="w-5 h-5 text-cyan-600" strokeWidth={2.5} />
            </div>
            <span className="text-sm font-medium text-cyan-900">Humidity</span>
          </div>
          <p className="text-3xl font-bold text-cyan-900">65%</p>
          <p className="text-xs text-cyan-700 mt-1">Moderate level</p>
        </div>

        {/* Wind Speed */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-5 border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 bg-blue-200 rounded-lg flex items-center justify-center">
              <Wind className="w-5 h-5 text-blue-600" strokeWidth={2.5} />
            </div>
            <span className="text-sm font-medium text-blue-900">Wind Speed</span>
          </div>
          <p className="text-3xl font-bold text-blue-900">12 mph</p>
          <p className="text-xs text-blue-700 mt-1">Northwest wind</p>
        </div>
      </div>

      {/* High/Low */}
      <div className="flex items-center justify-center gap-8 mt-6 pt-6 border-t border-gray-200">
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-1">Today's High</p>
          <p className="text-2xl font-bold text-gray-900">78°</p>
        </div>
        <div className="w-px h-12 bg-gray-300"></div>
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-1">Today's Low</p>
          <p className="text-2xl font-bold text-gray-900">65°</p>
        </div>
      </div>
    </div>
  );
}
