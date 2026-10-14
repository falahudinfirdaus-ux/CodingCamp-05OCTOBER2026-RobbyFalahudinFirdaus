# Implementation Plan: To-Do List Life Dashboard

## Overview

Build a self-contained, client-side single-page application using plain HTML, CSS, and Vanilla JavaScript. All logic lives in `js/app.js`, styles in `css/style.css`, and state is persisted via `localStorage`. The implementation follows an IIFE-style module pattern — one block per widget — with shared utilities at the top of `app.js`.

## Tasks

- [ ] 1. Scaffold project structure and HTML entry point
  - Create `index.html` with semantic HTML5 boilerplate: `<head>`, `<body>`, a `<link>` to `css/style.css`, and a `<script defer>` tag pointing to `js/app.js`
  - Add four widget container elements with appropriate IDs: `#greeting-widget`, `#focus-timer`, `#task-list`, `#quick-links`
  - Add the shared `<div id="error-banner">` element at the top of `<body>`
  - Create empty placeholder files `css/style.css` and `js/app.js`
  - _Requirements: 12.1, 12.2, 12.3_

- [ ] 2. Implement shared utility functions in `js/app.js`
  - [ ] 2.1 Implement `storageGet(key, fallback)` and `storageSet(key, value)`
    - `storageGet`: wraps `JSON.parse(localStorage.getItem(key))` in a try/catch; returns `fallback` on missing key, parse error, or `SecurityError`
    - `storageSet`: wraps `localStorage.setItem(key, JSON.stringify(value))` in a try/catch; returns `false` and calls `showError` on `QuotaExceededError` or `SecurityError`
    - _Requirements: 9.1, 9.2, 9.4, 9.5, 11.1, 11.4, 11.5_
  - [ ] 2.2 Implement `sanitise(str)` and `showError(message)`
    - `sanitise`: trims input string and returns `null` if result is empty, otherwise returns the trimmed string
    - `showError`: sets text in `#error-banner`, makes it visible, and auto-dismisses after 5 seconds; appends new messages rather than overwriting
    - _Requirements: 5.2, 5.4, 6.3, 6.4, 9.4, 9.5_

- [ ] 3. Implement Greeting Widget
  - [ ] 3.1 Implement `getGreetingTier(hour)` pure function and `initGreetingWidget()`
    - `getGreetingTier(hour)`: maps integer hour [0–23] to one of "Good Morning" / "Good Afternoon" / "Good Evening" / "Good Night" per the design tier table
    - `initGreetingWidget()`: reads `new Date()`, checks `isNaN(date.getTime())` for clock unavailability (renders error state per Req 1.5), formats HH:MM and date string, determines greeting tier, writes to DOM, then schedules a `setInterval` every 60 000 ms to repeat
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1, 2.2, 2.3, 2.4, 2.5_
  - [ ] 3.2 Implement custom user name in Greeting Widget
    - Add a `<input type="text" id="user-name-input">` and a Save button inside the Greeting_Widget section of `index.html`
    - On init: read `storageGet("userName", "")` and pre-populate the input with the saved value
    - `renderGreeting()` reads `userName`; if non-empty renders `"{tier}, {userName}"`; if empty renders just the tier string
    - On Save button click: call `sanitise()` on the input value; if result is non-null write to localStorage `"userName"` and re-render; if result is null remove `"userName"` from localStorage and re-render
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5_

- [ ] 4. Implement Focus Timer
  - [ ] 4.1 Implement timer state machine and countdown logic
    - Define states: Idle, Running, Paused, Completed; initialise at Idle with `remaining = 1500` (25 × 60)
    - Implement `startTimer()`, `stopTimer()`, `resetTimer()` functions that drive a 1-second `setInterval` and transition between states
    - Implement `formatTime(seconds)` → "MM:SS" string
    - On `Completed` state: clear interval, display completion indicator, disable Start and Stop per the button rule table
    - Timer state is session-only — do NOT write to `localStorage`
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 4.1, 4.2, 4.3_
  - [ ] 4.2 Wire Start / Stop / Reset button enable/disable rules
    - Apply the enable/disable table from the design on every state transition: Idle (Start on, Stop off), Running (Start off, Stop on), Paused (Start on, Stop off), Completed (Start off, Stop off)
    - Reset always re-enables Start and disables Stop (Req 4.7)
    - _Requirements: 4.4, 4.5, 4.6, 4.7_
  - [ ] 4.3 Implement configurable Pomodoro duration
    - Add a `<input type="number" min="1" max="60" id="pomodoro-duration">` inside the Focus_Timer section
    - On init: read `storageGet("pomodoroMinutes", 25)`, clamp to [1, 60], store as `configuredMinutes`, set `remaining = configuredMinutes * 60`; pre-populate the duration input with the loaded value
    - Show the duration input only in Idle state; hide/disable it in Running, Paused, and Completed states (apply same enable/disable update function that manages Start/Stop buttons)
    - On duration input change: validate integer in [1, 60]; if valid update `configuredMinutes`, `remaining`, persist to localStorage `"pomodoroMinutes"`, update display; if invalid ignore
    - Update `resetTimer()` to set `remaining = configuredMinutes * 60` instead of hardcoded 1500
    - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5, 15.6, 15.7_

