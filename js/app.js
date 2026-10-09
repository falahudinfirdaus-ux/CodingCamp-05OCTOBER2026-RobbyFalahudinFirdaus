// To-Do List Life Dashboard app logic

// =============================================================================
// SHARED UTILITIES
// =============================================================================

function storageGet(key, fallback) {
  try {
    var raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    return fallback;
  }
}

function storageSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    showError('Changes could not be saved permanently.');
    return false;
  }
}

function sanitise(str) {
  if (typeof str !== 'string') return null;
  var trimmed = str.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function showError(message) {
  var banner = document.getElementById('error-banner');
  if (!banner) return;
  var p = document.createElement('p');
  p.textContent = message;
  banner.appendChild(p);
  banner.hidden = false;
  setTimeout(function () {
    if (banner.contains(p)) banner.removeChild(p);
    if (banner.children.length === 0) banner.hidden = true;
  }, 5000);
}

// =============================================================================
// GREETING WIDGET
// =============================================================================

function getGreetingTier(hour) {
  if (hour >= 5 && hour <= 11) return 'Good Morning';
  if (hour >= 12 && hour <= 17) return 'Good Afternoon';
  if (hour >= 18 && hour <= 21) return 'Good Evening';
  return 'Good Night';
}

function formatTime(date) {
  var hh = String(date.getHours()).padStart(2, '0');
  var mm = String(date.getMinutes()).padStart(2, '0');
  return hh + ':' + mm;
}

function formatDate(date) {
  return date.toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });
}

function renderGreeting(hour) {
  var tier      = getGreetingTier(hour);
  var userName  = storageGet('userName', '');
  var el        = document.getElementById('greeting-text');
  if (!el) return;
  el.textContent = userName ? (tier + ', ' + userName) : tier;
}

function updateGreetingWidget() {
  var now = new Date();
  if (isNaN(now.getTime())) {
    var g = document.getElementById('greeting-text');
    var t = document.getElementById('time-text');
    var d = document.getElementById('date-text');
    if (g) g.textContent = 'Unable to retrieve time.';
    if (t) t.textContent = '';
    if (d) d.textContent = '';
    return;
  }
  renderGreeting(now.getHours());
  var timeEl = document.getElementById('time-text');
  var dateEl = document.getElementById('date-text');
  if (timeEl) timeEl.textContent = formatTime(now);
  if (dateEl) dateEl.textContent = formatDate(now);
}

function initGreetingWidget() {
  updateGreetingWidget();
  setInterval(updateGreetingWidget, 60000);

  var nameInput = document.getElementById('user-name-input');
  var saveBtn   = document.getElementById('save-name-btn');
  if (!nameInput || !saveBtn) return;

  nameInput.value = storageGet('userName', '');

  saveBtn.addEventListener('click', function () {
    var result = sanitise(nameInput.value);
    if (result !== null) {
      storageSet('userName', result);
    } else {
      try { localStorage.removeItem('userName'); } catch (e) {}
    }
    var now = new Date();
    if (!isNaN(now.getTime())) renderGreeting(now.getHours());
  });
}

// =============================================================================
// FOCUS TIMER
// =============================================================================

var timerState         = 'Idle';
var timerRemaining     = 0;
var timerConfigMinutes = 25;
var timerInterval      = null;

function formatTimerDisplay(totalSeconds) {
  var mins = Math.floor(totalSeconds / 60);
  var secs = totalSeconds % 60;
  return String(mins).padStart(2, '0') + ':' + String(secs).padStart(2, '0');
}

function renderTimerDisplay() {
  var el = document.getElementById('timer-display');
  if (el) el.textContent = formatTimerDisplay(timerRemaining);
}

function applyTimerControls() {
  var startBtn    = document.getElementById('timer-start');
  var stopBtn     = document.getElementById('timer-stop');
  var resetBtn    = document.getElementById('timer-reset');
  var durationRow = document.getElementById('timer-duration-row');
  var doneMsg     = document.getElementById('timer-done');
  if (!startBtn || !stopBtn || !resetBtn) return;

  var idle      = timerState === 'Idle';
  var running   = timerState === 'Running';
  var completed = timerState === 'Completed';

  startBtn.disabled = running || completed;
  stopBtn.disabled  = !running;
  resetBtn.disabled = false;
  if (durationRow) durationRow.hidden = !idle;
  if (doneMsg)     doneMsg.hidden     = !completed;
}

function startTimer() {
  if (timerState === 'Running' || timerState === 'Completed') return;
  timerState = 'Running';
  applyTimerControls();
  timerInterval = setInterval(function () {
    timerRemaining -= 1;
    renderTimerDisplay();
    if (timerRemaining <= 0) {
      timerRemaining = 0;
      clearInterval(timerInterval);
      timerInterval  = null;
      timerState     = 'Completed';
      renderTimerDisplay();
      applyTimerControls();
    }
  }, 1000);
}

