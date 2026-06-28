/**
 * App initialization and Navigation
 */
import { initTheme } from './theme.js';
import { initExercises, editExercise, deleteExercise } from './exercise.js';
import { initStreak } from './streak.js';
import { initProgress } from './progress.js';
import { initBMI, deleteBMI } from './bmi.js';
import { initStatistics } from './statistics.js';
import { initCalendar } from './calendar.js';
import { initExtras } from './extras.js';

// Expose certain functions to global scope for HTML inline handlers
window.FitTrack = {
    editExercise,
    deleteExercise,
    deleteBMI
};

document.addEventListener('DOMContentLoaded', () => {
    // 1. Set current year in footer
    const yearEl = document.getElementById('currentYear');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // 2. Initialize Navigation
    setupNavigation();

    // 3. Initialize Modules
    initTheme();
    initExercises();
    initStreak();
    initProgress();
    initBMI();
    initStatistics();
    initCalendar();
    initExtras();

    // Setup Back to top
    const backToTopBtn = document.getElementById('backToTopBtn');
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Start tracking button
    const startBtn = document.getElementById('startTrackingBtn');
    if (startBtn) {
        startBtn.addEventListener('click', () => {
            document.querySelector('[data-target=dashboard]').click();
        });
    }
});

function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section-container');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinksContainer = document.getElementById('navLinks');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active classes
            navLinks.forEach(l => l.classList.remove('active'));
            sections.forEach(s => {
                s.classList.remove('active-section');
                s.classList.add('hidden-section');
            });

            // Add active class to clicked
            link.classList.add('active');
            
            const targetId = link.getAttribute('data-target');
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.classList.remove('hidden-section');
                targetSection.classList.add('active-section');
                
                // If switching to dashboard, re-render calendar and stats widgets
                if (targetId === 'dashboard') {
                    import('./calendar.js').then(m => m.renderCalendar());
                    import('./statistics.js').then(m => m.updateStatistics());
                }
            }

            // Close mobile menu if open
            if (navLinksContainer.classList.contains('show')) {
                navLinksContainer.classList.remove('show');
            }

            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });

    // Mobile menu toggle
    if (mobileMenuBtn && navLinksContainer) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinksContainer.classList.toggle('show');
        });
    }
}
