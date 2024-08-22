document.getElementById('addTaskBtn').addEventListener('click', addTask);

// Load tasks from the database on page load
fetch('/tasks')
    .then(response => response.json())
    .then(tasks => {
        tasks.forEach(task => {
            addTaskToList(task.text, task._id);
        });
    })
    .catch(err => console.error('Error loading tasks:', err));

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value.trim();

    if (taskText === '') {
        alert('Please enter a task!');
        return;
    }

    // Send the new task to the server
    fetch('/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: taskText })
    })
    .then(response => response.json())
    .then(newTask => {
        addTaskToList(newTask.text, newTask._id);
        taskInput.value = ''; // Clear input field
    })
    .catch(err => console.error('Error adding task:', err));
}

function addTaskToList(taskText, taskId) {
    const li = document.createElement('li');
    li.textContent = taskText;

    // Create a complete button
    const completeBtn = document.createElement('button');
    completeBtn.textContent = '✔️';
    completeBtn.addEventListener('click', () => {
        li.classList.toggle('completed');
    });

    // Create a delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '❌';
    deleteBtn.addEventListener('click', () => {
        deleteTask(taskId, li);
    });

    li.appendChild(completeBtn);
    li.appendChild(deleteBtn);
    document.getElementById('taskList').appendChild(li);
}

function deleteTask(taskId, li) {
    fetch(`/tasks/${taskId}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(() => {
        li.remove(); // Remove the task from the list
    })
    .catch(err => console.error('Error deleting task:', err));
}