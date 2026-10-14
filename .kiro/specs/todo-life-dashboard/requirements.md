# Requirements Document

## Introduction

The To-Do List Life Dashboard is a client-side web application built with HTML, CSS, and Vanilla JavaScript. It serves as a personal productivity hub accessible directly from a browser, requiring no backend server or complex setup. The Dashboard combines a contextual greeting with time/date display, a Pomodoro-style focus timer, a persistent task list, and a quick-links launcher -- all data stored via the browser's Local Storage API. The application targets modern browsers (Chrome, Firefox, Edge, Safari) and may also be distributed as a standalone browser extension.

## Glossary

- **Dashboard**: The single-page web application described in this document.
- **Greeting_Widget**: The UI component that displays the current time, date, and a time-of-day greeting, with support for a customized user name.
- **Focus_Timer**: The UI component that implements a configurable countdown timer with a default focus duration of 25 minutes and responds to Start, Stop, and Reset actions.
- **Time_Of_Day**: A period derived from the current local hour, classified as morning, afternoon, or evening.
- **Task_List**: The UI component that manages the user's to-do items, including task creation, editing, completion, deletion, and sorting.
- **Task**: A single to-do item containing a text description and a completion state (done or not done).
- **Quick_Links**: The UI component that manages and displays user-defined shortcut buttons to external websites.
- **Link**: A single saved link containing a display label and a destination URL.
- **Local_Storage**: The browser's localStorage Web API used for client-side data persistence.
- **Modern_Browser**: Chrome, Firefox, Edge, or Safari at their current stable release.

---

## Requirements

### Requirement 1: Greeting Widget -- Time and Date Display

**User Story:** As a user, I want to see the current time and date when I open the Dashboard, so that I have immediate temporal context without checking another app.

#### Acceptance Criteria

1. THE Greeting_Widget SHALL display the current time in HH:MM format (24-hour or 12-hour with AM/PM indicator).
2. THE Greeting_Widget SHALL display the current date including the day name, numeric day, month name, and full year (e.g., "Friday, 9 October 2026").
3. WHEN the Dashboard is opened, THE Greeting_Widget SHALL display the current time and date immediately, within 1 second of the Dashboard becoming visible.
4. WHILE the Dashboard is open, THE Greeting_Widget SHALL update the displayed time every 60 seconds to reflect the current time, with a maximum drift of 1 second from the device clock.
5. IF the device clock is unavailable, THEN THE Greeting_Widget SHALL display an error message indicating that the time and date cannot be retrieved, and SHALL NOT display a stale or placeholder time value.

---

### Requirement 2: Greeting Widget -- Contextual Greeting

**User Story:** As a user, I want to see a greeting that reflects the time of day, so that the Dashboard feels personal and relevant.

#### Acceptance Criteria

1. WHEN the current local time is between 05:00 and 11:59, THE Greeting_Widget SHALL display the message "Good Morning".
2. WHEN the current local time is between 12:00 and 17:59, THE Greeting_Widget SHALL display the message "Good Afternoon".
3. WHEN the current local time is between 18:00 and 21:59, THE Greeting_Widget SHALL display the message "Good Evening".
4. WHEN the current local time is between 22:00 and 04:59, THE Greeting_Widget SHALL display the message "Good Night".
5. WHILE the Dashboard is open, THE Greeting_Widget SHALL re-evaluate and update the greeting within 60 seconds of any time-of-day boundary crossing (05:00, 12:00, 18:00, 22:00).
6. WHEN a user name has been saved, THE Greeting_Widget SHALL display the greeting followed by the user name (e.g., "Good Morning, Robby").
7. WHEN no user name has been saved, THE Greeting_Widget SHALL display the greeting without a name suffix.

---

### Requirement 3: Focus Timer -- Countdown Behavior

**User Story:** As a user, I want a 25-minute focus timer, so that I can apply the Pomodoro technique to manage my work sessions.

#### Acceptance Criteria

1. THE Focus_Timer SHALL initialize with a countdown value equal to the user-configured focus duration each time the Dashboard loads, defaulting to 25 minutes and 00 seconds (25:00) if no custom duration has been saved.
2. WHEN the user activates the Start control, THE Focus_Timer SHALL begin counting down from the current displayed time in one-second intervals.
3. WHILE the Focus_Timer is counting down, THE Focus_Timer SHALL display the remaining time in MM:SS format, where MM ranges from 24 to 00 and SS ranges from 59 to 00, updating once per second.
4. WHEN the countdown reaches 00:00, THE Focus_Timer SHALL stop automatically and transition to a completed state.
5. WHEN the countdown reaches 00:00, THE Focus_Timer SHALL display a visible completion indicator within the timer UI area, replacing the Start control, to notify the user.
6. IF the user activates the Start control while the Focus_Timer is already counting down, THEN THE Focus_Timer SHALL ignore the activation and continue the countdown uninterrupted.

