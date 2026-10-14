# To-Do List Life Dashboard

A personal productivity dashboard developed as a Mini Coding Project for **RevoU Coding Camp — Software Engineering (October 2026)**.

This project is a client-side web application designed to help users organize daily activities, manage focus sessions, track tasks, and access frequently visited websites through a simple, interactive dashboard.

## Live Demo

**[View Live Website](https://falahudinfirdaus-ux.github.io/CodingCamp-05OCTOBER2026-RobbyFalahudinFirdaus/)**

**[GitHub Repository](https://github.com/falahudinfirdaus-ux/CodingCamp-05OCTOBER2026-RobbyFalahudinFirdaus)**

## Features

### 1. Greeting Widget
- Displays the current time and date.
- Shows a contextual greeting based on the time of day.
- Allows users to personalize the greeting with their name.

### 2. Focus Timer
- Provides a Pomodoro-style countdown timer.
- Includes Start, Stop, and Reset controls.
- Uses a default focus duration of 25 minutes.
- Supports custom focus durations from 1 to 60 minutes.

### 3. To-Do List
- Add new tasks.
- Edit existing tasks.
- Mark tasks as completed or incomplete.
- Delete tasks.
- Sort tasks by date added, alphabetical order (A–Z or Z–A), or completion status.
- Save tasks locally in the browser.

### 4. Quick Links
- Add shortcuts to frequently visited websites.
- Open saved websites in a new browser tab.
- Delete saved shortcuts.
- Save quick links locally in the browser.

## Additional Challenges

The project includes three selected challenges from the RevoU mini project brief:

1. **Custom Name in Greeting** — Personalize the greeting with a saved user name.
2. **Configurable Pomodoro Duration** — Adjust the focus timer duration.
3. **Task Sorting** — Organize tasks using different sorting options.

## Technologies Used

- **HTML5** — Page structure and semantic elements.
- **CSS3** — Styling and responsive layout.
- **Vanilla JavaScript** — Application logic and user interactions.
- **Web Storage API (localStorage)** — Client-side data persistence.
- **Kiro** — AI-assisted development and project specification.
- **Git & GitHub** — Version control and source code hosting.
- **GitHub Pages** — Website deployment.

The application does not require a backend server or JavaScript framework.

## Project Structure

```text
CodingCamp-05OCTOBER2026-RobbyFalahudinFirdaus/
├── .kiro/
│   └── specs/
│       └── todo-life-dashboard/
│           ├── .config.kiro
│           ├── requirements.md
│           ├── design.md
│           └── tasks.md
├── css/
│   └── style.css
├── js/
│   └── app.js
├── index.html
└── README.md
```

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/falahudinfirdaus-ux/CodingCamp-05OCTOBER2026-RobbyFalahudinFirdaus.git
   ```

2. Open the project directory.

3. Open `index.html` in a modern web browser.

Alternatively, access the deployed application using the live demo link above.

No package installation, build process, or backend configuration is required.

## Data Storage

The application uses the browser's `localStorage` to save user preferences and data, including:

- To-do list tasks
- Quick links
- User name
- Configured Pomodoro duration
- Selected task sorting preference

Data is stored locally in the user's browser rather than in an external database. The active countdown timer is not saved between sessions.

## Project Documentation

The `.kiro/specs/todo-life-dashboard/` directory contains the project's planning and specification documents:

- `requirements.md` — Functional requirements and acceptance criteria.
- `design.md` — Application architecture, component design, and data models.
- `tasks.md` — Implementation plan and development tasks.
- `.config.kiro` — Kiro specification configuration.

## Program Information

**Program:** RevoU Coding Camp — Software Engineering  
**Project:** To-Do List Life Dashboard  
**Batch:** 05 October 2026  
**Participant:** Robby Falahudin Firdaus  
**Project Type:** Individual Mini Coding Project

## Author

**Robby Falahudin Firdaus**

GitHub: [falahudinfirdaus-ux](https://github.com/falahudinfirdaus-ux)

---

*Developed as part of the RevoU Coding Camp Software Engineering mini project.*