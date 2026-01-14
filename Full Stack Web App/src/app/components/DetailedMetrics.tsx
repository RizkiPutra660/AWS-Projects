import { Wind, Droplets, Sun, Eye, Gauge, Compass } from 'lucide-react';
import { useState } from 'react';
import { X } from 'lucide-react';

export function DetailedMetrics() {
  const [isOpen, setIsOpen] = useState(false);

  const metrics = [
    { icon: Wind, label: 'Wind Speed', value: '12 mph', detail: 'Northwest', color: 'text-blue-500', bg: 'bg-blue-50' },
    { icon: Droplets, label: 'Humidity', value: '65%', detail: 'Normal', color: 'text-cyan-500', bg: 'bg-cyan-50' },
    { icon: Sun, label: 'UV Index', value: '6', detail: 'High', color: 'text-amber-500', bg: 'bg-amber-50' },
    { icon: Eye, label: 'Visibility', value: '10 mi', detail: 'Clear', color: 'text-purple-500', bg: 'bg-purple-50' },
    { icon: Gauge, label: 'Pressure', value: '30.12 in', detail: 'Steady', color: 'text-green-500', bg: 'bg-green-50' },
    { icon: Compass, label: 'Wind Direction', value: 'NW', detail: '315°', color: 'text-indigo-500', bg: 'bg-indigo-50' },
  ];

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white hover:bg-gray-50 text-gray-800 font-semibold px-6 py-4 rounded-2xl transition-all shadow-lg hover:shadow-xl"
      >
        {isOpen ? 'Hide Detailed Metrics' : 'Show Detailed Metrics'}
      </button>

      {/* Drawer/Panel */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-end" onClick={() => setIsOpen(false)}>
          <div
            className="bg-white w-full max-w-md h-full shadow-2xl overflow-y-auto animate-in slide-in-from-right"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Detailed Metrics</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {metrics.map((metric, index) => {
                const Icon = metric.icon;
                return (
                  <div
                    key={index}
                    className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-14 h-14 ${metric.bg} rounded-xl flex items-center justify-center`}>
                        <Icon className={`w-7 h-7 ${metric.color}`} strokeWidth={2} />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-600 mb-1">
                          {metric.label}
                        </div>
                        <div className="text-3xl font-bold text-gray-900 mb-1">
                          {metric.value}
                        </div>
                        <div className="text-sm text-gray-500">
                          {metric.detail}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}