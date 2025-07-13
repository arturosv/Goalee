import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Target,
  Activity,
  BarChart3,
  Calendar,
  Heart
} from 'lucide-react';

interface TrendData {
  date: string;
  calories: number;
  weight: number;
  surplus: number;
}

const Trends: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter'>('week');

  // Mock trend data
  const trendData: TrendData[] = [
    { date: '2024-01-01', calories: 1850, weight: 75.2, surplus: -150 },
    { date: '2024-01-02', calories: 1920, weight: 75.1, surplus: -80 },
    { date: '2024-01-03', calories: 2100, weight: 75.3, surplus: 100 },
    { date: '2024-01-04', calories: 1780, weight: 75.0, surplus: -220 },
    { date: '2024-01-05', calories: 1950, weight: 74.8, surplus: -50 },
    { date: '2024-01-06', calories: 2050, weight: 75.1, surplus: 50 },
    { date: '2024-01-07', calories: 1880, weight: 74.9, surplus: -120 },
  ];

  const weeklyAverage = trendData.reduce((sum, day) => sum + day.calories, 0) / trendData.length;
  const totalSurplus = trendData.reduce((sum, day) => sum + day.surplus, 0);
  const weightChange = trendData[trendData.length - 1].weight - trendData[0].weight;
  const projectedWeightChange = (totalSurplus / 7700) * 0.5; // Rough estimate: 7700 cal = 1kg

  const StatCard: React.FC<{
    title: string;
    value: string;
    subtitle: string;
    icon: React.ReactNode;
    color: string;
    trend?: 'up' | 'down' | 'neutral';
  }> = ({ title, value, subtitle, icon, color, trend }) => (
    <motion.div
      className="health-card"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center justify-between mb-3">
        <div 
          className="p-3 rounded-xl"
          style={{ backgroundColor: `${color}20`, color: color }}
        >
          {icon}
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm ${
            trend === 'up' ? 'text-green-600' : 
            trend === 'down' ? 'text-red-600' : 'text-gray-500'
          }`}>
            {trend === 'up' && <TrendingUp size={16} />}
            {trend === 'down' && <TrendingDown size={16} />}
          </div>
        )}
      </div>
      
      <div className="health-value mb-1">{value}</div>
      <div className="health-label mb-2">{title}</div>
      <div className="health-subtitle">{subtitle}</div>
    </motion.div>
  );

  const TimeRangeButton: React.FC<{
    range: 'week' | 'month' | 'quarter';
    label: string;
    isActive: boolean;
    onClick: () => void;
  }> = ({ range, label, isActive, onClick }) => (
    <button
      className={`px-4 py-2 rounded-lg font-medium transition-all ${
        isActive 
          ? 'bg-blue-600 text-white' 
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  );

  return (
    <div className="space-y-6">
      {/* Apple Health Style Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="health-header"
      >
        <h1 className="text-2xl font-bold mb-2">Your Trends</h1>
        <p className="opacity-90">Track your progress over time</p>
      </motion.div>

      {/* Time Range Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="health-card"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Calendar size={20} className="text-blue-600" />
          </div>
          <h3 className="health-label">Time Period</h3>
        </div>
        <div className="flex gap-2">
          <TimeRangeButton
            range="week"
            label="Week"
            isActive={timeRange === 'week'}
            onClick={() => setTimeRange('week')}
          />
          <TimeRangeButton
            range="month"
            label="Month"
            isActive={timeRange === 'month'}
            onClick={() => setTimeRange('month')}
          />
          <TimeRangeButton
            range="quarter"
            label="Quarter"
            isActive={timeRange === 'quarter'}
            onClick={() => setTimeRange('quarter')}
          />
        </div>
      </motion.div>

      {/* Key Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 gap-4"
      >
        <StatCard
          title="Average Calories"
          value={`${Math.round(weeklyAverage)}`}
          subtitle="Daily average"
          icon={<BarChart3 size={24} />}
          color="#34c759"
          trend={weeklyAverage > 2000 ? 'up' : 'down'}
        />
        
        <StatCard
          title="Calorie Surplus"
          value={`${totalSurplus > 0 ? '+' : ''}${totalSurplus}`}
          subtitle="Total this period"
          icon={<TrendingUp size={24} />}
          color={totalSurplus > 0 ? "#ff3b30" : "#34c759"}
          trend={totalSurplus > 0 ? 'up' : 'down'}
        />
        
        <StatCard
          title="Weight Change"
          value={`${weightChange > 0 ? '+' : ''}${weightChange.toFixed(1)}kg`}
          subtitle="Actual change"
          icon={<Activity size={24} />}
          color={weightChange > 0 ? "#ff3b30" : "#34c759"}
          trend={weightChange > 0 ? 'up' : 'down'}
        />
        
        <StatCard
          title="Projected Change"
          value={`${projectedWeightChange > 0 ? '+' : ''}${projectedWeightChange.toFixed(1)}kg`}
          subtitle="Based on surplus"
          icon={<Target size={24} />}
          color="#007aff"
          trend="neutral"
        />
      </motion.div>

      {/* Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="health-card"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-green-100 rounded-lg">
            <Heart size={20} className="text-green-600" />
          </div>
          <h3 className="health-label">Analysis</h3>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Activity size={20} className="text-blue-600" />
              <span className="health-label text-blue-900">Calorie Balance</span>
            </div>
            <p className="health-subtitle text-blue-700">
              {totalSurplus > 0 
                ? `You're averaging a ${Math.abs(totalSurplus / trendData.length).toFixed(0)} calorie surplus per day. This could lead to weight gain.`
                : `You're averaging a ${Math.abs(totalSurplus / trendData.length).toFixed(0)} calorie deficit per day. This could lead to weight loss.`
              }
            </p>
          </div>

          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Target size={20} className="text-green-600" />
              <span className="health-label text-green-900">Goal Progress</span>
            </div>
            <p className="health-subtitle text-green-700">
              {Math.abs(weightChange - projectedWeightChange) < 0.5
                ? "Your actual weight change closely matches your calorie surplus/deficit, indicating accurate tracking!"
                : "There's a discrepancy between your calorie tracking and weight change. Consider reviewing your measurements."
              }
            </p>
          </div>

          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Calendar size={20} className="text-purple-600" />
              <span className="health-label text-purple-900">Recommendations</span>
            </div>
            <div className="health-subtitle text-purple-700 space-y-1">
              {totalSurplus > 500 && (
                <p>• Consider reducing daily calorie intake by {Math.round(totalSurplus / trendData.length)} calories</p>
              )}
              {totalSurplus < -500 && (
                <p>• Consider increasing daily calorie intake by {Math.round(Math.abs(totalSurplus) / trendData.length)} calories</p>
              )}
              {Math.abs(totalSurplus) <= 500 && (
                <p>• Your calorie balance is well-maintained. Keep up the good work!</p>
              )}
              <p>• Continue tracking consistently for more accurate insights</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Chart Placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="health-card"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gray-100 rounded-lg">
            <BarChart3 size={20} className="text-gray-600" />
          </div>
          <h3 className="health-label">Calorie Trend</h3>
        </div>
        <div className="chart-placeholder">
          <BarChart3 size={48} className="mx-auto mb-2" />
          <p className="text-sm">Chart visualization would go here</p>
          <p className="text-xs">Showing daily calorie intake over time</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Trends; 