---

### Requirement 4: Focus Timer -- Controls

**User Story:** As a user, I want Start, Stop, and Reset controls on the Focus Timer, so that I can manage my focus sessions flexibly.

#### Acceptance Criteria

1. WHEN the user activates the Start control, THE Focus_Timer SHALL begin or resume the countdown from the current remaining time.
2. WHEN the user activates the Stop control, THE Focus_Timer SHALL pause the countdown while retaining the current remaining time displayed in MM:SS format.
3. WHEN the user activates the Reset control, THE Focus_Timer SHALL stop any active countdown and restore the displayed time to the user-configured focus duration (default 25:00).
4. WHILE the Focus_Timer is counting down, THE Focus_Timer SHALL disable the Start control to prevent duplicate activations.
5. WHILE the Focus_Timer is stopped or paused, THE Focus_Timer SHALL disable the Stop control.
6. IF the user activates the Start control while the displayed time is 00:00, THEN THE Focus_Timer SHALL ignore the activation and keep the Start control disabled.
7. WHEN the user activates the Reset control, THE Focus_Timer SHALL enable the Start control and disable the Stop control, reflecting the idle state.

---

### Requirement 5: To-Do List -- Task Creation

**User Story:** As a user, I want to add new tasks to my to-do list, so that I can capture things I need to do.

#### Acceptance Criteria

1. THE Task_List SHALL provide a text input field (maximum 500 characters) and an Add control for creating new tasks.
2. WHEN the user submits a non-empty task description via the Add control or by pressing the Enter key, THE Task_List SHALL trim leading and trailing whitespace from the description, then append a new Task with the trimmed description and a default completion state of incomplete.
3. WHEN a new Task is successfully created, THE Task_List SHALL clear the text input field.
4. IF the user attempts to submit an empty or whitespace-only task description, THEN THE Task_List SHALL not create a Task and SHALL retain focus on the text input field.
5. IF the user attempts to submit a task description exceeding 500 characters, THEN THE Task_List SHALL not create a Task and SHALL display an error message indicating the character limit, retaining focus on the text input field.
6. WHEN no sort order has been selected, THE Task_List SHALL render tasks in the order they were created, with the most recently added task appearing last in the list.

---

### Requirement 6: To-Do List -- Task Editing

**User Story:** As a user, I want to edit existing tasks, so that I can correct mistakes or update task descriptions.

#### Acceptance Criteria

1. THE Task_List SHALL provide an Edit control for each Task.
2. WHEN the user activates the Edit control for a Task, THE Task_List SHALL replace the Task's displayed description with an editable text input (maximum 255 characters) pre-populated with the current description.
3. WHEN the user confirms an edit containing a non-empty description, THE Task_List SHALL update the Task's stored description to the new value and display the updated description in read mode.
4. IF the user confirms an edit with an empty or whitespace-only description, THEN THE Task_List SHALL not update the Task and SHALL retain the editable input in focus.
5. WHEN the user cancels an edit, THE Task_List SHALL discard any changes and restore the Task's display to read mode with the original description.
6. WHEN the user activates the Edit control for a second Task while another Task is already in edit mode, THE Task_List SHALL cancel the first edit without saving and enter edit mode for the second Task.

---

### Requirement 7: To-Do List -- Task Completion

**User Story:** As a user, I want to mark tasks as done, so that I can track my progress.

#### Acceptance Criteria

1. THE Task_List SHALL provide a completion toggle control (checkbox) for each Task, visible and operable in both complete and incomplete states.
2. WHEN the user activates the completion toggle for an incomplete Task, THE Task_List SHALL update the Task's completion state to complete and apply a strikethrough visual style to the Task's description text within 200ms.
3. WHEN the user activates the completion toggle for a complete Task, THE Task_List SHALL update the Task's completion state to incomplete and remove the strikethrough visual style within 200ms.

---

### Requirement 8: To-Do List -- Task Deletion

**User Story:** As a user, I want to delete tasks, so that I can remove items I no longer need.

#### Acceptance Criteria

