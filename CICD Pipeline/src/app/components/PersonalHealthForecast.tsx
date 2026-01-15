import { ArrowLeft, AlertTriangle, CheckCircle, TrendingUp, TrendingDown, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';

interface HealthCondition {
  id: string;
  name: string;
  emoji: string;
  headline: string;
  riskLevel: 'low' | 'medium' | 'high';
  recommendations: string[];
  metrics: {
    name: string;
    value: string;
    level: 'low' | 'medium' | 'high';
    percentage: number;
    description: string;
  }[];
  hourlyRisk: {
    time: string;
    risk: 'low' | 'medium' | 'high';
  }[];
}

const healthConditions: HealthCondition[] = [
  {
    id: 'allergies',
    name: 'Allergies',
    emoji: '🌸',
    headline: 'High Allergy Alert',
    riskLevel: 'high',
    recommendations: [
      'Take antihistamines before 10 AM',
      'Keep windows closed during peak pollen hours (10 AM - 4 PM)',
      'Wear sunglasses outdoors to protect eyes from pollen'
    ],
    metrics: [
      { name: 'Pollen Count', value: 'Very High', level: 'high', percentage: 85, description: 'Tree and grass pollen elevated' },
      { name: 'Humidity', value: '45%', level: 'medium', percentage: 45, description: 'Moderate - ideal for pollen spread' },
      { name: 'Wind Speed', value: '12 mph', level: 'high', percentage: 60, description: 'Strong winds increase pollen dispersal' },
      { name: 'Air Quality', value: 'Moderate', level: 'medium', percentage: 55, description: 'PM2.5: 35 μg/m³' }
    ],
    hourlyRisk: [
      { time: '6 AM', risk: 'low' },
      { time: '9 AM', risk: 'medium' },
      { time: '12 PM', risk: 'high' },
      { time: '3 PM', risk: 'high' },
      { time: '6 PM', risk: 'medium' },
      { time: '9 PM', risk: 'low' }
    ]
  },
  {
    id: 'migraines',
    name: 'Migraines',
    emoji: '🧠',
    headline: 'Migraine Risk Elevated',
    riskLevel: 'medium',
    recommendations: [
      'Monitor caffeine intake - stay consistent',
      'Avoid bright sunlight; wear polarized sunglasses',
      'Stay well-hydrated throughout the day'
    ],
    metrics: [
      { name: 'Barometric Pressure', value: 'Falling', level: 'high', percentage: 75, description: 'Rapid pressure drop detected' },
      { name: 'Humidity', value: '65%', level: 'medium', percentage: 65, description: 'Moderate - can trigger symptoms' },
      { name: 'Temperature Change', value: '+8°F', level: 'medium', percentage: 60, description: 'Sudden change from yesterday' },
      { name: 'UV Index', value: '6 (High)', level: 'high', percentage: 70, description: 'Bright light may trigger headaches' }
    ],
    hourlyRisk: [
      { time: '6 AM', risk: 'medium' },
      { time: '9 AM', risk: 'high' },
      { time: '12 PM', risk: 'high' },
      { time: '3 PM', risk: 'medium' },
      { time: '6 PM', risk: 'low' },
      { time: '9 PM', risk: 'low' }
    ]
  },
  {
    id: 'joint-pain',
    name: 'Joint Pain',
    emoji: '🦴',
    headline: 'Low Joint Discomfort Expected',
    riskLevel: 'low',
    recommendations: [
      'Great day for gentle exercise and stretching',
      'Take advantage of stable conditions for outdoor activities',
      'Continue regular anti-inflammatory routine'
    ],
    metrics: [
      { name: 'Barometric Pressure', value: 'Stable', level: 'low', percentage: 20, description: 'No significant changes expected' },
      { name: 'Humidity', value: '55%', level: 'low', percentage: 30, description: 'Comfortable range' },
      { name: 'Temperature', value: '72°F', level: 'low', percentage: 25, description: 'Mild and consistent' },
      { name: 'Precipitation', value: '0%', level: 'low', percentage: 10, description: 'No rain expected' }
    ],
    hourlyRisk: [
      { time: '6 AM', risk: 'low' },
      { time: '9 AM', risk: 'low' },
      { time: '12 PM', risk: 'low' },
      { time: '3 PM', risk: 'low' },
      { time: '6 PM', risk: 'low' },
      { time: '9 PM', risk: 'low' }
    ]
  },
  {
    id: 'skin',
    name: 'Skin Sensitivity',
    emoji: '☀️',
    headline: 'High UV Exposure - Extra Protection Needed',
    riskLevel: 'high',
    recommendations: [
      'Apply SPF 50+ sunscreen every 2 hours',
      'Wear protective clothing and seek shade between 10 AM - 4 PM',
      'Use moisturizer - low humidity may dry skin'
    ],
    metrics: [
      { name: 'UV Index', value: '8 (Very High)', level: 'high', percentage: 90, description: 'Sunburn risk in 15 minutes' },
      { name: 'Humidity', value: '35%', level: 'high', percentage: 70, description: 'Low - may cause skin dryness' },
      { name: 'Air Quality', value: 'Good', level: 'low', percentage: 15, description: 'PM2.5: 12 μg/m³' },
      { name: 'Temperature', value: '78°F', level: 'medium', percentage: 50, description: 'Warm - increased sweating' }
    ],
    hourlyRisk: [
      { time: '6 AM', risk: 'low' },
      { time: '9 AM', risk: 'medium' },
      { time: '12 PM', risk: 'high' },
      { time: '3 PM', risk: 'high' },
      { time: '6 PM', risk: 'medium' },
      { time: '9 PM', risk: 'low' }
    ]
  },
  {
    id: 'asthma',
    name: 'Asthma',
    emoji: '💨',
    headline: 'Moderate Air Quality - Use Caution',
    riskLevel: 'medium',
    recommendations: [
      'Keep rescue inhaler accessible at all times',
      'Limit strenuous outdoor activity during afternoon',
      'Monitor air quality alerts throughout the day'
    ],
    metrics: [
      { name: 'Air Quality', value: 'Moderate', level: 'medium', percentage: 60, description: 'PM2.5: 45 μg/m³' },
      { name: 'Pollen Count', value: 'High', level: 'high', percentage: 75, description: 'May trigger symptoms' },
      { name: 'Humidity', value: '68%', level: 'medium', percentage: 55, description: 'Slightly elevated' },
      { name: 'Ozone Level', value: 'Moderate', level: 'medium', percentage: 50, description: '55 ppb - exercise caution' }
    ],
    hourlyRisk: [
      { time: '6 AM', risk: 'low' },
      { time: '9 AM', risk: 'medium' },
      { time: '12 PM', risk: 'high' },
      { time: '3 PM', risk: 'high' },
      { time: '6 PM', risk: 'medium' },
      { time: '9 PM', risk: 'low' }
    ]
  }
];

interface PersonalHealthForecastProps {
  onClose: () => void;
}

export function PersonalHealthForecast({ onClose }: PersonalHealthForecastProps) {
  const [selectedCondition, setSelectedCondition] = useState<HealthCondition>(healthConditions[0]);

  const getRiskColor = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'low':
        return { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', bar: 'bg-green-500' };
      case 'medium':
        return { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', bar: 'bg-amber-500' };
      case 'high':
        return { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', bar: 'bg-red-500' };
    }
  };

  const getRiskLabel = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'low':
        return 'Low Risk';
      case 'medium':
        return 'Moderate Risk';
      case 'high':
        return 'High Risk';
    }
  };

  const getRiskIcon = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'low':
        return <CheckCircle className="w-6 h-6" />;
      case 'medium':
        return <Info className="w-6 h-6" />;
      case 'high':
        return <AlertTriangle className="w-6 h-6" />;
    }
  };

  const riskColors = getRiskColor(selectedCondition.riskLevel);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-50 to-blue-50 z-40 overflow-y-auto">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Personal Health Forecast</h1>
              <p className="text-sm text-gray-600">Weather-based health insights for today</p>
            </div>
          </div>
          <div className="text-sm text-gray-500">San Francisco, CA</div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Condition Selector */}
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">Select Health Condition</h2>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {healthConditions.map((condition) => (
              <button
                key={condition.id}
                onClick={() => setSelectedCondition(condition)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
                  selectedCondition.id === condition.id
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg scale-105'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-300 hover:shadow-md'
                }`}
              >
                <span className="text-xl">{condition.emoji}</span>
                <span className="text-sm">{condition.name}</span>
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCondition.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Main Health Insight Panel */}
            <div className={`${riskColors.bg} ${riskColors.border} border-2 rounded-3xl p-8 mb-6 shadow-lg`}>
              <div className="flex items-start gap-4 mb-6">
                <div className={`${riskColors.text}`}>
                  {getRiskIcon(selectedCondition.riskLevel)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className={`text-3xl font-bold ${riskColors.text}`}>
                      {selectedCondition.headline}
                    </h2>
                  </div>
                  <p className={`text-sm font-semibold uppercase tracking-wide ${riskColors.text}`}>
                    {getRiskLabel(selectedCondition.riskLevel)}
                  </p>
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6">
                <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                  Recommended Actions
                </h3>
                <ul className="space-y-3">
                  {selectedCondition.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                        {index + 1}
                      </div>
                      <span className="text-gray-800 text-base">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Health Risk Indicators */}
            <div className="bg-white rounded-3xl p-8 shadow-lg mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Key Health Metrics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {selectedCondition.metrics.map((metric, index) => {
                  const metricColors = getRiskColor(metric.level);
                  return (
                    <motion.div
                      key={index}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gray-50 rounded-2xl p-5 border border-gray-200"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="text-sm font-semibold text-gray-700 mb-1">{metric.name}</h4>
                          <p className={`text-2xl font-bold ${metricColors.text}`}>{metric.value}</p>
                        </div>
                        <div className={`px-3 py-1 ${metricColors.bg} ${metricColors.border} border rounded-full`}>
                          <span className={`text-xs font-bold uppercase ${metricColors.text}`}>
                            {metric.level}
                          </span>
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="mb-3">
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${metric.percentage}%` }}
                            transition={{ duration: 0.8, delay: index * 0.1 }}
                            className={`h-full ${metricColors.bar}`}
                          />
                        </div>
                      </div>

                      <p className="text-xs text-gray-600">{metric.description}</p>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Forecast Timeline */}
            <div className="bg-white rounded-3xl p-8 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Risk Timeline - Today</h3>
              <div className="space-y-3">
                {selectedCondition.hourlyRisk.map((hour, index) => {
                  const hourColors = getRiskColor(hour.risk);
                  return (
                    <motion.div
                      key={index}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center gap-4"
                    >
                      <span className="text-sm font-medium text-gray-700 w-16">{hour.time}</span>
                      <div className="flex-1 h-12 bg-gray-100 rounded-xl overflow-hidden relative">
                        <div className={`h-full ${hourColors.bg} border-l-4 ${hourColors.border} flex items-center px-4`}>
                          <span className={`text-sm font-semibold ${hourColors.text} uppercase`}>
                            {getRiskLabel(hour.risk)}
                          </span>
                        </div>
                      </div>
                      {hour.risk === 'high' && (
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                      )}
                      {hour.risk === 'low' && (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="mt-6 pt-6 border-t border-gray-200 flex items-center justify-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span className="text-xs text-gray-600">Low Risk</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-amber-500 rounded"></div>
                  <span className="text-xs text-gray-600">Moderate Risk</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span className="text-xs text-gray-600">High Risk</span>
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-2xl p-6">
              <div className="flex gap-3">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-blue-900 mb-1">Medical Disclaimer</h4>
                  <p className="text-xs text-blue-800 leading-relaxed">
                    This health forecast is for informational purposes only and should not replace professional medical advice. 
                    Always consult with your healthcare provider regarding medical conditions and treatment decisions.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
