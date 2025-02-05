// Select DOM elements
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');

// Add event listener for input field to add tasks when "Enter" is pressed
todoInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter' && todoInput.value.trim() !== '') {
        const priority = document.getElementById('priority-select').value; // Get selected priority
        addTask(todoInput.value, '20px', '20px', priority); // Pass the selected priority
        todoInput.value = ''; // Clear input field
    }
});

// Function to apply priority styles (red, yellow, green outlines)
function applyPriorityStyle(taskElement, priority) {
    switch (priority) {
        case 'high':
            taskElement.style.border = '2px solid #ED8796'; // Rosewater (Red)
            break;
        case 'medium':
            taskElement.style.border = '2px solid #EED49F'; // Vanilla (Yellow)
            break;
        case 'low':
        default:
            taskElement.style.border = '2px solid #A6DA95'; // Green Tea (Green)
            break;
    }
}

// Function to save tasks to local storage (text + position + priority)
function saveTasksToLocalStorage() {
    const tasks = [];
    document.querySelectorAll('.todo-item').forEach((li) => {
        tasks.push({
            text: li.textContent.replace('X', '').trim(), // Save task text
            left: li.style.left, // Save left position
            top: li.style.top,   // Save top position
            priority: li.dataset.priority // Save priority from dataset
        });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks)); // Save tasks as a JSON string
}

// Function to load tasks from local storage when the page loads
function loadTasksFromLocalStorage() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || []; // Get saved tasks or empty array
    tasks.forEach((task) => addTask(task.text, task.left, task.top, task.priority)); // Add each saved task
}

// Call this function when the page loads
window.onload = loadTasksFromLocalStorage;

// Function to add a new task (with optional position parameters and priority)
function addTask(taskText, left = '20px', top = '20px', priority = 'low') {
    const li = document.createElement('li');
    li.classList.add('todo-item');
    li.textContent = taskText;
    li.draggable = false;
    li.style.position = 'absolute';
    li.style.left = left;
    li.style.top = top;

    // Store priority in a data attribute
    li.dataset.priority = priority;

    // Apply the style based on priority
    applyPriorityStyle(li, priority);

    // Create delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete-btn');
    deleteBtn.textContent = 'X';
    deleteBtn.onclick = () => {
        li.remove();
        saveTasksToLocalStorage(); // Save updated tasks after deletion
    };

    li.appendChild(deleteBtn);
    todoList.appendChild(li);

    li.addEventListener('mousedown', handleMouseDown);
    saveTasksToLocalStorage(); // Save tasks after adding a new one
}

// Function to handle dragging tasks around
function handleMouseDown(event) {
    // Ignore drag if the delete button was clicked
    if (event.target.classList.contains('delete-btn')) return;

    const task = event.currentTarget;
    let shiftX = event.clientX - task.getBoundingClientRect().left;
    let shiftY = event.clientY - task.getBoundingClientRect().top;

    // Function to move the task element with the mouse
    function moveAt(pageX, pageY) {
        task.style.left = pageX - shiftX + 'px';
        task.style.top = pageY - shiftY + 'px';
    }

    moveAt(event.pageX, event.pageY); // Initial move when mouse is pressed

    // Attach mousemove event to drag the task
    function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);
    }

    document.addEventListener('mousemove', onMouseMove);

    // Remove the mousemove listener when the mouse is released
    document.addEventListener('mouseup', function onMouseUp() {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        saveTasksToLocalStorage(); // Save new position after dragging ends
    });
}