1. THE Task_List SHALL provide a Delete control for each Task.
2. WHEN the user activates the Delete control for a Task, THE Task_List SHALL permanently remove that Task from the list and it SHALL no longer appear in the Task_List.

---

### Requirement 9: To-Do List -- Persistence

**User Story:** As a user, I want my tasks to be saved automatically, so that they are still available when I reopen the Dashboard.

#### Acceptance Criteria

1. WHEN any Task is created, edited, marked complete, or deleted, THE Task_List SHALL persist the updated task collection to Local_Storage under the key named "tasks".
2. WHEN the Dashboard loads, THE Task_List SHALL read the task collection from Local_Storage and render all previously saved tasks.
3. IF Local_Storage does not contain a saved task collection on load, THEN THE Task_List SHALL render an empty list.
4. IF Local_Storage contains data under the "tasks" key that cannot be parsed as a valid task collection on Dashboard load, THEN THE Task_List SHALL render an empty list and display an error message indicating that saved tasks could not be loaded.
5. IF Local_Storage throws an error when the application attempts to write the task collection, THEN THE Task_List SHALL retain the updated task collection in memory for the current session and display an error message indicating that the change could not be saved permanently.

---

### Requirement 10: Quick Links -- Link Management

**User Story:** As a user, I want to add and delete quick-link buttons for my favorite websites, so that I can navigate to them with a single click.

#### Acceptance Criteria

1. THE Quick_Links component SHALL provide a text input for a link label (maximum 100 characters), a text input for a URL (maximum 2048 characters), and an Add control for creating new links.
2. WHEN the user submits a non-empty label and a URL beginning with "http://" or "https://" via the Add control, THE Quick_Links component SHALL create a new Link and display it as a clickable button.
3. WHEN the user activates a Link button, THE Quick_Links component SHALL open the associated URL in a new browser tab.
4. THE Quick_Links component SHALL provide a Delete control for each Link button.
5. WHEN the user activates the Delete control for a Link, THE Quick_Links component SHALL permanently remove that Link from the display.
6. IF the user attempts to submit a Link with an empty label or an empty URL, THEN THE Quick_Links component SHALL not create the Link and SHALL retain focus on the first empty input field.
7. IF the user attempts to submit a URL that does not begin with "http://" or "https://", THEN THE Quick_Links component SHALL not create the Link, SHALL display an error message indicating the URL format requirement, and SHALL retain focus on the URL input field.

---

### Requirement 11: Quick Links -- Persistence

**User Story:** As a user, I want my quick links to be saved automatically, so that they are available every time I open the Dashboard.

#### Acceptance Criteria

1. WHEN any Link is created or deleted, THE Quick_Links component SHALL persist the updated link collection to Local_Storage under a key named "quickLinks" that is different from the key used to store the task collection.
2. WHEN the Dashboard loads, THE Quick_Links component SHALL read the link collection from Local_Storage under the "quickLinks" key and render all previously saved links within 300ms of the Dashboard becoming visible.
3. IF Local_Storage does not contain a saved link collection on Dashboard load, THEN THE Quick_Links component SHALL render an empty Quick_Links section with no link items displayed.
4. IF Local_Storage is unavailable or throws an error when persisting a link collection change, THEN THE Quick_Links component SHALL retain the updated link collection in memory for the current session and display an error message indicating that changes could not be saved permanently.
5. IF Local_Storage is unavailable or throws an error when reading the link collection on Dashboard load, THEN THE Quick_Links component SHALL render an empty Quick_Links section and display an error message indicating that saved links could not be loaded.

---

### Requirement 12: Layout and Visual Design

**User Story:** As a user, I want a clean, minimal, and visually clear interface, so that the Dashboard is easy to read and use at a glance.

#### Acceptance Criteria

1. THE Dashboard SHALL render all four widgets (Greeting_Widget, Focus_Timer, Task_List, Quick_Links) on a single HTML page without requiring navigation or page reloads.
2. THE Dashboard SHALL apply styles from exactly one CSS file located in a `css/` directory.
3. THE Dashboard SHALL execute behavior from exactly one JavaScript file located in a `js/` directory.
4. THE Dashboard SHALL apply a minimum contrast ratio of 4.5:1 between text and background colors, a distinct visible boundary (border or spacing of at least 16px) separating each widget section, and a base font size of at least 16px for body text.
5. THE Dashboard SHALL provide a responsive layout such that at 320px viewport width all four widgets are visible and usable in a single-column stacked arrangement, and at 1920px viewport width the widgets are arranged in a multi-column layout with no horizontal scrollbar.