- [ ] 5. Manual verification checkpoint
  - Manually verify in the browser that all implemented features in the preceding tasks work correctly, data persists through page reload, and no JavaScript errors appear in the console. Ask the user if questions arise.

- [ ] 6. Implement To-Do List
  - [ ] 6.1 Implement task data helpers and `renderTaskList()`
    - Define in-memory `tasks` array; implement `renderTaskList()` using a document fragment full-re-render strategy, event delegation on the `<ul>` container
    - Each task row renders: checkbox, description `<span>`, Edit button, Delete button; apply strikethrough style when `completed === true`
    - Load initial state via `storageGet("tasks", [])` on init; drop invalid items (see data model validation rules)
    - _Requirements: 5.6, 7.2, 7.3, 9.2, 9.3, 9.4_
  - [ ] 6.2 Implement task creation (add)
    - On Add control click or Enter key in the input: call `sanitise()`, validate length ≤ 500, generate ID via `crypto.randomUUID()`, push to `tasks`, call `storageSet("tasks", tasks)`, re-render, clear input
    - Reject empty/whitespace (retain focus, no new task) and over-500-char descriptions (show error, retain focus)
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_
  - [ ] 6.3 Implement task sort control
    - Add a `<select id="task-sort">` control with four `<option>` elements: `value="dateAdded"` label "Date Added", `value="az"` label "A → Z", `value="za"` label "Z → A", `value="completedLast"` label "Completed Last"
    - On init: read `storageGet("taskSortOrder", "dateAdded")`; set `activeSortOrder` variable; set the `<select>` selected value to match
    - Implement `getSortedTasks(tasks, order)` pure function (returns sorted copy, never mutates original array):
      - `"dateAdded"`: return `[...tasks]` (preserve insertion order)
      - `"az"`: sort copy by `description.toLowerCase()` ascending
      - `"za"`: sort copy by `description.toLowerCase()` descending
      - `"completedLast"`: stable sort, `completed === false` before `completed === true`
    - Update `renderTaskList()` to call `getSortedTasks(tasks, activeSortOrder)` and render from the result
    - On sort `<select>` change event: update `activeSortOrder`, persist to localStorage `"taskSortOrder"`, call `renderTaskList()`
    - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5, 16.6_
  - [ ] 6.4 Implement inline task editing
    - On Edit button: replace description `<span>` with `<input maxlength="255">` pre-populated with current description; enforce at-most-one-edit-at-a-time rule (cancel previous editor without saving on second Edit activation)
    - On Confirm: call `sanitise()`, validate non-empty, update `tasks[i].description`, persist, re-render
    - On Cancel: re-render without changes
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_
  - [ ] 6.5 Implement task completion toggle
    - On checkbox change: flip `tasks[i].completed`, persist, re-render; apply/remove strikethrough CSS class within 200 ms
    - _Requirements: 7.1, 7.2, 7.3, 7.4_
  - [ ] 6.6 Implement task deletion
    - On Delete button: splice task from array, persist, re-render
    - _Requirements: 8.1, 8.2_
  - [ ] 6.7 Wire `storage` event listener for cross-tab sync (tasks)
    - In the `storage` event handler, when `event.key === "tasks"`: call `storageGet("tasks", [])` and re-render; do NOT fire on writes originating in the same tab
    - _Requirements: 13.6_

- [ ] 7. Manual verification checkpoint
  - Manually verify in the browser that all implemented features in the preceding tasks work correctly, data persists through page reload, and no JavaScript errors appear in the console. Ask the user if questions arise.

