/**
 * Exercise module
 * Handles adding, editing, deleting, and rendering exercises.
 */
import { Storage, STORAGE_KEYS } from './storage.js';
import { showToast } from './notification.js';
import { checkDailyProgress } from './progress.js';
import { updateStreak } from './streak.js';
import { renderCalendar } from './calendar.js';
import { updateStatistics } from './statistics.js';

let exercises = [];

const categoryMap = {
    'Push Ups': 'Strength',
    'Pull Ups': 'Strength',
    'Squats': 'Strength',
    'Deadlift': 'Strength',
    'Bench Press': 'Strength',
    'Shoulder Press': 'Strength',
    'Running': 'Cardio',
    'Walking': 'Cardio',
    'Cycling': 'Cardio',
    'Jump Rope': 'Cardio',
    'Yoga': 'Flexibility',
    'Plank': 'Core'
};

export function initExercises() {
    exercises = Storage.get(STORAGE_KEYS.EXERCISES, []);
    setupForm();
    setupSearch();
    renderExercises();
    renderTodayExercises();
}

export function getExercises() {
    return exercises;
}

function setupForm() {
    const form = document.getElementById('exerciseForm');
    const select = document.getElementById('exName');
    const customGroup = document.getElementById('customExGroup');
    const cancelBtn = document.getElementById('cancelEditBtn');
    
    if(!form) return;

    select.addEventListener('change', (e) => {
        if (e.target.value === 'Custom') {
            customGroup.classList.remove('hidden');
            document.getElementById('customExName').required = true;
        } else {
            customGroup.classList.add('hidden');
            document.getElementById('customExName').required = false;
        }
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        saveExercise();
    });

    cancelBtn.addEventListener('click', resetForm);
}

function saveExercise() {
    const idInput = document.getElementById('exId');
    const selectName = document.getElementById('exName').value;
    const customName = document.getElementById('customExName').value;
    
    const name = selectName === 'Custom' ? customName : selectName;
    const sets = parseInt(document.getElementById('exSets').value) || 0;
    const reps = parseInt(document.getElementById('exReps').value) || 0;
    const duration = parseInt(document.getElementById('exDuration').value) || 0;
    const notes = document.getElementById('exNotes').value;

    if (!name) {
        showToast('Please select or enter an exercise name', 'error');
        return;
    }

    const isEdit = idInput.value !== '';
    const now = new Date();

    if (isEdit) {
        // Edit existing
        const index = exercises.findIndex(ex => ex.id === idInput.value);
        if (index > -1) {
            exercises[index] = {
                ...exercises[index],
                name, sets, reps, duration, notes
                // Keep original date
            };
            showToast('Exercise updated successfully');
        }
    } else {
        // Add new
        const newEx = {
            id: Date.now().toString(),
            name, sets, reps, duration, notes,
            date: now.toISOString(),
            dateStr: now.toLocaleDateString() // for easy grouping
        };
        exercises.unshift(newEx); // Add to beginning
        showToast('Exercise logged successfully');
    }

    Storage.set(STORAGE_KEYS.EXERCISES, exercises);
    resetForm();
    
    // Update dependent components
    renderExercises();
    renderTodayExercises();
    checkDailyProgress();
    updateStreak();
    renderCalendar();
    updateStatistics();
}

export function deleteExercise(id) {
    if (confirm('Are you sure you want to delete this exercise?')) {
        exercises = exercises.filter(ex => ex.id !== id);
        Storage.set(STORAGE_KEYS.EXERCISES, exercises);
        showToast('Exercise deleted', 'success');
        
        renderExercises();
        renderTodayExercises();
        checkDailyProgress();
        updateStreak();
        renderCalendar();
        updateStatistics();
    }
}