---

### Requirement 13: Browser Compatibility and Performance

**User Story:** As a user, I want the Dashboard to load fast and work in any modern browser, so that I can rely on it daily without friction.

#### Acceptance Criteria

1. THE Dashboard SHALL load and render all widgets within 2 seconds on a standard broadband connection (download speed >= 25 Mbps) using a Modern_Browser, measured from the time the page request is initiated until all widgets are visible and interactive.
2. THE Dashboard SHALL function correctly in the latest stable release of Chrome, Firefox, Edge, and Safari, without requiring the user to install any plugins, extensions, or additional software; all required polyfills, if any, SHALL be bundled within the application itself.
3. THE Dashboard SHALL produce no JavaScript errors in the browser console during normal operation, where normal operation includes page load, widget rendering, and all user interactions defined in the Dashboard's documented feature set.
4. WHEN the user interacts with any control (add, edit, delete, toggle, or timer button), THE Dashboard SHALL reflect the updated state in the UI within 100 milliseconds, measured from the moment the user input event (click or keypress) is registered by the browser.

---

### Requirement 14: Greeting Widget -- Custom User Name

**User Story:** As a user, I want to enter my name so that the greeting feels personal and addresses me directly.

#### Acceptance Criteria

1. THE Greeting_Widget SHALL provide a text input and a Save control that allow the user to enter or update their display name.
2. WHEN the user saves a non-empty name, THE Greeting_Widget SHALL persist the name to Local_Storage under the key "userName" and immediately update the displayed greeting to include the saved name.
3. WHEN the Dashboard loads, THE Greeting_Widget SHALL read the "userName" key from Local_Storage and display the greeting with the saved name if one exists.
4. IF the user saves an empty or whitespace-only name, THEN THE Greeting_Widget SHALL clear the saved name from Local_Storage and display the greeting without a name suffix.
5. THE saved name SHALL be retained across page reloads until the user explicitly clears it.

---

### Requirement 15: Focus Timer -- Configurable Duration

**User Story:** As a user, I want to set a custom focus duration before starting the timer, so that I can adapt my work sessions to different tasks.

#### Acceptance Criteria

1. THE Focus_Timer SHALL provide a duration input control (e.g., a number input or preset selector) that allows the user to set the focus duration in whole minutes, accepting values from 1 to 60 minutes inclusive.
2. THE duration input control SHALL only be available when the Focus_Timer is in the Idle state (not while counting down or paused).
3. WHEN the user sets a valid duration and the Focus_Timer is in the Idle state, THE Focus_Timer SHALL update the displayed time to reflect the new duration immediately.
4. WHEN the user activates the Reset control, THE Focus_Timer SHALL restore the displayed time to the most recently configured duration (default 25 minutes if none has been set).
5. THE Focus_Timer SHALL persist the user-configured duration to Local_Storage under the key "pomodoroMinutes" so that it is restored on the next Dashboard load.
6. IF the user enters a value outside the range 1–60, THEN THE Focus_Timer SHALL not accept the value and SHALL retain the current configured duration.
7. THE default focus duration SHALL be 25 minutes. IF no custom duration has been saved to Local_Storage, THEN THE Focus_Timer SHALL use 25 minutes.

---

### Requirement 16: To-Do List -- Sort Tasks

**User Story:** As a user, I want to sort my task list in different orders, so that I can prioritise and review tasks more easily.

#### Acceptance Criteria

1. THE Task_List SHALL provide a sort control that offers at least the following sort options: "Date Added" (creation order, oldest first), "A → Z" (alphabetical by description, ascending), "Z → A" (alphabetical by description, descending), "Completed Last" (incomplete tasks first, completed tasks last).
2. WHEN the user selects a sort option, THE Task_List SHALL re-render the task list in the selected order immediately, without modifying the underlying task data, completion states, or stored task array order.
3. THE sort control SHALL default to "Date Added" when no sort preference has been saved.
4. THE Task_List SHALL persist the selected sort option to Local_Storage under the key "taskSortOrder" so that the same sort order is applied on the next Dashboard load.
5. WHEN the Dashboard loads, THE Task_List SHALL read the "taskSortOrder" key from Local_Storage and apply the saved sort order to the rendered task list.
6. WHEN a new task is added, THE Task_List SHALL insert it into the underlying array in creation order and then re-render using the currently active sort order.