function stopTimer() {
  if (timerState !== 'Running') return;
  clearInterval(timerInterval);
  timerInterval = null;
  timerState    = 'Paused';
  applyTimerControls();
}

function resetTimer() {
  clearInterval(timerInterval);
  timerInterval  = null;
  timerRemaining = timerConfigMinutes * 60;
  timerState     = 'Idle';
  renderTimerDisplay();
  applyTimerControls();
}

function handleDurationChange() {
  var input = document.getElementById('pomodoro-duration');
  if (!input) return;
  var raw   = parseInt(input.value, 10);
  if (!isNaN(raw) && raw >= 1 && raw <= 60) {
    timerConfigMinutes = raw;
    timerRemaining     = timerConfigMinutes * 60;
    storageSet('pomodoroMinutes', timerConfigMinutes);
    renderTimerDisplay();
  } else {
    input.value = timerConfigMinutes;
  }
}

function initFocusTimer() {
  var saved = storageGet('pomodoroMinutes', 25);
  timerConfigMinutes = (Number.isInteger(saved) && saved >= 1 && saved <= 60) ? saved : 25;
  timerRemaining     = timerConfigMinutes * 60;
  timerState         = 'Idle';

  var durationInput = document.getElementById('pomodoro-duration');
  if (durationInput) durationInput.value = timerConfigMinutes;

  renderTimerDisplay();
  applyTimerControls();

  var startBtn = document.getElementById('timer-start');
  var stopBtn  = document.getElementById('timer-stop');
  var resetBtn = document.getElementById('timer-reset');
  if (startBtn) startBtn.addEventListener('click', startTimer);
  if (stopBtn)  stopBtn.addEventListener('click',  stopTimer);
  if (resetBtn) resetBtn.addEventListener('click', resetTimer);

  if (durationInput) {
    durationInput.addEventListener('change', handleDurationChange);
    durationInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') handleDurationChange();
    });
  }
}

// =============================================================================
// TO-DO LIST
// =============================================================================

var tasks          = [];   // in-memory array, always in insertion order
var activeSortOrder = 'dateAdded';
var editingTaskId   = null; // ID of task currently in edit mode

// --- Pure helpers ------------------------------------------------------------

function generateId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

/**
 * Returns a sorted copy of the tasks array.
 * NEVER mutates the original array.
 */
function getSortedTasks(arr, order) {
  var copy = arr.slice();
  switch (order) {
    case 'az':
      copy.sort(function (a, b) {
        return a.description.toLowerCase().localeCompare(b.description.toLowerCase());
      });
      break;
    case 'za':
      copy.sort(function (a, b) {
        return b.description.toLowerCase().localeCompare(a.description.toLowerCase());
      });
      break;
    case 'completedLast':
      // stable sort: false (incomplete) before true (complete)
      copy.sort(function (a, b) {
        return (a.completed === b.completed) ? 0 : a.completed ? 1 : -1;
      });
      break;
    default: // 'dateAdded' — preserve insertion order (copy already correct)
      break;
  }
  return copy;
}

function persistTasks() {
  storageSet('tasks', tasks);
}

// --- Render ------------------------------------------------------------------

function renderTaskList() {
  var ul = document.getElementById('task-ul');
  if (!ul) return;

  var sorted   = getSortedTasks(tasks, activeSortOrder);
  var fragment = document.createDocumentFragment();

  sorted.forEach(function (task) {
    var li = document.createElement('li');
    li.className = 'task-item' + (task.completed ? ' task-done' : '');
    li.dataset.id = task.id;

    // Checkbox
    var cb       = document.createElement('input');
    cb.type      = 'checkbox';
    cb.checked   = task.completed;
    cb.setAttribute('aria-label', 'Mark task as ' + (task.completed ? 'incomplete' : 'complete'));
    li.appendChild(cb);

    if (editingTaskId === task.id) {
      // --- Edit mode ---
      var editInput   = document.createElement('input');
      editInput.type  = 'text';
      editInput.value = task.description;
      editInput.maxLength = 255;
      editInput.className = 'task-edit-input';
      editInput.setAttribute('aria-label', 'Edit task');
      li.appendChild(editInput);

      var confirmBtn      = document.createElement('button');
      confirmBtn.type     = 'button';
      confirmBtn.textContent = 'Save';
      confirmBtn.className   = 'task-confirm-btn';
      li.appendChild(confirmBtn);

      var cancelBtn      = document.createElement('button');
      cancelBtn.type     = 'button';
      cancelBtn.textContent = 'Cancel';
      cancelBtn.className   = 'task-cancel-btn';
      li.appendChild(cancelBtn);
    } else {
      // --- Read mode ---
      var span       = document.createElement('span');
      span.textContent = task.description;
      span.className   = 'task-description';
      li.appendChild(span);

      var editBtn      = document.createElement('button');
      editBtn.type     = 'button';
      editBtn.textContent = 'Edit';
      editBtn.className   = 'task-edit-btn';
      editBtn.setAttribute('aria-label', 'Edit: ' + task.description);
      li.appendChild(editBtn);

      var delBtn      = document.createElement('button');
      delBtn.type     = 'button';
      delBtn.textContent = 'Delete';
      delBtn.className   = 'task-delete-btn';
      delBtn.setAttribute('aria-label', 'Delete: ' + task.description);
      li.appendChild(delBtn);
    }

    fragment.appendChild(li);
  });

  ul.innerHTML = '';
  ul.appendChild(fragment);

  // Focus the edit input if we just entered edit mode
  if (editingTaskId !== null) {
    var editInput = ul.querySelector('.task-edit-input');
    if (editInput) editInput.focus();
  }
}