export function editExercise(id) {
    const ex = exercises.find(e => e.id === id);
    if (!ex) return;

    document.getElementById('exId').value = ex.id;
    
    const select = document.getElementById('exName');
    const customGroup = document.getElementById('customExGroup');
    const customInput = document.getElementById('customExName');
    
    // Check if name is in dropdown
    let optionExists = false;
    for(let i = 0; i < select.options.length; i++) {
        if(select.options[i].value === ex.name) {
            optionExists = true;
            break;
        }
    }

    if (optionExists) {
        select.value = ex.name;
        customGroup.classList.add('hidden');
    } else {
        select.value = 'Custom';
        customGroup.classList.remove('hidden');
        customInput.value = ex.name;
    }

    document.getElementById('exSets').value = ex.sets || '';
    document.getElementById('exReps').value = ex.reps || '';
    document.getElementById('exDuration').value = ex.duration || '';
    document.getElementById('exNotes').value = ex.notes || '';

    document.getElementById('saveExBtn').textContent = 'Update Exercise';
    document.getElementById('cancelEditBtn').classList.remove('hidden');
    
    // Switch to tracker tab and scroll up
    document.querySelector('[data-target=tracker]').click();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function resetForm() {
    document.getElementById('exerciseForm').reset();
    document.getElementById('exId').value = '';
    document.getElementById('customExGroup').classList.add('hidden');
    document.getElementById('saveExBtn').textContent = 'Add Exercise';
    document.getElementById('cancelEditBtn').classList.add('hidden');
}

function setupSearch() {
    const searchInput = document.getElementById('searchEx');
    if(searchInput) {
        searchInput.addEventListener('input', (e) => {
            renderExercises(e.target.value.toLowerCase());
        });
    }
}

function generateExerciseHTML(ex) {
    const dateObj = new Date(ex.date);
    const timeStr = dateObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    const dateStr = dateObj.toLocaleDateString();

    let details = [];
    if (ex.sets) details.push(`${ex.sets} Sets`);
    if (ex.reps) details.push(`${ex.reps} Reps`);
    if (ex.duration) details.push(`${ex.duration} min`);
    
    const cat = categoryMap[ex.name] || 'Custom';
    const catEmoji = cat === 'Strength' ? '🏋️' : (cat === 'Cardio' ? '🏃' : (cat === 'Flexibility' ? '🧘' : (cat === 'Core' ? '🛡️' : '✨')));

    return `
        <div class="exercise-card">
            <div class="ex-card-content flex-col w-full">
                <div class="flex-between w-full">
                    <div class="ex-details">
                        <h4>${ex.name} <span class="badge-category">${catEmoji} ${cat}</span></h4>
                        <div class="ex-meta">
                            <span>${details.join(' • ')}</span>
                            <span>📅 ${dateStr} at ${timeStr}</span>
                        </div>
                        ${ex.notes ? `<p class="text-sm text-muted mt-05">📝 ${ex.notes}</p>` : ''}
                    </div>
                    <div class="ex-actions">
                        <button class="icon-btn" onclick="window.FitTrack.editExercise('${ex.id}')" title="Edit">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="icon"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        </button>
                        <button class="icon-btn text-danger" onclick="window.FitTrack.deleteExercise('${ex.id}')" title="Delete">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="icon"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

export function renderExercises(searchTerm = '') {
    const list = document.getElementById('exerciseList');
    if (!list) return;

    const filtered = exercises.filter(ex => ex.name.toLowerCase().includes(searchTerm) || (ex.notes && ex.notes.toLowerCase().includes(searchTerm)));

    if (filtered.length === 0) {
        list.innerHTML = `
            <div class="empty-state">
                <p>${searchTerm ? 'No exercises match your search.' : 'No exercises logged yet.'}</p>
            </div>
        `;
        return;
    }

    list.innerHTML = filtered.map(generateExerciseHTML).join('');
}

export function renderTodayExercises() {
    const dashList = document.getElementById('dashTodayExercisesList');
    if (!dashList) return;

    const todayStr = new Date().toLocaleDateString();
    const todayExercises = exercises.filter(ex => ex.dateStr === todayStr);

    if (todayExercises.length === 0) {
        dashList.innerHTML = `
            <div class="empty-state">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="empty-icon"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path><path d="M12 12v9"></path><path d="m8 17 4 4 4-4"></path></svg>
                <p>No exercises logged today yet.</p>
                <button class="btn btn-outline mt-1" onclick="document.querySelector('[data-target=tracker]').click()">Log an Exercise</button>
            </div>
        `;
        return;
    }

    dashList.innerHTML = todayExercises.map(generateExerciseHTML).join('');
}
