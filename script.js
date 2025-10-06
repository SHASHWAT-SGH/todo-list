let buttonDarkMode = document.getElementById('color-mode-button');
let buttonModalCancel = document.getElementById('modal-cancel-button');
let buttonCreateTask = document.getElementById('create-task-button');

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    let icon = buttonDarkMode.querySelector('.icon-color-mode');
    if (document.body.classList.contains('dark-mode')) {
        icon.name = 'sunny-outline';
    } else {
        icon.name = 'moon-outline';
    }
}

buttonDarkMode.addEventListener('click', toggleDarkMode);

buttonModalCancel.addEventListener('click', () => {
    let modal = document.getElementById('modal');
    modal.style.display = 'none';
    modal.getElementsByClassName("task-form__task-title")[0].value = "";
});

window.onclick = function(event) {
    let modal = document.getElementById('modal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
    modal.getElementsByClassName("task-form__task-title")[0].value = "";
}

function openModal() {
    let modal = document.getElementById('modal');
    modal.style.display = 'flex';
    modal.getElementsByClassName("task-form__task-title")[0].focus();
}

buttonCreateTask.addEventListener('click', openModal);