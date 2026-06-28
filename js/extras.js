/**
 * Extras module
 * Handles Water Intake, Quotes, Data Export/Import, and Clearing data.
 */
import { Storage, STORAGE_KEYS } from './storage.js';
import { showToast } from './notification.js';

const quotes = [
    "The only bad workout is the one that didn't happen.",
    "It never gets easier, you just get stronger.",
    "Wake up with determination. Go to bed with satisfaction.",
    "Don't stop when you're tired. Stop when you're done.",
    "Success starts with self-discipline.",
    "A one hour workout is 4% of your day. No excuses.",
    "Push yourself, because no one else is going to do it for you."
];

let waterIntake = {
    date: new Date().toLocaleDateString(),
    count: 0
};

export function initExtras() {
    setupQuote();
    initWaterTracker();
    setupDataManagement();
}

function setupQuote() {
    const quoteEl = document.getElementById('dailyQuoteText');
    if (!quoteEl) return;
    
    // Pick a pseudo-random quote based on the day of the year
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    
    const quoteIndex = dayOfYear % quotes.length;
    quoteEl.textContent = `"${quotes[quoteIndex]}"`;
}

function initWaterTracker() {
    const savedData = Storage.get(STORAGE_KEYS.WATER, null);
    const todayStr = new Date().toLocaleDateString();
    
    if (savedData && savedData.date === todayStr) {
        waterIntake = savedData;
    } else {
        waterIntake = { date: todayStr, count: 0 };
        Storage.set(STORAGE_KEYS.WATER, waterIntake);
    }

    renderWaterGlasses();
}

function renderWaterGlasses() {
    const container = document.getElementById('waterGlassesContainer');
    const countText = document.getElementById('waterCount');
    if (!container || !countText) return;

    countText.textContent = waterIntake.count;
    
    let html = '';
    for (let i = 1; i <= 8; i++) {
        const isFilled = i <= waterIntake.count ? 'filled' : '';
        html += `<div class="water-glass ${isFilled}" data-index="${i}"></div>`;
    }
    
    container.innerHTML = html;

    // Attach click events
    const glasses = container.querySelectorAll('.water-glass');
    glasses.forEach(glass => {
        glass.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index);
            // Toggle logic: clicking the exact filled glass will empty it
            if (waterIntake.count === index) {
                waterIntake.count = index - 1;
            } else {
                waterIntake.count = index;
            }
            Storage.set(STORAGE_KEYS.WATER, waterIntake);
            renderWaterGlasses();
        });
    });
}

function setupDataManagement() {
    const exportBtn = document.getElementById('exportDataBtn');
    const importInput = document.getElementById('importDataInput');
    const clearBtn = document.getElementById('clearDataBtn');

    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            const dataStr = Storage.exportData();
            const blob = new Blob([dataStr], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `FitTrack_Backup_${new Date().toLocaleDateString().replace(/\//g, '-')}.json`;
            a.click();
            URL.revokeObjectURL(url);
            showToast('Data exported successfully');
        });
    }

    if (importInput) {
        importInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                const content = event.target.result;
                const success = Storage.importData(content);
                if (success) {
                    showToast('Data imported successfully! Reloading...', 'success');
                    setTimeout(() => window.location.reload(), 1500);
                } else {
                    showToast('Failed to import data. Invalid format.', 'error');
                }
                importInput.value = ''; // Reset input
            };
            reader.readAsText(file);
        });
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to delete ALL data? This cannot be undone.')) {
                Storage.clearAll();
                showToast('All data cleared. Reloading...', 'success');
                setTimeout(() => window.location.reload(), 1500);
            }
        });
    }
}