- [ ] 8. Implement Quick Links
  - [ ] 8.1 Implement link data helpers and `renderQuickLinks()`
    - Define in-memory `quickLinks` array; implement `renderQuickLinks()` using document fragment full-re-render, event delegation on the links container
    - Each link renders as a `<button>` (opens URL in new tab via `window.open(url, "_blank")`) plus a Delete button; load initial state via `storageGet("quickLinks", [])`, drop invalid items
    - _Requirements: 10.3, 11.2, 11.3, 11.5_
  - [ ] 8.2 Implement link creation with URL validation
    - On Add control: trim label and URL inputs; validate label non-empty (≤ 100 chars) and URL starts with `"http://"` or `"https://"` and passes `new URL()` constructor check and is ≤ 2048 chars; generate ID via `crypto.randomUUID()`, push to `quickLinks`, persist, re-render
    - Show appropriate error messages for empty fields or invalid URL scheme; retain focus on first empty/invalid field
    - _Requirements: 10.1, 10.2, 10.6, 10.7_
  - [ ] 8.3 Implement link deletion
    - On Delete button: splice link from `quickLinks`, call `storageSet("quickLinks", quickLinks)`, re-render
    - _Requirements: 10.4, 10.5_
  - [ ] 8.4 Wire `storage` event listener for cross-tab sync (quickLinks)
    - When `event.key === "quickLinks"`: re-read and re-render; handle in the same shared `storage` listener as the tasks key
    - _Requirements: 13.6_

- [ ] 9. Implement CSS styling
  - [ ] 9.1 Implement base styles, typography, and layout grid
    - Set `font-size: 1rem` (≥ 16px) on `body`; define a CSS Grid or Flexbox layout that stacks all four widgets in a single column at 320 px viewport width and arranges them in a multi-column layout at 1920 px (use `@media` breakpoints)
    - Add visible separation (border or gap ≥ 16 px) between each widget section
    - _Requirements: 12.4, 12.5_
  - [ ] 9.2 Style individual widgets and interactive states
    - Style the Greeting Widget (large clock, date line, greeting headline), Focus Timer (large MM:SS display, button group, completion indicator), Task List (task rows with checkbox, strikethrough on complete, edit/delete controls), Quick Links (button grid, delete affordance), and error banner (top-of-page, auto-dismiss)
    - Ensure minimum 4.5:1 contrast ratio between text and background for all text elements
    - _Requirements: 7.2, 7.3, 12.4_

- [ ] 10. Manual verification checkpoint
  - Manually verify in the browser that all implemented features in the preceding tasks work correctly, data persists through page reload, and no JavaScript errors appear in the console. Ask the user if questions arise.

- [ ] 11. Final integration and wiring
  - [ ] 11.1 Wire `DOMContentLoaded` initialisation sequence in `app.js`
    - On `DOMContentLoaded`: call `initGreetingWidget()`, `initFocusTimer()`, `initTaskList()`, `initQuickLinks()`, and register the shared `storage` event listener on `window`
    - Verify all four widget containers are present in the DOM before initialising
    - _Requirements: 12.1, 12.3, 13.1_

- [ ] 12. Final manual verification
  - Open `index.html` in a browser, verify all four widgets render, no console errors
  - Test all MVP features: time/date display, greeting, timer, tasks (add/edit/complete/delete), links (add/delete)
  - Test three challenge features: save/clear user name in greeting, set custom Pomodoro duration, sort tasks in all four orders
  - Verify all localStorage keys persist through page reload: `tasks`, `quickLinks`, `userName`, `pomodoroMinutes`, `taskSortOrder`
  - _Requirements: 1–16, 13.3_

## Notes

- All verification is done manually in the browser as described in the Manual Verification section of design.md
- Timer state is intentionally session-only and has no localStorage persistence tasks
- The `storage` event fires only in other tabs (not the originating tab), so cross-tab sync does not cause duplicate renders

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["2.1", "2.2"] },
    { "id": 2, "tasks": ["3.1"] },
    { "id": 3, "tasks": ["3.2", "4.1"] },
    { "id": 4, "tasks": ["4.2", "4.3", "6.1"] },
    { "id": 5, "tasks": ["6.2", "6.3"] },
    { "id": 6, "tasks": ["6.4", "6.5", "6.6", "8.1"] },
    { "id": 7, "tasks": ["6.7", "8.2", "8.3"] },
    { "id": 8, "tasks": ["8.4", "9.1", "9.2"] },
    { "id": 9, "tasks": ["11.1"] }
  ]
}
```
