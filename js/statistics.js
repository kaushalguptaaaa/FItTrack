/**
 * Statistics module
 * Calculates totals and renders simple text-based block charts.
 */
import { getExercises } from './exercise.js';

export function initStatistics() {
    updateStatistics();
}

export function updateStatistics() {
    const exercises = getExercises();
    
    const totalExercises = exercises.length;
    let totalMinutes = 0;
    
    // Calculate total duration and unique active days
    const uniqueDays = new Set();
    
    exercises.forEach(ex => {
        totalMinutes += (ex.duration || 0);
        
        const d = new Date(ex.date);
        d.setHours(0,0,0,0);
        uniqueDays.add(d.getTime());
    });

    const totalDays = uniqueDays.size;

    // Update UI counters
    const dashTotalEx = document.getElementById('dashTotalExercises');
    if(dashTotalEx) dashTotalEx.textContent = totalExercises;
    
    const statTotalDays = document.getElementById('statTotalDays');
    if(statTotalDays) statTotalDays.textContent = totalDays;
    
    const statTotalMin = document.getElementById('statTotalMinutes');
    if(statTotalMin) statTotalMin.textContent = `${totalMinutes} min`;

    renderActivityChart(exercises);
}

function renderActivityChart(exercises) {
    const chartContainer = document.getElementById('activityChart');
    if (!chartContainer) return;

    if (exercises.length === 0) {
        chartContainer.innerHTML = '<p class="text-muted text-center mt-1">No data to display chart.</p>';
        return;
    }

    // Get last 7 days including today
    const days = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        days.push({
            dateStr: d.toLocaleDateString(),
            dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
            count: 0
        });
    }

    // Count exercises per day
    exercises.forEach(ex => {
        const exDateStr = new Date(ex.date).toLocaleDateString();
        const day = days.find(d => d.dateStr === exDateStr);
        if (day) {
            day.count++;
        }
    });

    const maxCount = Math.max(...days.map(d => d.count), 1); // Avoid division by zero

    let html = '<div class="css-chart-container">';
    days.forEach(day => {
        const heightPct = maxCount === 0 ? 0 : (day.count / maxCount) * 100;
        html += `
            <div class="css-chart-col">
                <span class="css-chart-val">${day.count}</span>
                <div class="css-chart-bar" style="height: ${heightPct}%;"></div>
                <span class="css-chart-label">${day.dayName}</span>
            </div>
        `;
    });
    html += '</div>';

    chartContainer.innerHTML = html;
}
