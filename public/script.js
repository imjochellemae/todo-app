const taskList = document.getElementById('taskList');

// Fetch and display tasks
function fetchTasks() {
    fetch('http://localhost:3000/tasks')
        .then(response => response.json())
        .then(tasks => {
            taskList.innerHTML = '';
            tasks.forEach(task => {
                const formattedDueDate = new Date(task.due_date).toISOString().slice(0, 10);
                
                const li = document.createElement('li');
                li.innerHTML = `
                    <span>${task.task} (Due: ${formattedDueDate})</span>
                    <div class="button-container">
                        <button onclick="editTask(${task.id}, '${task.task}', '${formattedDueDate}')">Edit</button>
                        <button onclick="deleteTask(${task.id})">Delete</button>
                    </div>
                `;
                taskList.appendChild(li);
            });
        });
}

// Add a new task
function addTask() {
    const taskInput = document.getElementById('task');
    const dueDateInput = document.getElementById('due_date');
    const task = taskInput.value;
    const due_date = dueDateInput.value;

    if (task) {
        fetch('http://localhost:3000/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ task, due_date })
        })
        .then(response => response.json())
        .then(() => {
            taskInput.value = '';
            dueDateInput.value = '';
            fetchTasks();
        });
    }
}

// Edit a task
function editTask(id, currentTask, currentDueDate) {
    const newTask = prompt("Edit task:", currentTask);
    const newDueDate = prompt("Edit due date (YYYY-MM-DD):", currentDueDate);

    if (newTask) {
        fetch(`http://localhost:3000/tasks/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ task: newTask, due_date: newDueDate })
        })
        .then(() => fetchTasks());
    }
}

// Delete a task
function deleteTask(id) {
    fetch(`http://localhost:3000/tasks/${id}`, {
        method: 'DELETE'
    })
    .then(() => fetchTasks());
}

// Initial fetch of tasks
fetchTasks();