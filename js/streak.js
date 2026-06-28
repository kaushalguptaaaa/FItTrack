/**
 * Streak module
 * Calculates and manages consecutive workout days.
 */
import { Storage, STORAGE_KEYS } from './storage.js';
import { getExercises } from './exercise.js';

export function initStreak() {
    updateStreak();
}

export function updateStreak() {
    const exercises = getExercises();
    
    if (exercises.length === 0) {
        renderStreak(0, 0);
        return;
    }

    // Get unique dates sorted chronologically
    const uniqueDates = [...new Set(exercises.map(ex => {
        const d = new Date(ex.date);
        d.setHours(0,0,0,0);
        return d.getTime();
    }))].sort((a, b) => a - b);

    if (uniqueDates.length === 0) {
        renderStreak(0, 0);
        return;
    }

    let currentStreak = 1;
    let longestStreak = 1;
    let tempStreak = 1;

    for (let i = 1; i < uniqueDates.length; i++) {
        const diffDays = (uniqueDates[i] - uniqueDates[i-1]) / (1000 * 60 * 60 * 24);
        
        if (diffDays === 1) {
            tempStreak++;
        } else {
            tempStreak = 1;
        }
        
        if (tempStreak > longestStreak) {
            longestStreak = tempStreak;
        }
    }

    // Determine current streak based on today and yesterday
    const today = new Date();
    today.setHours(0,0,0,0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const lastWorkoutDate = uniqueDates[uniqueDates.length - 1];

    if (lastWorkoutDate === today.getTime() || lastWorkoutDate === yesterday.getTime()) {
        // Temp streak is valid as current
        currentStreak = tempStreak;
    } else {
        // Streak broken
        currentStreak = 0;
    }

    // Save streak stats
    const streakData = { current: currentStreak, longest: longestStreak };
    Storage.set(STORAGE_KEYS.STREAK, streakData);

    renderStreak(currentStreak, longestStreak);
}

function renderStreak(current, longest) {
    const currentEl = document.getElementById('dashStreakValue');
    const longestEl = document.getElementById('statLongestStreak');
    
    if (currentEl) currentEl.textContent = `${current} Day${current !== 1 ? 's' : ''}`;
    if (longestEl) longestEl.textContent = `${longest} Day${longest !== 1 ? 's' : ''}`;
}
