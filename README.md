# FitTrack - Personal Fitness Tracker

FitTrack is a fully functional, modern, and responsive Personal Fitness Tracker Web Application built exclusively with HTML5, CSS3, and Vanilla JavaScript (ES6). It operates entirely locally within the browser, storing all data persistently using Local Storage, ensuring complete offline functionality and data privacy.

This project was developed as a Summer Web Programming Course Project to demonstrate strong front-end development skills without relying on any external frameworks (like React or Bootstrap) or backend databases.

## Features

- **Interactive Dashboard**: View your current streak, daily goal progress, and a quick summary of your workouts.
- **Exercise Tracker**: Log your daily exercises including details like sets, reps, duration, and notes. Add custom exercises if they aren't in the preset list.
- **BMI Calculator**: Calculate your Body Mass Index, get category feedback (Normal, Overweight, etc.), and track your BMI history over time.
- **Workout Calendar**: View your consistency visually across the month. Completed workout days turn green, missed days turn red.
- **Progress Tracking**: Set daily goals (e.g., complete 5 exercises a day) and watch the animated progress bar fill up. A celebration modal appears when you hit your target.
- **Workout Streak**: Tracks how many consecutive days you've logged a workout. Keep the streak alive!
- **Statistics & Charts**: View total workouts, duration, and a custom-built, text-block based activity chart showing the last 7 days of activity.
- **Extras**: Includes a Water Intake Tracker, daily motivational quotes, and the ability to export or import your data as a JSON file.
- **Dark/Light Theme**: A smooth, persistent toggle between a modern Dark mode and a clean Light mode.
- **Responsive Design**: Carefully crafted with media queries to ensure a flawless experience across mobile phones, tablets, and desktop computers.

## Technologies Used

- **HTML5**: Semantic markup and layout structure.
- **CSS3**: Variables, Flexbox, Grid, Glassmorphism, smooth animations, and responsive design (media queries).
- **Vanilla JavaScript (ES6)**: ES6 Modules, DOM manipulation, event handling, data structures.
- **Local Storage API**: Persistent offline data storage.

*Note: No external libraries, fonts via CDNs, or CSS frameworks were used in the making of this project.*

## Setup Instructions

1. Clone or download the repository to your local machine.
2. Ensure the folder structure is intact (index.html at the root, along with `css/` and `js/` folders).
3. Open `index.html` in any modern web browser (Google Chrome, Firefox, Safari, Edge).
4. For the ES6 modules to work properly locally, some browsers require you to serve the folder via a local server (e.g., using VS Code Live Server, or running `python -m http.server 8000` in the directory).

## Learning Outcomes

- Mastery of the DOM API for creating, updating, and removing elements dynamically.
- Deep understanding of the Browser's Local Storage capabilities and limitations.
- Proficiency in organizing JavaScript into modular files for better maintainability.
- Advanced CSS techniques including custom properties (variables) for theming and creating modern aesthetics (Glassmorphism).
- Implementing responsive web design from scratch without Bootstrap or Tailwind.