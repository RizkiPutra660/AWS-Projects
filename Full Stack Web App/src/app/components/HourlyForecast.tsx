import { Sun, Cloud, CloudRain, CloudSun } from 'lucide-react';

export function HourlyForecast() {
  const hours = [
    { time: 'Now', temp: 72, icon: CloudSun },
    { time: '3 PM', temp: 74, icon: Sun },
    { time: '4 PM', temp: 75, icon: Sun },
    { time: '5 PM', temp: 73, icon: CloudSun },
    { time: '6 PM', temp: 71, icon: Cloud },
    { time: '7 PM', temp: 69, icon: Cloud },
    { time: '8 PM', temp: 67, icon: CloudRain },
    { time: '9 PM', temp: 66, icon: CloudRain },
    { time: '10 PM', temp: 65, icon: Cloud },
    { time: '11 PM', temp: 64, icon: Cloud },
    { time: '12 AM', temp: 63, icon: Cloud },
    { time: '1 AM', temp: 62, icon: Cloud },
  ];

  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Hourly Forecast</h2>
      
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-4 pb-2">
          {hours.map((hour, index) => {
            const Icon = hour.icon;
            return (
              <div
                key={index}
                className="flex flex-col items-center gap-3 min-w-[90px] p-4 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <span className="text-sm font-medium text-gray-600">{hour.time}</span>
                
                {/* Weather Icon */}
                <Icon className="w-10 h-10 text-amber-400" strokeWidth={1.5} />
                
                <span className="text-lg font-semibold text-gray-800">{hour.temp}°</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}