// --- Event delegation --------------------------------------------------------

function handleTaskListClick(e) {
  var target = e.target;
  var li     = target.closest('li[data-id]');
  if (!li) return;
  var id = li.dataset.id;

  // --- Checkbox toggle ---
  if (target.type === 'checkbox') {
    var idx = tasks.findIndex(function (t) { return t.id === id; });
    if (idx !== -1) {
      tasks[idx].completed = target.checked;
      persistTasks();
      renderTaskList();
    }
    return;
  }

  // --- Edit button ---
  if (target.classList.contains('task-edit-btn')) {
    editingTaskId = id;   // cancels any previous edit automatically
    renderTaskList();
    return;
  }

  // --- Confirm edit ---
  if (target.classList.contains('task-confirm-btn')) {
    var editInput = li.querySelector('.task-edit-input');
    if (!editInput) return;
    var newDesc = sanitise(editInput.value);
    if (newDesc === null) {
      editInput.focus();
      return; // reject empty
    }
    var idx = tasks.findIndex(function (t) { return t.id === id; });
    if (idx !== -1) {
      tasks[idx].description = newDesc;
      persistTasks();
    }
    editingTaskId = null;
    renderTaskList();
    return;
  }

  // --- Cancel edit ---
  if (target.classList.contains('task-cancel-btn')) {
    editingTaskId = null;
    renderTaskList();
    return;
  }

  // --- Delete button ---
  if (target.classList.contains('task-delete-btn')) {
    tasks = tasks.filter(function (t) { return t.id !== id; });
    if (editingTaskId === id) editingTaskId = null;
    persistTasks();
    renderTaskList();
    return;
  }
}

// Also confirm edit on Enter key inside the edit input
function handleTaskListKeydown(e) {
  if (e.key !== 'Enter') return;
  var li = e.target.closest('li[data-id]');
  if (!li) return;
  var id = li.dataset.id;
  if (e.target.classList.contains('task-edit-input')) {
    var newDesc = sanitise(e.target.value);
    if (newDesc === null) { e.target.focus(); return; }
    var idx = tasks.findIndex(function (t) { return t.id === id; });
    if (idx !== -1) {
      tasks[idx].description = newDesc;
      persistTasks();
    }
    editingTaskId = null;
    renderTaskList();
  }
}

// --- Add task ----------------------------------------------------------------

function addTask() {
  var input = document.getElementById('task-input');
  if (!input) return;

  var desc = sanitise(input.value);
  if (desc === null) {
    input.focus();
    return;
  }
  if (desc.length > 500) {
    showError('Task description cannot exceed 500 characters.');
    input.focus();
    return;
  }

  tasks.push({
    id:          generateId(),
    description: desc,
    completed:   false,
    createdAt:   Date.now()
  });
  persistTasks();
  input.value = '';
  renderTaskList();
}

// --- Init --------------------------------------------------------------------

