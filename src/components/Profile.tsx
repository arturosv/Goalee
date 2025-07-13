import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Droplets, Target, Activity, Check, Edit } from 'lucide-react';

interface ProfileData {
    age?: number;
    gender?: 'male' | 'female';
    height?: number;
    weight?: number;
    activityLevel?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very';
    goal?: 'lose' | 'maintain' | 'gain';
    targets: {
        calories: number;
        protein: number;
        carbohydrates: number;
        fat: number;
    };
}

const Profile: React.FC = () => {
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            const response = await fetch('/api/profile');
            const data = await response.json();
            setProfile(data);
            if (!data.age) { // If profile is not set, open editor
                setIsEditing(true);
            }
        };
        fetchProfile();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (!profile) return;
        const { name, value } = e.target;
        setProfile({ ...profile, [name]: name === 'age' || name === 'height' || name === 'weight' ? Number(value) : value });
    };

    const calculateTargets = (p: ProfileData): ProfileData => {
        if (!p.age || !p.height || !p.weight || !p.gender || !p.activityLevel || !p.goal) {
            return p;
        }

        // Mifflin-St Jeor Equation for BMR
        let bmr = (10 * p.weight) + (6.25 * p.height) - (5 * p.age);
        bmr += (p.gender === 'male' ? 5 : -161);

        const activityMultipliers = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, very: 1.9 };
        let tdee = bmr * activityMultipliers[p.activityLevel];

        const goalAdjustments = { lose: -500, maintain: 0, gain: 500 };
        const targetCalories = Math.round(tdee + goalAdjustments[p.goal]);

        // Macro calculation (40% C, 30% P, 30% F)
        const targetProtein = Math.round((targetCalories * 0.30) / 4);
        const targetCarbs = Math.round((targetCalories * 0.40) / 4);
        const targetFat = Math.round((targetCalories * 0.30) / 9);

        return { ...p, targets: { calories: targetCalories, protein: targetProtein, carbohydrates: targetCarbs, fat: targetFat }};
    };

    const handleSave = async () => {
        if (!profile) return;
        const updatedProfile = calculateTargets(profile);
        setProfile(updatedProfile);
        
        await fetch('/api/profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedProfile),
        });
        setIsEditing(false);
    };

    if (!profile) {
        return <div className="loading-spinner"></div>;
    }

    const renderDisplayView = () => (
        <>
            <div className="health-card">
                <h3 className="health-label mb-4">Your Daily Targets</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="target-item"><Droplets size={20} className="text-blue-500" /> Calories: <span className="font-bold">{profile.targets.calories}</span></div>
                    <div className="target-item"><Target size={20} className="text-red-500" /> Protein: <span className="font-bold">{profile.targets.protein}g</span></div>
                    <div className="target-item"><Target size={20} className="text-green-500" /> Carbs: <span className="font-bold">{profile.targets.carbohydrates}g</span></div>
                    <div className="target-item"><Target size={20} className="text-yellow-500" /> Fat: <span className="font-bold">{profile.targets.fat}g</span></div>
                </div>
            </div>
            <div className="health-card">
                <h3 className="health-label mb-4">Your Stats</h3>
                 <p>Age: {profile.age || 'N/A'}</p>
                 <p>Gender: {profile.gender || 'N/A'}</p>
                 <p>Height: {profile.height ? `${profile.height} cm` : 'N/A'}</p>
                 <p>Weight: {profile.weight ? `${profile.weight} kg` : 'N/A'}</p>
                 <p>Activity: {profile.activityLevel || 'N/A'}</p>
                 <p>Goal: {profile.goal || 'N/A'}</p>
            </div>
            <button onClick={() => setIsEditing(true)} className="action-button w-full mt-4"><Edit size={20}/> Edit Profile</button>
        </>
    );

    const renderEditView = () => (
         <div className="health-card">
            <h3 className="health-label mb-4">Edit Your Profile</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                    <label className="form-label">Age</label>
                    <input type="number" name="age" value={profile.age || ''} onChange={handleInputChange} className="form-input" />
                </div>
                <div className="form-group">
                    <label className="form-label">Gender</label>
                    <select name="gender" value={profile.gender || ''} onChange={handleInputChange} className="form-select">
                        <option value="">Select...</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </div>
                <div className="form-group">
                    <label className="form-label">Height (cm)</label>
                    <input type="number" name="height" value={profile.height || ''} onChange={handleInputChange} className="form-input" />
                </div>
                <div className="form-group">
                    <label className="form-label">Weight (kg)</label>
                    <input type="number" name="weight" value={profile.weight || ''} onChange={handleInputChange} className="form-input" />
                </div>
                <div className="form-group">
                    <label className="form-label">Activity Level</label>
                    <select name="activityLevel" value={profile.activityLevel || ''} onChange={handleInputChange} className="form-select">
                        <option value="">Select...</option>
                        <option value="sedentary">Sedentary</option>
                        <option value="light">Lightly Active</option>
                        <option value="moderate">Moderately Active</option>
                        <option value="active">Active</option>
                        <option value="very">Very Active</option>
                    </select>
                </div>
                <div className="form-group">
                    <label className="form-label">Goal</label>
                    <select name="goal" value={profile.goal || ''} onChange={handleInputChange} className="form-select">
                        <option value="">Select...</option>
                        <option value="lose">Lose Weight</option>
                        <option value="maintain">Maintain Weight</option>
                        <option value="gain">Gain Weight</option>
                    </select>
                </div>
            </div>
            <button onClick={handleSave} className="action-button w-full mt-6"><Check size={20}/> Save Changes</button>
        </div>
    );


    return (
        <div className="app-content">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4 mb-6">
                <User size={40} className="text-blue-500" />
                <div>
                    <h1 className="text-3xl font-bold">Your Profile</h1>
                    <p className="text-gray-500">Manage your stats and daily targets.</p>
                </div>
            </motion.div>

            {isEditing ? renderEditView() : renderDisplayView()}
        </div>
    );
};

export default Profile; 