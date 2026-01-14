import { Sun, Cloud, CloudRain, CloudSun, CloudDrizzle, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export function WeeklyForecast() {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const days = [
    { 
      day: 'Monday', 
      condition: 'Partly Cloudy', 
      high: 78, 
      low: 65, 
      icon: CloudSun,
      hourly: [
        { time: '6 AM', temp: 65, icon: Cloud },
        { time: '9 AM', temp: 68, icon: CloudSun },
        { time: '12 PM', temp: 74, icon: CloudSun },
        { time: '3 PM', temp: 78, icon: Sun },
        { time: '6 PM', temp: 73, icon: CloudSun },
        { time: '9 PM', temp: 68, icon: Cloud },
      ]
    },
    { 
      day: 'Tuesday', 
      condition: 'Sunny', 
      high: 80, 
      low: 67, 
      icon: Sun,
      hourly: [
        { time: '6 AM', temp: 67, icon: CloudSun },
        { time: '9 AM', temp: 71, icon: Sun },
        { time: '12 PM', temp: 76, icon: Sun },
        { time: '3 PM', temp: 80, icon: Sun },
        { time: '6 PM', temp: 76, icon: Sun },
        { time: '9 PM', temp: 70, icon: CloudSun },
      ]
    },
    { 
      day: 'Wednesday', 
      condition: 'Rainy', 
      high: 75, 
      low: 63, 
      icon: CloudRain,
      hourly: [
        { time: '6 AM', temp: 63, icon: CloudRain },
        { time: '9 AM', temp: 65, icon: CloudRain },
        { time: '12 PM', temp: 70, icon: CloudDrizzle },
        { time: '3 PM', temp: 75, icon: CloudDrizzle },
        { time: '6 PM', temp: 72, icon: CloudRain },
        { time: '9 PM', temp: 66, icon: CloudRain },
      ]
    },
    { 
      day: 'Thursday', 
      condition: 'Cloudy', 
      high: 73, 
      low: 61, 
      icon: Cloud,
      hourly: [
        { time: '6 AM', temp: 61, icon: Cloud },
        { time: '9 AM', temp: 64, icon: Cloud },
        { time: '12 PM', temp: 69, icon: Cloud },
        { time: '3 PM', temp: 73, icon: Cloud },
        { time: '6 PM', temp: 70, icon: Cloud },
        { time: '9 PM', temp: 65, icon: Cloud },
      ]
    },
    { 
      day: 'Friday', 
      condition: 'Partly Cloudy', 
      high: 76, 
      low: 64, 
      icon: CloudSun,
      hourly: [
        { time: '6 AM', temp: 64, icon: Cloud },
        { time: '9 AM', temp: 68, icon: CloudSun },
        { time: '12 PM', temp: 73, icon: CloudSun },
        { time: '3 PM', temp: 76, icon: Sun },
        { time: '6 PM', temp: 74, icon: CloudSun },
        { time: '9 PM', temp: 68, icon: Cloud },
      ]
    },
    { 
      day: 'Saturday', 
      condition: 'Light Rain', 
      high: 79, 
      low: 66, 
      icon: CloudDrizzle,
      hourly: [
        { time: '6 AM', temp: 66, icon: Cloud },
        { time: '9 AM', temp: 70, icon: CloudDrizzle },
        { time: '12 PM', temp: 75, icon: CloudDrizzle },
        { time: '3 PM', temp: 79, icon: CloudSun },
        { time: '6 PM', temp: 76, icon: CloudDrizzle },
        { time: '9 PM', temp: 70, icon: Cloud },
      ]
    },
    { 
      day: 'Sunday', 
      condition: 'Sunny', 
      high: 81, 
      low: 68, 
      icon: Sun,
      hourly: [
        { time: '6 AM', temp: 68, icon: CloudSun },
        { time: '9 AM', temp: 73, icon: Sun },
        { time: '12 PM', temp: 78, icon: Sun },
        { time: '3 PM', temp: 81, icon: Sun },
        { time: '6 PM', temp: 78, icon: Sun },
        { time: '9 PM', temp: 72, icon: CloudSun },
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