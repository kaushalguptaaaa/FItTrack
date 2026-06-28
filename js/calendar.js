/**
 * Calendar module
 * Renders the monthly workout calendar using Date objects and DOM.
 */
import { getExercises } from './exercise.js';

let currentDate = new Date(); // Month currently being viewed

export function initCalendar() {
    const prevBtn = document.getElementById('prevMonthBtn');
    const nextBtn = document.getElementById('nextMonthBtn');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderCalendar();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderCalendar();
        });
    }

    renderCalendar();
}

export function renderCalendar() {
    const monthYearEl = document.getElementById('calendarMonthYear');
    const gridEl = document.querySelector('.calendar-grid');
    if (!monthYearEl || !gridEl) return;

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Set Header text
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    monthYearEl.textContent = `${monthNames[month]} ${year}`;

    // Get active workout dates string formats
    const exercises = getExercises();
    const activeDates = new Set();
    exercises.forEach(ex => {
        activeDates.add(new Date(ex.date).toLocaleDateString());
    });

    // Clear existing days (keep day names)
    const dayNamesHtml = `
        <div class="day-name">Sun</div><div class="day-name">Mon</div><div class="day-name">Tue</div>
        <div class="day-name">Wed</div><div class="day-name">Thu</div><div class="day-name">Fri</div><div class="day-name">Sat</div>
    `;
    
    let html = dayNamesHtml;

    // Get first day of month and total days
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const today = new Date();
    const todayStr = today.toLocaleDateString();

    // Padding for first row
    for (let i = 0; i < firstDay; i++) {
        html += `<div class="cal-day empty"></div>`;
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const loopDate = new Date(year, month, day);
        const loopDateStr = loopDate.toLocaleDateString();
        
        let classes = ['cal-day'];
        
        // Check if completed
        if (activeDates.has(loopDateStr)) {
            classes.push('completed');
        } else if (loopDate < today && loopDateStr !== todayStr) {
            // Past day with no workout
            classes.push('missed');
        }

        // Check if current day
        if (loopDateStr === todayStr) {
            classes.push('current');
        }

        html += `<div class="${classes.join(' ')}">${day}</div>`;
    }

    gridEl.innerHTML = html;
}
