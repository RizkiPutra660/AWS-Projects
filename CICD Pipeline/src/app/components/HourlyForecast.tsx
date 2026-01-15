import { Sun, Cloud, CloudRain, CloudSun } from 'lucide-react';

export function HourlyForecast() {
  const hours = [
    { time: 'Now', temp: 22, icon: CloudSun },
    { time: '15:00', temp: 23, icon: Sun },
    { time: '16:00', temp: 24, icon: Sun },
    { time: '17:00', temp: 23, icon: CloudSun },
    { time: '18:00', temp: 22, icon: Cloud },
    { time: '19:00', temp: 21, icon: Cloud },
    { time: '20:00', temp: 19, icon: CloudRain },
    { time: '21:00', temp: 19, icon: CloudRain },
    { time: '22:00', temp: 18, icon: Cloud },
    { time: '23:00', temp: 18, icon: Cloud },
    { time: '00:00', temp: 17, icon: Cloud },
    { time: '01:00', temp: 17, icon: Cloud },
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