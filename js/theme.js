/**
 * Theme module
 * Handles dark/light mode toggle and persistence
 */
import { Storage, STORAGE_KEYS } from './storage.js';

export function initTheme() {
    const savedTheme = Storage.get(STORAGE_KEYS.THEME, 'light');
    applyTheme(savedTheme);

    const themeToggleBtn = document.getElementById('themeToggle');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', toggleTheme);
    }
}

function applyTheme(theme) {
    const root = document.documentElement;
    const moonIcon = document.getElementById('moonIcon');
    const sunIcon = document.getElementById('sunIcon');

    if (theme === 'dark') {
        root.setAttribute('data-theme', 'dark');
        if (moonIcon && sunIcon) {
            moonIcon.classList.add('hidden');
            sunIcon.classList.remove('hidden');
        }
    } else {
        root.removeAttribute('data-theme');
        if (moonIcon && sunIcon) {
            moonIcon.classList.remove('hidden');
            sunIcon.classList.add('hidden');
        }
    }
    
    // Save to local storage
    Storage.set(STORAGE_KEYS.THEME, theme);
}

function toggleTheme() {
    const root = document.documentElement;
    const currentTheme = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(currentTheme);
    
    // Optional: show a quick toast? (uncomment if desired)
    // import { showToast } from './notification.js';
    // showToast(`Switched to ${currentTheme} mode`);
}
