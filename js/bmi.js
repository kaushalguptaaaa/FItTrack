/**
 * BMI module
 * Handles BMI calculation and history tracking.
 */
import { Storage, STORAGE_KEYS } from './storage.js';
import { showToast } from './notification.js';

let bmiHistory = [];

export function initBMI() {
    bmiHistory = Storage.get(STORAGE_KEYS.BMI_HISTORY, []);
    setupForm();
    renderHistory();
}

function setupForm() {
    const form = document.getElementById('bmiForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        calculateBMI();
    });
}

function calculateBMI() {
    const height = parseFloat(document.getElementById('bmiHeight').value);
    const weight = parseFloat(document.getElementById('bmiWeight').value);

    if (isNaN(height) || isNaN(weight) || height <= 0 || weight <= 0) {
        showToast('Please enter valid height and weight', 'error');
        return;
    }

    // BMI Formula: weight (kg) / (height (m))^2
    const heightInMeters = height / 100;
    const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);
    
    let category = '';
    let badgeClass = '';

    if (bmi < 18.5) {
        category = 'Underweight';
        badgeClass = 'badge-warning';
    } else if (bmi >= 18.5 && bmi <= 24.9) {
        category = 'Normal';
        badgeClass = 'badge-normal';
    } else if (bmi >= 25 && bmi <= 29.9) {
        category = 'Overweight';
        badgeClass = 'badge-warning';
    } else {
        category = 'Obese';
        badgeClass = 'badge-danger';
    }

    displayResult(bmi, category, badgeClass);
    saveHistory(bmi, category, height, weight);
    showToast('BMI Calculated');
}

function displayResult(bmi, category, badgeClass) {
    const resultCard = document.getElementById('bmiResultCard');
    const valueDisplay = document.getElementById('bmiValueDisplay');
    const badge = document.getElementById('bmiCategoryBadge');
    const dot = document.getElementById('bmiScaleDot');

    valueDisplay.textContent = bmi;
    badge.textContent = category;
    
    // reset classes
    badge.className = `badge mt-1 inline-block ${badgeClass}`;
    
    resultCard.classList.remove('hidden');

    if (dot) {
        // Range 15 to 40. Clamp the BMI.
        const minBMI = 15;
        const maxBMI = 40;
        let clampedBMI = Math.max(minBMI, Math.min(bmi, maxBMI));
        let percentage = ((clampedBMI - minBMI) / (maxBMI - minBMI)) * 100;
        
        // Reset and trigger reflow for animation
        dot.style.transition = 'none';
        dot.style.left = '0%';
        void dot.offsetWidth; // Trigger reflow
        dot.style.transition = 'left 0.8s ease-out';
        
        dot.style.left = `${percentage}%`;
    }
}

function saveHistory(bmi, category, height, weight) {
    const newEntry = {
        id: Date.now().toString(),
        bmi, category, height, weight,
        date: new Date().toISOString()
    };
    
    bmiHistory.unshift(newEntry);
    Storage.set(STORAGE_KEYS.BMI_HISTORY, bmiHistory);
    renderHistory();
}

export function deleteBMI(id) {
    bmiHistory = bmiHistory.filter(entry => entry.id !== id);
    Storage.set(STORAGE_KEYS.BMI_HISTORY, bmiHistory);
    renderHistory();
}

function renderHistory() {
    const list = document.getElementById('bmiHistoryList');
    if (!list) return;

    if (bmiHistory.length === 0) {
        list.innerHTML = `
            <div class="empty-state">
                <p>No BMI history recorded yet.</p>
            </div>
        `;
        return;
    }

    list.innerHTML = bmiHistory.map(entry => {
        const d = new Date(entry.date).toLocaleDateString();
        return `
            <div class="history-card">
                <div>
                    <h4>BMI: ${entry.bmi} <span class="text-sm font-normal text-muted">(${entry.category})</span></h4>
                    <p class="text-sm text-muted">Height: ${entry.height}cm | Weight: ${entry.weight}kg | ${d}</p>
                </div>
                <button class="icon-btn text-danger" onclick="window.FitTrack.deleteBMI('${entry.id}')" title="Delete">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="icon"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
            </div>
        `;
    }).join('');
}
