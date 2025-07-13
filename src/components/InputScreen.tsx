import React, { useState, useEffect } from 'react';
import { Camera, Mic, Send, Video, X, PlusCircle, MinusCircle, Check, Target, Droplets } from 'lucide-react';

interface MacroInfo {
  grams: number;
  percentage: number;
}

interface EditableIngredient {
  name: string;
  quantity: number;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface EditableAnalysis {
    mealName: string;
    totalCalories: number;
    macros: {
        protein: MacroInfo;
        carbohydrates: MacroInfo;
        fat: MacroInfo;
    };
    ingredients: EditableIngredient[];
}

interface LoggedMeal {
    mealName: string;
    totalCalories: number;
    macros: {
        protein: MacroInfo;
        carbohydrates: MacroInfo;
        fat: MacroInfo;
    };
    ingredients: EditableIngredient[];
}

interface Targets {
    calories: number;
    protein: number;
    carbohydrates: number;
    fat: number;
}

const InputScreen: React.FC = () => {
  const [textInput, setTextInput] = useState('');
  const [imageInput, setImageInput] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<EditableAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [todaysProgress, setTodaysProgress] = useState({ calories: 0, protein: 0, carbohydrates: 0, fat: 0 });
  const [targets, setTargets] = useState<Targets | null>(null);
  const [isMealLogged, setIsMealLogged] = useState(false);

  const measurementUnits = ["g", "oz", "cup", "tbsp", "tsp", "slice", "piece", "whole", "half"];

  const fetchTodaysData = async () => {
    // Fetch targets
    const profileRes = await fetch('/api/profile');
    const profileData = await profileRes.json();
    if (profileData.targets) {
        setTargets(profileData.targets);
    }
    // Fetch today's meals
    const mealsRes = await fetch('/api/meals');
    const todaysMeals: LoggedMeal[] = await mealsRes.json();
    const progress = todaysMeals.reduce((acc, meal) => {
        acc.calories += meal.totalCalories;
        acc.protein += meal.macros.protein.grams;
        acc.carbohydrates += meal.macros.carbohydrates.grams;
        acc.fat += meal.macros.fat.grams;
        return acc;
    }, { calories: 0, protein: 0, carbohydrates: 0, fat: 0 });
    setTodaysProgress(progress);
  };

  useEffect(() => {
    fetchTodaysData();
  }, []);


  useEffect(() => {
    if (analysis) {
        const newTotals = analysis.ingredients.reduce((acc, ing) => {
            acc.totalCalories += ing.calories * ing.quantity;
            acc.totalProtein += ing.protein * ing.quantity;
            acc.totalCarbs += ing.carbs * ing.quantity;
            acc.totalFat += ing.fat * ing.quantity;
            return acc;
        }, { totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0 });

        const totalMacros = newTotals.totalProtein + newTotals.totalCarbs + newTotals.totalFat;
        
        setAnalysis(prev => prev ? ({
            ...prev,
            totalCalories: Math.round(newTotals.totalCalories),
            macros: {
                protein: { grams: Math.round(newTotals.totalProtein), percentage: totalMacros > 0 ? Math.round((newTotals.totalProtein / totalMacros) * 100) : 0 },
                carbohydrates: { grams: Math.round(newTotals.totalCarbs), percentage: totalMacros > 0 ? Math.round((newTotals.totalCarbs / totalMacros) * 100) : 0 },
                fat: { grams: Math.round(newTotals.totalFat), percentage: totalMacros > 0 ? Math.round((newTotals.totalFat / totalMacros) * 100) : 0 }
            }
        }) : null);
    }
  }, [analysis]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageInput(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageInput(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput && !imageInput) {
      setError('Please enter some text or upload an image.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    const formData = new FormData();
    formData.append('text', textInput);
    if (imageInput) {
      formData.append('image', imageInput);
    }

    try {
      const response = await fetch('/api/analyze-meal', {
        method: 'POST',
        body: formData,
      });

      // Check if the response is JSON, if not, something went wrong
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const responseText = await response.text();
        console.error("Received non-JSON response:", responseText);
        throw new Error("The server returned an unexpected response. Please check the console.");
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      if (data.error) {
        setError(data.error);
      } else {
        const editableData: EditableAnalysis = {
            ...data,
            ingredients: data.ingredients.map((ing: any) => ({
                ...ing,
                quantity: 1,
                unit: 'unit' // Default unit
            }))
        };
        setAnalysis(editableData);
        setTextInput('');
        handleRemoveImage();
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleIngredientChange = (index: number, field: keyof EditableIngredient, value: string | number) => {
    if (!analysis) return;

    const newIngredients = [...analysis.ingredients];
    (newIngredients[index] as any)[field] = value;

    setAnalysis({
        ...analysis,
        ingredients: newIngredients
    });
  };

  const handleLogMeal = async () => {
    if (!analysis) return;
    
    await fetch('/api/meals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(analysis)
    });

    setIsMealLogged(true);
    await fetchTodaysData(); // Refresh data

    setTimeout(() => {
        setAnalysis(null);
        setIsMealLogged(false);
    }, 2000); // Hide card after 2 seconds
  };

  const renderAnalysis = () => {
    if (!analysis) return null;
    
    const { mealName, totalCalories, macros } = analysis;

    return (
      <div className="analysis-card active">
        <h2 className="analysis-title">{mealName}</h2>
        <div className="calories-display">
          <span className="calories-value">{totalCalories}</span>
          <span className="calories-label">Calories</span>
        </div>
        <div className="macros-grid">
          <div className="macro-item">
            <span className="macro-label">Protein</span>
            <span className="macro-value">{macros.protein.grams}g</span>
          </div>
          <div className="macro-item">
            <span className="macro-label">Carbs</span>
            <span className="macro-value">{macros.carbohydrates.grams}g</span>
          </div>
          <div className="macro-item">
            <span className="macro-label">Fat</span>
            <span className="macro-value">{macros.fat.grams}g</span>
          </div>
        </div>
        <div className="ingredients-list">
            <h3 className="ingredients-title">Breakdown</h3>
            {analysis.ingredients.map((ing, index) => (
                <div key={index} className="ingredient-item">
                    <div className="ingredient-name">{ing.name}</div>
                    <div className="ingredient-controls">
                        <button onClick={() => handleIngredientChange(index, 'quantity', Math.max(0, ing.quantity - 1))} className="control-btn"><MinusCircle size={20}/></button>
                        <input 
                            type="number" 
                            value={ing.quantity} 
                            onChange={(e) => handleIngredientChange(index, 'quantity', parseInt(e.target.value) || 0)}
                            className="quantity-input"
                        />
                        <button onClick={() => handleIngredientChange(index, 'quantity', ing.quantity + 1)} className="control-btn"><PlusCircle size={20}/></button>
                        <select 
                            value={ing.unit} 
                            onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                            className="unit-select"
                        >
                            <option value="unit" disabled>unit</option>
                            {measurementUnits.map(unit => <option key={unit} value={unit}>{unit}</option>)}
                        </select>
                    </div>
                </div>
            ))}
        </div>
        <button className="log-meal-btn" onClick={handleLogMeal}>
            <Check size={20} /> Log Meal
        </button>
      </div>
    );
  };

  const renderProgress = () => {
    if (!targets) return null;
    return (
      <div className="progress-card">
         <h3 className="progress-title">Today's Progress</h3>
         <div className="progress-grid">
            <div className="progress-item">
                <div className="progress-label"><Droplets size={16}/> Calories</div>
                <div className="progress-bar-container">
                    <div className="progress-bar-fill" style={{width: `${Math.min(100, (todaysProgress.calories / targets.calories) * 100)}%`}}></div>
                </div>
                <div className="progress-text">{todaysProgress.calories.toFixed(0)} / {targets.calories} kcal</div>
            </div>
            <div className="progress-item">
                <div className="progress-label"><Target size={16}/> Protein</div>
                <div className="progress-bar-container">
                    <div className="progress-bar-fill protein" style={{width: `${Math.min(100, (todaysProgress.protein / targets.protein) * 100)}%`}}></div>
                </div>
                <div className="progress-text">{todaysProgress.protein.toFixed(0)} / {targets.protein} g</div>
            </div>
            <div className="progress-item">
                <div className="progress-label"><Target size={16}/> Carbs</div>
                <div className="progress-bar-container">
                    <div className="progress-bar-fill carbs" style={{width: `${Math.min(100, (todaysProgress.carbohydrates / targets.carbohydrates) * 100)}%`}}></div>
                </div>
                <div className="progress-text">{todaysProgress.carbohydrates.toFixed(0)} / {targets.carbohydrates} g</div>
            </div>
            <div className="progress-item">
                <div className="progress-label"><Target size={16}/> Fat</div>
                <div className="progress-bar-container">
                    <div className="progress-bar-fill fat" style={{width: `${Math.min(100, (todaysProgress.fat / targets.fat) * 100)}%`}}></div>
                </div>
                <div className="progress-text">{todaysProgress.fat.toFixed(0)} / {targets.fat} g</div>
            </div>
         </div>
      </div>
    );
  };

  return (
    <div className="input-screen">
      <div className="page-header">
        <h1 className="page-title">Meal Logger</h1>
        <p className="page-subtitle">Log your meal using text, voice, or your camera.</p>
      </div>

      <div className="content-area">
        {isLoading && (
            <div className="loading-overlay">
                <div className="loading-spinner"></div>
            </div>
        )}
        {error && !isLoading && <div className="error-message">{error}</div>}
        
        {isMealLogged && <div className="success-message">Meal logged successfully!</div>}

        {analysis ? renderAnalysis() : renderProgress()}

      </div>

      <form className="compact-input-container" onSubmit={handleSubmit}>
        <div className="compact-input-bar">
            {imagePreview && (
              <div className="compact-image-preview">
                <img src={imagePreview} alt="Selected" />
                <button type="button" onClick={handleRemoveImage} className="remove-image-btn"><X size={16} /></button>
              </div>
            )}
            <input
              type="text"
              className="compact-text-input"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Describe your meal..."
              disabled={isLoading}
            />
            <div className="compact-input-actions">
              <label className="action-icon">
                  <Camera size={22} />
                  <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} disabled={isLoading}/>
              </label>
              <button type="button" className="action-icon" disabled={isLoading}><Mic size={22} /></button>
              <button type="button" className="action-icon" disabled={isLoading}><Video size={22} /></button>
              <button type="submit" className="submit-btn" disabled={isLoading || (!textInput && !imageInput)}>
                  <Send size={22} />
              </button>
            </div>
        </div>
      </form>
    </div>
  );
};

export default InputScreen; 