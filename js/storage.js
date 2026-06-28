/**
 * Storage Utility module
 * Handles all interactions with Local Storage.
 */

const STORAGE_KEYS = {
    THEME: 'fitTrack_theme',
    EXERCISES: 'fitTrack_exercises',
    BMI_HISTORY: 'fitTrack_bmiHistory',
    STREAK: 'fitTrack_streak',
    GOAL: 'fitTrack_dailyGoal',
    WATER: 'fitTrack_waterIntake'
};

export const Storage = {
    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error(`Error reading ${key} from Local Storage:`, error);
            return defaultValue;
        }
    },

    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error(`Error saving ${key} to Local Storage:`, error);
            return false;
        }
    },

    remove(key) {
        localStorage.removeItem(key);
    },

    clearAll() {
        // Only clear keys related to FitTrack to avoid wiping other unrelated data
        Object.values(STORAGE_KEYS).forEach(key => this.remove(key));
    },

    exportData() {
        const data = {};
        Object.values(STORAGE_KEYS).forEach(key => {
            const val = localStorage.getItem(key);
            if (val !== null) data[key] = JSON.parse(val);
        });
        return JSON.stringify(data, null, 2);
    },

    importData(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            let imported = false;
            Object.values(STORAGE_KEYS).forEach(key => {
                if (data[key] !== undefined) {
                    this.set(key, data[key]);
                    imported = true;
                }
            });
            return imported;
        } catch (error) {
            console.error("Failed to parse import data", error);
            return false;
        }
    }
};

export { STORAGE_KEYS };