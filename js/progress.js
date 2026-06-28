/**
 * Progress module
 * Handles daily goals, progress bar, and completion animations.
 */
import { Storage, STORAGE_KEYS } from './storage.js';
import { getExercises } from './exercise.js';
import { triggerConfetti } from './notification.js';

let dailyGoal = 5; // Default goal
let goalAchievedToday = false;

export function initProgress() {
    dailyGoal = Storage.get(STORAGE_KEYS.GOAL, 5);
    
    const goalSelect = document.getElementById('dailyGoalSelect');
    if (goalSelect) {
        goalSelect.value = dailyGoal;
    }

    const saveGoalBtn = document.getElementById('saveGoalBtn');
    if (saveGoalBtn) {
        saveGoalBtn.addEventListener('click', () => {
            const val = parseInt(goalSelect.value);
            if(val) {
                dailyGoal = val;
                Storage.set(STORAGE_KEYS.GOAL, dailyGoal);
                checkDailyProgress();
                // Import toast temporarily to show message
                import('./notification.js').then(module => {
                    module.showToast('Daily goal updated');
                });
            }
        });
    }

    // Setup modal close
    const closeModalBtn = document.getElementById('closeModalBtn');
    if(closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            document.getElementById('completionModal').classList.add('hidden');
        });
    }

    checkDailyProgress();
}

export function checkDailyProgress() {
    const exercises = getExercises();
    const todayStr = new Date().toLocaleDateString();
    
    // Count today's exercises
    const todayCount = exercises.filter(ex => ex.dateStr === todayStr).length;
    
    const percentage = Math.min(100, Math.round((todayCount / dailyGoal) * 100));
    
    renderProgress(todayCount, percentage);

    // Check for goal completion
    if (todayCount >= dailyGoal && !goalAchievedToday) {
        goalAchievedToday = true;
        // Trigger completion effects if they hit it right now
        triggerConfetti();
        document.getElementById('completionModal').classList.remove('hidden');
    } else if (todayCount < dailyGoal) {
        goalAchievedToday = false;
    }
}

function renderProgress(count, percentage) {
    const bar = document.getElementById('dashProgressBar');
    const pctText = document.getElementById('dashGoalPercentage');
    const descText = document.getElementById('dashGoalText');

    if (bar) {
        bar.style.width = `${percentage}%`;
        if (percentage >= 100) {
            bar.classList.add('complete');
        } else {
            bar.classList.remove('complete');
        }
    }
    
    if (pctText) {
        pctText.textContent = `${percentage}%`;
        if(percentage >= 100) {
            pctText.classList.remove('text-secondary');
            pctText.classList.add('text-primary');
        } else {
            pctText.classList.add('text-secondary');
            pctText.classList.remove('text-primary');
        }
    }
    
    if (descText) {
        descText.textContent = `${count} / ${dailyGoal} Exercises Completed`;
    }
}
