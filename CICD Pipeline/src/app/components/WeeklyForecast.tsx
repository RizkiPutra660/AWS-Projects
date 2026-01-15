import { Sun, Cloud, CloudRain, CloudSun, CloudDrizzle, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export function WeeklyForecast() {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const days = [
    { 
      day: 'Monday', 
      condition: 'Partly Cloudy', 
      high: 26, 
      low: 18, 
      icon: CloudSun,
      hourly: [
        { time: '06:00', temp: 18, icon: Cloud },
        { time: '09:00', temp: 20, icon: CloudSun },
        { time: '12:00', temp: 23, icon: CloudSun },
        { time: '15:00', temp: 26, icon: Sun },
        { time: '18:00', temp: 23, icon: CloudSun },
        { time: '21:00', temp: 20, icon: Cloud },
      ]
    },
    { 
      day: 'Tuesday', 
      condition: 'Sunny', 
      high: 27, 
      low: 19, 
      icon: Sun,
      hourly: [
        { time: '06:00', temp: 19, icon: CloudSun },
        { time: '09:00', temp: 22, icon: Sun },
        { time: '12:00', temp: 24, icon: Sun },
        { time: '15:00', temp: 27, icon: Sun },
        { time: '18:00', temp: 24, icon: Sun },
        { time: '21:00', temp: 21, icon: CloudSun },
      ]
    },
    { 
      day: 'Wednesday', 
      condition: 'Rainy', 
      high: 24, 
      low: 17, 
      icon: CloudRain,
      hourly: [
        { time: '06:00', temp: 17, icon: CloudRain },
        { time: '09:00', temp: 18, icon: CloudRain },
        { time: '12:00', temp: 21, icon: CloudDrizzle },
        { time: '15:00', temp: 24, icon: CloudDrizzle },
        { time: '18:00', temp: 22, icon: CloudRain },
        { time: '21:00', temp: 19, icon: CloudRain },
      ]
    },
    { 
      day: 'Thursday', 
      condition: 'Cloudy', 
      high: 23, 
      low: 16, 
      icon: Cloud,
      hourly: [
        { time: '06:00', temp: 16, icon: Cloud },
        { time: '09:00', temp: 18, icon: Cloud },
        { time: '12:00', temp: 21, icon: Cloud },
        { time: '15:00', temp: 23, icon: Cloud },
        { time: '18:00', temp: 21, icon: Cloud },
        { time: '21:00', temp: 18, icon: Cloud },
      ]
    },
    { 
      day: 'Friday', 
      condition: 'Partly Cloudy', 
      high: 24, 
      low: 18, 
      icon: CloudSun,
      hourly: [
        { time: '06:00', temp: 18, icon: Cloud },
        { time: '09:00', temp: 20, icon: CloudSun },
        { time: '12:00', temp: 23, icon: CloudSun },
        { time: '15:00', temp: 24, icon: Sun },
        { time: '18:00', temp: 23, icon: CloudSun },
        { time: '21:00', temp: 20, icon: Cloud },
      ]
    },
    { 
      day: 'Saturday', 
      condition: 'Light Rain', 
      high: 26, 
      low: 19, 
      icon: CloudDrizzle,
      hourly: [
        { time: '06:00', temp: 19, icon: Cloud },
        { time: '09:00', temp: 21, icon: CloudDrizzle },
        { time: '12:00', temp: 24, icon: CloudDrizzle },
        { time: '15:00', temp: 26, icon: CloudSun },
        { time: '18:00', temp: 24, icon: CloudDrizzle },
        { time: '21:00', temp: 21, icon: Cloud },
      ]
    },
    { 
      day: 'Sunday', 
      condition: 'Sunny', 
      high: 27, 
      low: 20, 
      icon: Sun,
      hourly: [
        { time: '06:00', temp: 20, icon: CloudSun },
        { time: '09:00', temp: 23, icon: Sun },
        { time: '12:00', temp: 26, icon: Sun },
        { time: '15:00', temp: 27, icon: Sun },
        { time: '18:00', temp: 26, icon: Sun },
        { time: '21:00', temp: 22, icon: CloudSun },
      ]
    },
  ];

  const handleDayClick = (index: number) => {
    setSelectedDay(selectedDay === index ? null : index);
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">7-Day Forecast</h2>
      
      <div className="space-y-1">
        {days.map((forecast, index) => {
          const Icon = forecast.icon;
          const isSelected = selectedDay === index;
          
          return (
            <div key={index}>
              <button
                onClick={() => handleDayClick(index)}
                className={`w-full flex items-center justify-between py-4 px-3 rounded-xl transition-all cursor-pointer ${
                  isSelected 
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg' 
                    : 'hover:bg-gray-50'
                }`}
              >
                <span className={`text-base font-medium w-28 text-left ${
                  isSelected ? 'text-white' : 'text-gray-800'
                }`}>
                  {forecast.day}
                </span>
                
                {/* Icon and condition */}
                <div className="flex items-center gap-3 flex-1">
                  <Icon 
                    className={`w-8 h-8 ${isSelected ? 'text-white' : 'text-amber-400'}`} 
                    strokeWidth={1.5} 
                  />
                  <span className={`text-sm ${isSelected ? 'text-white/90' : 'text-gray-600'}`}>
                    {forecast.condition}
                  </span>
                </div>
                
                {/* Temperature range */}
                <div className="flex items-center gap-3 min-w-[100px] justify-end">
                  <span className={`text-sm ${isSelected ? 'text-white/80' : 'text-gray-500'}`}>
                    L: {forecast.low}°
                  </span>
                  <span className={`text-base font-semibold ${isSelected ? 'text-white' : 'text-gray-800'}`}>
                    H: {forecast.high}°
                  </span>
                </div>

                {/* Expand/Collapse Icon */}
                {isSelected ? (
                  <ChevronUp className="w-5 h-5 text-white ml-2" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400 ml-2" />
                )}
              </button>

              {/* Hourly Details - Expandable */}
              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="px-3 py-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-b-xl mt-1">
                      <h3 className="text-sm font-semibold text-gray-700 mb-3 px-2">
                        Hourly Forecast for {forecast.day}
                      </h3>
                      <div className="grid grid-cols-3 gap-3">
                        {forecast.hourly.map((hour, hourIndex) => {
                          const HourIcon = hour.icon;
                          return (
                            <motion.div
                              key={hourIndex}
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ delay: hourIndex * 0.05 }}
                              className="flex flex-col items-center gap-2 bg-white rounded-lg p-3 shadow-sm"
                            >
                              <span className="text-xs font-medium text-gray-600">
                                {hour.time}
                              </span>
                              <HourIcon className="w-7 h-7 text-amber-400" strokeWidth={1.5} />
                              <span className="text-base font-semibold text-gray-800">
                                {hour.temp}°
                              </span>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}