function initTaskList() {
  // Load tasks from localStorage
  var saved = storageGet('tasks', []);
  tasks = Array.isArray(saved) ? saved.filter(function (t) {
    return t && typeof t.id === 'string' && typeof t.description === 'string' && t.description.trim().length > 0;
  }) : [];

  // Load sort order
  var savedSort = storageGet('taskSortOrder', 'dateAdded');
  var validOrders = ['dateAdded', 'az', 'za', 'completedLast'];
  activeSortOrder = validOrders.indexOf(savedSort) !== -1 ? savedSort : 'dateAdded';

  // Set sort select value
  var sortSelect = document.getElementById('task-sort');
  if (sortSelect) sortSelect.value = activeSortOrder;

  renderTaskList();

  // Wire Add button and Enter key on input
  var addBtn   = document.getElementById('task-add-btn');
  var taskInput = document.getElementById('task-input');
  if (addBtn)    addBtn.addEventListener('click', addTask);
  if (taskInput) taskInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') addTask();
  });

  // Wire sort select
  if (sortSelect) {
    sortSelect.addEventListener('change', function () {
      activeSortOrder = sortSelect.value;
      storageSet('taskSortOrder', activeSortOrder);
      renderTaskList();
    });
  }

  // Event delegation on the task list <ul>
  var ul = document.getElementById('task-ul');
  if (ul) {
    ul.addEventListener('click',   handleTaskListClick);
    ul.addEventListener('keydown', handleTaskListKeydown);
  }

  // Cross-tab sync: handled in the shared storage listener (Task 11/bootstrap)
}

// =============================================================================
// BOOTSTRAP
// =============================================================================

document.addEventListener('DOMContentLoaded', function () {
  initGreetingWidget();
  initFocusTimer();
  initTaskList();
  initQuickLinks();

  // Cross-tab sync via storage event
  window.addEventListener('storage', function (e) {
    if (e.key === 'tasks') {
      var synced = storageGet('tasks', []);
      tasks = Array.isArray(synced) ? synced : [];
      renderTaskList();
    }
    if (e.key === 'quickLinks') {
      var synced = storageGet('quickLinks', []);
      quickLinks = Array.isArray(synced) ? synced : [];
      renderQuickLinks();
    }
  });
});

// =============================================================================
// QUICK LINKS
// =============================================================================

var quickLinks = [];   // in-memory array, always in insertion order

function persistLinks() {
  storageSet('quickLinks', quickLinks);
}

function isValidUrl(url) {
  if (!url) return false;
  if (!url.startsWith('http://') && !url.startsWith('https://')) return false;
  try { new URL(url); return true; } catch (e) { return false; }
}

function renderQuickLinks() {
  var container = document.getElementById('ql-list');
  if (!container) return;

  var fragment = document.createDocumentFragment();

  quickLinks.forEach(function (link) {
    var item = document.createElement('div');
    item.className = 'ql-item';
    item.setAttribute('role', 'listitem');
    item.dataset.id = link.id;

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'ql-link-btn';
    btn.textContent = link.label;
    btn.setAttribute('aria-label', 'Open ' + link.label);
    btn.addEventListener('click', function () {
      window.open(link.url, '_blank', 'noopener,noreferrer');
    });

    var delBtn = document.createElement('button');
    delBtn.type = 'button';
    delBtn.className = 'ql-delete-btn';
    delBtn.textContent = 'Delete';
    delBtn.setAttribute('aria-label', 'Delete link: ' + link.label);
    delBtn.addEventListener('click', function () {
      quickLinks = quickLinks.filter(function (l) { return l.id !== link.id; });
      persistLinks();
      renderQuickLinks();
    });

    item.appendChild(btn);
    item.appendChild(delBtn);
    fragment.appendChild(item);
  });

  container.innerHTML = '';
  container.appendChild(fragment);
}

function addLink() {
  var labelInput = document.getElementById('ql-label-input');
  var urlInput   = document.getElementById('ql-url-input');
  if (!labelInput || !urlInput) return;

  var label = sanitise(labelInput.value);
  var url   = sanitise(urlInput.value);

  if (!label) {
    showError('Link label cannot be empty.');
    labelInput.focus();
    return;
  }
  if (!url) {
    showError('Link URL cannot be empty.');
    urlInput.focus();
    return;
  }
  if (!isValidUrl(url)) {
    showError('URL must start with http:// or https:// and be a valid address.');
    urlInput.focus();
    return;
  }

  quickLinks.push({
    id:    generateId(),
    label: label,
    url:   url
  });
  persistLinks();

  labelInput.value = '';
  urlInput.value   = '';
  renderQuickLinks();
}

function initQuickLinks() {
  var saved = storageGet('quickLinks', []);
  quickLinks = Array.isArray(saved) ? saved.filter(function (l) {
    return l && typeof l.id === 'string' &&
           typeof l.label === 'string' && l.label.trim().length > 0 &&
           typeof l.url === 'string'  && isValidUrl(l.url);
  }) : [];

  renderQuickLinks();

  var addBtn     = document.getElementById('ql-add-btn');
  var urlInput   = document.getElementById('ql-url-input');
  if (addBtn)   addBtn.addEventListener('click', addLink);
  if (urlInput) urlInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') addLink();
  });
}