import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import type { Low } from 'lowdb';
import path from 'path';

dotenv.config();

// Define the structure of our database
interface DbData {
  profile: {
    age?: number;
    gender?: 'male' | 'female';
    height?: number; // in cm
    weight?: number; // in kg
    activityLevel?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very';
    goal?: 'lose' | 'maintain' | 'gain';
    targets: {
        calories: number;
        protein: number;
        carbohydrates: number;
        fat: number;
    }
  };
  meals: any[];
}

// We'll initialize these asynchronously
let db: Low<DbData>;
let genAI: GoogleGenerativeAI;

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

// Serve static files from the React app in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../../build')));
}

// --- New API Endpoints ---

// Get user profile and targets
app.get('/api/profile', async (req: Request, res: Response) => {
    await db.read();
    res.json(db.data?.profile);
});

// Save user profile and calculated targets
app.post('/api/profile', async (req: Request, res: Response) => {
    await db.read();
    if (db.data) {
        db.data.profile = req.body;
        await db.write();
        res.json(db.data.profile);
    } else {
        res.status(500).json({ error: "Database not initialized" });
    }
});

// Get all meals for a specific date
app.get('/api/meals', async (req: Request, res: Response) => {
    await db.read();
    const date = req.query.date as string || new Date().toISOString().split('T')[0];
    
    // Handle old (full ISO string) and new (YYYY-MM-DD) date formats
    const mealsForDate = db.data?.meals.filter(meal => meal.date && meal.date.startsWith(date));

    // Add a default category for old meals for backward compatibility
    const mealsWithCategory = mealsForDate?.map(meal => {
        if (!meal.category) {
            // Attempt to guess category from old date, otherwise default to Snack
            const hour = new Date(meal.date).getHours();
            if (hour >= 5 && hour < 11) return { ...meal, category: 'Breakfast' };
            if (hour >= 11 && hour < 16) return { ...meal, category: 'Lunch' };
            if (hour >= 16 && hour < 22) return { ...meal, category: 'Dinner' };
            return { ...meal, category: 'Snack' };
        }
        return meal;
    });

    res.json(mealsWithCategory || []);
});

const getMealCategory = (): 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack' => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 11) return 'Breakfast';
    if (hour >= 11 && hour < 16) return 'Lunch';
    if (hour >= 16 && hour < 22) return 'Dinner';
    return 'Snack';
};

// Log a new meal
app.post('/api/meals', async (req: Request, res: Response) => {
    await db.read();
    const newMeal = {
        ...req.body,
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        category: getMealCategory(),
    };
    db.data?.meals.push(newMeal);
    await db.write();
    res.status(201).json(newMeal);
});

// Update a meal's date and category
app.put('/api/meals/:id', async (req: Request, res: Response) => {
    await db.read();
    const mealId = req.params.id;
    const { date, category } = req.body; // Expecting date and category
    
    if (db.data) {
        const mealIndex = db.data.meals.findIndex(m => m.id.toString() === mealId);
        if (mealIndex > -1) {
            if (date) db.data.meals[mealIndex].date = date;
            if (category) db.data.meals[mealIndex].category = category;
            await db.write();
            res.json(db.data.meals[mealIndex]);
        } else {
            res.status(404).json({ error: "Meal not found" });
        }
    } else {
        res.status(500).json({ error: "Database not initialized" });
    }
});

// Delete a meal
app.delete('/api/meals/:id', async (req: Request, res: Response) => {
    await db.read();
    const mealId = req.params.id;
    
    if (db.data) {
        const initialLength = db.data.meals.length;
        db.data.meals = db.data.meals.filter(m => m.id.toString() !== mealId);
        if (db.data.meals.length < initialLength) {
            await db.write();
            res.status(204).send();
        } else {
            res.status(404).json({ error: "Meal not found" });
        }
    } else {
        res.status(500).json({ error: "Database not initialized" });
    }
});


// --- Existing Meal Analysis Endpoint ---
app.post('/api/analyze-meal', upload.single('image'), async (req: Request, res: Response) => {
  try {
    const { text } = req.body;
    const image = req.file;

    if (!text && !image) {
      return res.status(400).json({ error: 'Please provide text or an image for analysis.' });
    }

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "YOUR_API_KEY_HERE") {
        return res.status(500).json({ error: "Server is not configured with a Gemini API key." });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const generationConfig = {
      temperature: 0.2,
      topP: 0.95,
      topK: 64,
      maxOutputTokens: 8192,
      responseMimeType: 'application/json',
    };
    
    const safetySettings = [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    ];
    
    const prompt = `
        Analyze the following meal and provide a nutritional analysis.
        The user input may be text, an image, or both.
        Your response must be a JSON object with the following structure:
        {
          "mealName": "A descriptive name for the meal",
          "totalCalories": <total_calories_integer>,
          "macros": {
            "protein": { "grams": <protein_grams_integer>, "percentage": <protein_percentage_integer> },
            "carbohydrates": { "grams": <carbs_grams_integer>, "percentage": <carbs_percentage_integer> },
            "fat": { "grams": <fat_grams_integer>, "percentage": <fat_percentage_integer> }
          },
          "ingredients": [
            { "name": "ingredient_name", "calories": <calories_integer>, "protein": <grams_int>, "carbs": <grams_int>, "fat": <grams_int> }
          ]
        }
        Do not include any introductory text or explanations outside of the JSON object.
        If the input is unclear or doesn't seem to be a food item, return a JSON object with an "error" key.
        Example error response: { "error": "Could not identify a food item in the provided input." }
    `;

    const parts: any[] = [];
    if (text) {
        parts.push({ text: `User text input: "${text}"` });
    }
    if (image) {
        parts.push({
            inlineData: {
                mimeType: image.mimetype,
                data: image.buffer.toString('base64'),
            }
        });
    }

    const result = await model.generateContent({
        contents: [{ role: "user", parts: [{text: prompt}, ...parts] }],
        generationConfig,
        safetySettings,
      });

    const jsonResponse = result.response.text();
    console.log("Gemini Response:", jsonResponse);
    res.json(JSON.parse(jsonResponse));

  } catch (error) {
    console.error('Error analyzing meal:', error);
    res.status(500).json({ error: 'Failed to analyze meal. Please check the server logs.' });
  }
});

// The "catchall" handler: for any request that doesn't match one above,
// send back React's index.html file.
if (process.env.NODE_ENV === 'production') {
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../../build', 'index.html'));
    });
}

// Initialize DB and start server
const startServer = async () => {
    // Initialize Gemini AI client
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "YOUR_API_KEY_HERE") {
        console.error("FATAL ERROR: Gemini API key not found in backend/.env or is a placeholder.");
        process.exit(1);
    }
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // Dynamically import and initialize lowdb
    const { Low } = await import('lowdb');
    const { JSONFile } = await import('lowdb/node');
    const defaultData: DbData = { profile: { targets: { calories: 2000, protein: 150, carbohydrates: 250, fat: 60 } }, meals: [] };
    const adapter = new JSONFile<DbData>('db.json');
    db = new Low(adapter, defaultData);

    await db.read();

    // Important: check if the file exists and has data, if not, create it with default data.
    if (!db.data) {
        db.data = defaultData;
    }
    
    await db.write();

    app.listen(port, () => {
        console.log(`Backend server listening on http://localhost:${port}`);
    });
};

startServer(); 