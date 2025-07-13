import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Flame, 
  Activity, 
  TrendingUp, 
  ChevronRight,
  Apple,
  Dumbbell,
  Heart,
  Target,
  Trash2,
  Edit,
  Save
} from 'lucide-react';

interface MacroData {
  protein: { grams: number };
  carbohydrates: { grams: number };
  fat: { grams: number };
}

interface LoggedMeal {
    id: string;
    mealName: string;
    totalCalories: number;
    date: string; // YYYY-MM-DD
    category: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
    macros: MacroData;
}

interface ProfileTargets {
    calories: number;
    protein: number;
    carbohydrates: number;
    fat: number;
}


const Dashboard: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [todaysMeals, setTodaysMeals] = useState<LoggedMeal[]>([]);
  const [targets, setTargets] = useState<ProfileTargets>({ calories: 2000, protein: 150, carbohydrates: 250, fat: 70 });
  const [editingMealId, setEditingMealId] = useState<string | null>(null);
  const [editedDate, setEditedDate] = useState('');
  const [editedCategory, setEditedCategory] = useState<'Breakfast' | 'Lunch' | 'Dinner' | 'Snack'>('Snack');
  
  const fetchData = useCallback(async () => {
    try {
        const profileRes = await fetch('/api/profile');
        const profileData = await profileRes.json();
        if (profileData && profileData.targets) {
            setTargets(profileData.targets);
        }

        const dateString = selectedDate.toISOString().split('T')[0];
        const mealsRes = await fetch(`/api/meals?date=${dateString}`);
        let mealsData: LoggedMeal[] = await mealsRes.json();
        
        setTodaysMeals(mealsData.sort((a, b) => {
            const categoryOrder = { 'Breakfast': 1, 'Lunch': 2, 'Dinner': 3, 'Snack': 4 };
            return categoryOrder[a.category] - categoryOrder[b.category];
        }));
    } catch (error) {
        console.error("Failed to fetch data:", error);
    }
  }, [selectedDate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleUpdateMeal = async (mealId: string) => {
    await fetch(`/api/meals/${mealId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: editedDate, category: editedCategory }),
    });
    setEditingMealId(null);
    fetchData(); // Refresh data
  };

  const handleDeleteMeal = async (mealId: string) => {
      if(window.confirm("Are you sure you want to delete this meal?")) {
        await fetch(`/api/meals/${mealId}`, { method: 'DELETE' });
        fetchData(); // Refresh data
      }
  };

  const startEditing = (meal: LoggedMeal) => {
    setEditingMealId(meal.id);
    setEditedDate(meal.date);
    setEditedCategory(meal.category);
  };


  const dailyData = todaysMeals.reduce((acc, meal) => {
    acc.calories += meal.totalCalories;
    acc.macros.protein.grams += meal.macros.protein.grams;
    acc.macros.carbohydrates.grams += meal.macros.carbohydrates.grams;
    acc.macros.fat.grams += meal.macros.fat.grams;
    return acc;
  }, { 
      calories: 0, 
      macros: { protein: {grams: 0}, carbohydrates: {grams: 0}, fat: {grams: 0} }, 
      workouts: 0, 
      activeMinutes: 0 
    });


  const HealthCard: React.FC<{
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    value: string;
    progress?: number;
    color: string;
    onClick: () => void;
  }> = ({ title, subtitle, icon, value, progress, color, onClick }) => (
    <motion.div
      className="health-card cursor-pointer"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div 
            className="p-3 rounded-xl"
            style={{ backgroundColor: `${color}20`, color: color }}
          >
            {icon}
          </div>
          <div>
            <h3 className="health-label">{title}</h3>
            <p className="health-subtitle">{subtitle}</p>
          </div>
        </div>
        <ChevronRight size={20} className="text-gray-400" />
      </div>
      
      <div className="health-value mb-3">{value}</div>
      
      {progress !== undefined && (
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ 
              width: `${Math.min(progress, 100)}%`,
              background: `linear-gradient(90deg, ${color} 0%, ${color}dd 100%)`
            }}
          />
        </div>
      )}
    </motion.div>
  );

  const MacroIndicator: React.FC<{ type: keyof MacroData; current: number; target: number }> = ({ 
    type, current, target 
  }) => {
    const colors = {
      protein: '#ff3b30',
      carbohydrates: '#34c759', 
      fat: '#007aff'
    };
    
    const labels = {
      protein: 'Protein',
      carbohydrates: 'Carbs',
      fat: 'Fat'
    };

    const percentage = target > 0 ? Math.round((current / target) * 100) : 0;

    return (
      <div className="health-metric">
        <div className="flex items-center gap-3">
          <div 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: colors[type] }}
          />
          <div>
            <div className="health-label">{labels[type]}</div>
            <div className="health-subtitle">{percentage}% of daily goal</div>
          </div>
        </div>
        <div className="text-right">
          <div className="health-value" style={{ fontSize: '24px' }}>
            {current}g
          </div>
          <div className="health-subtitle">of {target}g</div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Apple Health Style Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="health-header"
      >
        <h1 className="text-2xl font-bold mb-2">Today's Summary</h1>
        <div className="flex items-center gap-2">
            <input 
                type="date"
                value={selectedDate.toISOString().split('T')[0]}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                className="bg-gray-700 text-white p-1 rounded"
            />
        </div>
      </motion.div>

      {/* Health Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-4"
      >
        <HealthCard
          title="Energy Intake"
          subtitle="Calories & Macros"
          icon={<Flame size={24} />}
          value={`${Math.round(dailyData.calories)} / ${targets.calories} cal`}
          progress={(dailyData.calories / targets.calories) * 100}
          color="#34c759"
          onClick={() => console.log('View meals')}
        />

        <HealthCard
          title="Energy Output"
          subtitle="Workouts & Activity"
          icon={<Activity size={24} />}
          value={`${dailyData.workouts} workouts, ${dailyData.activeMinutes} min`}
          color="#007aff"
          onClick={() => console.log('View workouts')}
        />

        <HealthCard
          title="Net Analysis"
          subtitle="Surplus/Deficit"
          icon={<TrendingUp size={24} />}
          value={`${dailyData.calories - targets.calories > 0 ? '+' : ''}${Math.round(dailyData.calories - targets.calories)} cal`}
          color={dailyData.calories - targets.calories > 0 ? "#ff3b30" : "#34c759"}
          onClick={() => console.log('View analysis')}
        />
      </motion.div>

      {/* Today's Meals */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="health-card"
      >
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="font-bold text-lg mb-4">Today's Meals</h3>
          <div className="space-y-3">
            {todaysMeals.map((meal) => (
              <div key={meal.id} className="bg-gray-700 p-3 rounded-md flex items-center justify-between">
                {editingMealId === meal.id ? (
                    <div className="flex-1 flex items-center gap-2">
                        <input 
                            type="date"
                            value={editedDate}
                            onChange={(e) => setEditedDate(e.target.value)}
                            className="bg-gray-600 text-white p-1 rounded"
                        />
                        <select 
                            value={editedCategory} 
                            onChange={(e) => setEditedCategory(e.target.value as any)}
                            className="bg-gray-600 text-white p-1 rounded"
                        >
                            <option>Breakfast</option>
                            <option>Lunch</option>
                            <option>Dinner</option>
                            <option>Snack</option>
                        </select>
                    </div>
                ) : (
                    <div className="flex-1">
                        <p className="font-semibold">{meal.mealName}</p>
                        <p className="text-sm text-gray-400">
                            {meal.category} - {meal.totalCalories} cal
                        </p>
                    </div>
                )}
                
                <div className="flex items-center gap-2">
                    {editingMealId === meal.id ? (
                        <button onClick={() => handleUpdateMeal(meal.id)} className="p-2 text-green-400 hover:text-green-300">
                            <Save size={18}/>
                        </button>
                    ) : (
                        <button onClick={() => startEditing(meal)} className="p-2 text-gray-400 hover:text-white">
                            <Edit size={18}/>
                        </button>
                    )}
                    <button onClick={() => handleDeleteMeal(meal.id)} className="p-2 text-red-500 hover:text-red-400">
                        <Trash2 size={18}/>
                    </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Macro Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="health-card"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Target size={20} className="text-blue-600" />
          </div>
          <h3 className="health-label">Macro Breakdown</h3>
        </div>
        <div className="space-y-2">
          <MacroIndicator type="protein" current={Math.round(dailyData.macros.protein.grams)} target={targets.protein} />
          <MacroIndicator type="carbohydrates" current={Math.round(dailyData.macros.carbohydrates.grams)} target={targets.carbohydrates} />
          <MacroIndicator type="fat" current={Math.round(dailyData.macros.fat.grams)} target={targets.fat} />
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-3"
      >
        <button className="action-button flex items-center justify-center gap-2">
          <Apple size={20} />
          Add Meal
        </button>
        <button className="action-button secondary flex items-center justify-center gap-2">
          <Dumbbell size={20} />
          Log Workout
        </button>
      </motion.div>

      {/* Health Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="health-card"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-green-100 rounded-lg">
            <Heart size={20} className="text-green-600" />
          </div>
          <h3 className="health-label">Health Insights</h3>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div>
              <div className="health-label text-green-700">Great Progress!</div>
              <div className="health-subtitle text-green-600">You're on track with your protein goals</div>
            </div>
            <div className="status-indicator status-success">
              <Heart size={16} />
              On Track
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
            <div>
              <div className="health-label text-orange-700">Consider More Activity</div>
              <div className="health-subtitle text-orange-600">You're below your daily activity goal</div>
            </div>
            <div className="status-indicator status-warning">
              <Activity size={16} />
              Low Activity
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard; 