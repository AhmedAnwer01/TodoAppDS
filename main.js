// DOM Elements
const taskInput = document.getElementById('taskInput');
const dueDate = document.getElementById('dueDate');
const priority = document.getElementById('priority');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const filterPriority = document.getElementById('filterPriority');
const sortDueDate = document.getElementById('sortDueDate');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Render Tasks
function renderTasks() {
    taskList.innerHTML = '';
    const filteredTasks = filterTasks();
    const sortedTasks = sortTasks(filteredTasks);
    sortedTasks.forEach((task, index) => {
        const taskItem = document.createElement('li');
        taskItem.classList.add('task-item');
        if (task.completed) taskItem.classList.add('completed');

        taskItem.innerHTML = `
        <div class="task-content">
        <span>${task.text}</span>
        <div class="due-date">Due: ${task.dueDate}</div>
        <div class="priority ${task.priority}">${task.priority}</div>
        </div>
        <div class="actions">
        <button onclick="editTask(${index})">Edit</button>
        <button onclick="deleteTask(${index})">Delete</button>
        </div>
    `;

        taskItem.querySelector('span').addEventListener('click', () => {
            toggleComplete(index);
        });

        taskList.appendChild(taskItem);
    });
}

// Add Task
function addTask() {
    const taskText = taskInput.value.trim();
    const taskDueDate = dueDate.value;
    const taskPriority = priority.value;
    if (taskText === '') return;

    tasks.push({
        text: taskText,
        dueDate: taskDueDate,
        priority: taskPriority,
        completed: false,
    });

    saveTasks();
    renderTasks();
    taskInput.value = '';
    dueDate.value = '';
    priority.value = 'low';
}

// Edit Task
function editTask(index) {
    const newText = prompt('Edit your task:', tasks[index].text);
    if (newText !== null) {
        tasks[index].text = newText.trim();
        saveTasks();
        renderTasks();
    }
}

// Delete Task
function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
}

// Toggle Complete
function toggleComplete(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
}

// Filter Tasks
function filterTasks() {
    const selectedPriority = filterPriority.value;
    if (selectedPriority === 'all') return tasks;
    return tasks.filter(task => task.priority === selectedPriority);
}

// Sort Tasks
function sortTasks(filteredTasks) {
    const selectedSort = sortDueDate.value;
    return filteredTasks.sort((a, b) => {
        const dateA = new Date(a.dueDate);
        const dateB = new Date(b.dueDate);
        return selectedSort === 'asc' ? dateA - dateB : dateB - dateA;
    });
}

// Save Tasks to Local Storage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Theme Switcher
function setTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
}

// Load Saved Theme
const savedTheme = localStorage.getItem('theme') || 'light';
setTheme(savedTheme);

// Event Listeners
addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});
filterPriority.addEventListener('change', renderTasks);
sortDueDate.addEventListener('change', renderTasks);

// Initial Render
renderTasks();



