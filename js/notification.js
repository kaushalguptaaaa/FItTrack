/**
 * Notification module
 * Manages Toast notifications and Confetti popups
 */

export function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    // SVG icons based on type
    const iconHtml = type === 'success' 
        ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="icon text-secondary"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`
        : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="icon text-danger"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;

    toast.innerHTML = `
        ${iconHtml}
        <span>${message}</span>
    `;

    container.appendChild(toast);

    // Remove element after animation ends (3s delay + 0.3s slideout defined in CSS)
    setTimeout(() => {
        if(toast.parentElement) {
            toast.remove();
        }
    }, 3500);
}

export function triggerConfetti() {
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        
        // Randomize colors
        const colors = ['#22C55E', '#4F46E5', '#F59E0B', '#EF4444'];
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        
        // Randomize position and animation delay
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.animationDelay = Math.random() * 2 + 's';
        
        document.body.appendChild(confetti);

        // Remove confetti element after fall animation (3s)
        setTimeout(() => {
            confetti.remove();
        }, 5000);
    }
}
