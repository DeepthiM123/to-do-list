document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const priorityInput = document.getElementById('priority-input');
    const dueDateInput = document.getElementById('due-date-input');
    const categoryInput = document.getElementById('category-input');
    const taskList = document.getElementById('task-list');
    const errorMessage = document.getElementById('error-message');

    // Load tasks from local storage
    loadTasks();

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const taskText = taskInput.value.trim();
        const taskPriority = priorityInput.value;
        const dueDate = dueDateInput.value;
        const taskCategory = categoryInput.value;

        if (taskText && taskPriority && dueDate && taskCategory) {
            addTaskToList(taskText, taskPriority, dueDate, taskCategory);
            taskInput.value = '';
            priorityInput.value = 'low';
            dueDateInput.value = '';
            categoryInput.value = 'work';
            errorMessage.style.display = 'none'; // Hide error message if task is added successfully
        } else {
            errorMessage.textContent = 'Please fill in all fields'; // Display error message
            errorMessage.style.display = 'block';
        }
    });

    function addTaskToList(taskText, taskPriority, dueDate, taskCategory, completed = false) {
        const li = document.createElement('li');
        const taskSpan = document.createElement('span');
        taskSpan.textContent = taskText;

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = completed;
        checkbox.addEventListener('change', () => {
            li.classList.toggle('completed');
            saveTasks();
        });

        const taskDetailsDiv = document.createElement('div');
        taskDetailsDiv.className = 'task-details';
        taskDetailsDiv.appendChild(checkbox);
        taskDetailsDiv.appendChild(taskSpan);

        const prioritySpan = document.createElement('span');
        prioritySpan.className = 'task-priority';
        prioritySpan.textContent = formatPriority(taskPriority);
        taskDetailsDiv.appendChild(prioritySpan);

        const dueDateSpan = document.createElement('span');
        dueDateSpan.className = 'task-due-date';
        dueDateSpan.textContent = dueDate;
        taskDetailsDiv.appendChild(dueDateSpan);

        const categorySpan = document.createElement('span');
        categorySpan.className = 'task-category';
        categorySpan.textContent = taskCategory.charAt(0).toUpperCase() + taskCategory.slice(1);
        taskDetailsDiv.appendChild(categorySpan);

        const buttonsDiv = document.createElement('div');
        buttonsDiv.classList.add('buttons');

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.classList.add('edit');
        editButton.addEventListener('click', () => {
            const newTaskText = prompt('Edit task:', taskSpan.textContent);
            if (newTaskText !== null && newTaskText.trim() !== '') {
                taskSpan.textContent = newTaskText.trim();
                saveTasks();
            }
        });
        buttonsDiv.appendChild(editButton);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => {
            taskList.removeChild(li);
            saveTasks();
        });
        buttonsDiv.appendChild(deleteButton);

        li.appendChild(taskDetailsDiv);
        li.appendChild(buttonsDiv);

        if (completed) {
            li.classList.add('completed');
        }

        taskList.appendChild(li);
        saveTasks();
    }

    function formatPriority(priority) {
        if (typeof priority === 'string' && priority.length > 0) {
            return priority.charAt(0).toUpperCase() + priority.slice(1);
        }
        return '';
    }

    function saveTasks() {
        const tasks = [];
        document.querySelectorAll('li').forEach((li) => {
            const taskSpan = li.querySelector('span');
            const prioritySpan = li.querySelector('.task-priority');
            const dueDateSpan = li.querySelector('.task-due-date');
            const categorySpan = li.querySelector('.task-category');
            const completed = li.classList.contains('completed');

            const taskText = taskSpan.textContent.trim();
            const taskPriority = prioritySpan ? prioritySpan.textContent.toLowerCase() : '';
            const dueDate = dueDateSpan ? dueDateSpan.textContent : '';
            const taskCategory = categorySpan ? categorySpan.textContent.toLowerCase() : '';

            tasks.push({
                taskText,
                taskPriority,
                dueDate,
                taskCategory,
                completed
            });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks'));
        if (tasks) {
            tasks.forEach(({ taskText, taskPriority, dueDate, taskCategory, completed }) => {
                addTaskToList(taskText, taskPriority, dueDate, taskCategory, completed);
            });
        }
    }
});
