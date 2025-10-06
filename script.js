document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const buttonDarkMode = document.getElementById('color-mode-button');
    const iconDarkMode = buttonDarkMode.querySelector('.icon-color-mode');
    const modal = document.getElementById('modal');
    const taskForm = document.getElementById('task-form');
    const taskTitleInput = document.getElementById('task-title-input');
    const modalCancelButton = document.getElementById('modal-cancel-button');
    const createButton = document.getElementById('create-task-button');
    const taskListUl = document.querySelector('.task-container ul');
    const emptyImage = document.querySelector('.empty-list-img');
    const modalTitle = document.getElementById('modal-title');
    const modalSubmitButton = document.getElementById('modal-submit-button');
    const editTaskIdInput = document.getElementById('edit-task-id');
    
    function getTasks() {
        return JSON.parse(localStorage.getItem('tasks')) || [];
    }

    function saveTasks(tasks) {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function renderTasks(tasksToRender = getTasks()) {
        taskListUl.innerHTML = ''; 

        if (tasksToRender.length === 0) {
            emptyImage.style.display = 'block';
            taskListUl.style.display = 'none';
            return;
        }

        emptyImage.style.display = 'none';
        taskListUl.style.display = 'flex';

        tasksToRender.forEach(task => {
            const li = document.createElement('li');
            li.setAttribute('data-id', task.id);
            li.innerHTML = `
                <div class="task-item">
                    <span>
                        <input type="checkbox" class="task-item__checkbox" id="task-${task.id}" ${task.completed ? 'checked' : ''}>  
                        <label for="task-${task.id}" class="task-item__title">${task.title}</label>
                    </span>
                    <span class="task-item__buttons-container">
                        <button class="button-task-panel edit-task-button" title="Edit Task">
                            <ion-icon name="pencil-outline"></ion-icon>
                        </button>
                        <button class="button-task-panel delete-task-button" title="Delete Task">
                            <ion-icon name="trash-outline"></ion-icon>
                        </button>
                    </span>
                </div>
            `;
            taskListUl.appendChild(li);
        });
    }

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const title = taskTitleInput.value.trim();
        const taskId = editTaskIdInput.value;
        let tasks = getTasks();

        if (!title) return;

        if (taskId) {
            const taskIndex = tasks.findIndex(t => t.id === parseInt(taskId));
            if (taskIndex !== -1) {
                tasks[taskIndex].title = title;
            }
        } else {
            const newTask = {
                id: Date.now(),
                title: title,
                completed: false
            };
            tasks.push(newTask);
        }

        saveTasks(tasks);
        closeModal();
        renderTasks();
    });

    taskListUl.addEventListener('click', (e) => {
        const deleteButton = e.target.closest('.delete-task-button');
        if (deleteButton) {
            const li = deleteButton.closest('li');
            const id = parseInt(li.getAttribute('data-id'));
            
            if (window.confirm("Are you sure you want to delete this task?")) {
                let tasks = getTasks();
                tasks = tasks.filter(task => task.id !== id);
                saveTasks(tasks);
                renderTasks();
            }
        }

        const checkbox = e.target.closest('.task-item__checkbox');
        if (checkbox) {
            const li = checkbox.closest('li');
            const id = parseInt(li.getAttribute('data-id'));
            const isCompleted = checkbox.checked;

            let tasks = getTasks();
            const task = tasks.find(t => t.id === id);
            if (task) {
                task.completed = isCompleted;
                saveTasks(tasks);
            }
        }

        const editButton = e.target.closest('.edit-task-button');
        if (editButton) {
            const li = editButton.closest('li');
            const id = parseInt(li.getAttribute('data-id'));
            const tasks = getTasks();
            const task = tasks.find(t => t.id === id);
            
            if (task) {
                openModal('Edit Task', 'Save Changes', task.title, id);
            }
        }
    });


    function openModal(title = 'Add New Task', submitText = 'Add Task', taskTitle = '', taskId = '') {
        modalTitle.textContent = title;
        modalSubmitButton.textContent = submitText;
        taskTitleInput.value = taskTitle;
        editTaskIdInput.value = taskId;
        modal.style.display = 'flex';
        taskTitleInput.focus();
    }

    function closeModal() {
        modal.style.display = 'none';
        taskForm.reset();
        editTaskIdInput.value = '';
        modalTitle.textContent = 'Add New Task'; 
        modalSubmitButton.textContent = 'Add Task';
    }

    createButton.addEventListener('click', () => openModal());
    modalCancelButton.addEventListener('click', closeModal);

    window.onclick = function(event) {
        if (event.target === modal) {
            closeModal();
        }
    }
    
    function filterTasks(tasks, searchTerm = '', filterValue = 'all') {
        return tasks.filter(task => {
            const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
            
            let matchesFilter = true;
            if (filterValue === 'completed') {
                matchesFilter = task.completed;
            } else if (filterValue === 'pending') {
                matchesFilter = !task.completed;
            }
            
            return matchesSearch && matchesFilter;
        });
    }

    const searchInput = document.getElementById('search-input');
    const searchFilter = document.getElementById('search-filter');
    
    const handleFilterAndSearch = () => {
        const tasks = getTasks();
        const searchTerm = searchInput.value.trim();
        const filterValue = searchFilter.value;
        const filtered = filterTasks(tasks, searchTerm, filterValue);
        renderTasks(filtered);
    };

    searchInput.addEventListener('input', handleFilterAndSearch);
    searchFilter.addEventListener('change', handleFilterAndSearch);


    function toggleDarkMode(isManualToggle = false) {
        body.classList.toggle('dark-mode');
        const isDark = body.classList.contains('dark-mode');

        iconDarkMode.name = isDark ? 'sunny-outline' : 'moon-outline';

        if (isManualToggle) {
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        }
    }

    function loadTheme() {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme === 'dark' || (savedTheme === null && prefersDark)) {
            body.classList.add('dark-mode'); 
            iconDarkMode.name = 'sunny-outline';
        } else {
            body.classList.remove('dark-mode');
            iconDarkMode.name = 'moon-outline';
        }
    }

    buttonDarkMode.addEventListener('click', () => toggleDarkMode(true));

    loadTheme();
    renderTasks();
});