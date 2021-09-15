const resource = 'http://localhost:3000'
const todosSection = document.getElementById('todos')
const formAddTask = document.getElementById('addTask')
let todos = []

function deleteTask(id) {
    return fetch(`${resource}/todos/${id}`, {
        method: 'DELETE'
    })
        .then(res => res.json())
}

function addTask(task) {
    return fetch(`${resource}/todos`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(task)
    })
        .then(res => res.json())
}

function changeTask(task) {
    return fetch(`${resource}/todos/${task.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(task)
    })
        .then(res => res.json())
}

function draw(whereDraw) {
    let todosContainer = ''
    todos.forEach(todo => {
        todosContainer += this.templateTodo(todo)
    })
    whereDraw.innerHTML = todosContainer
}
function templateTodo(data) {
    return `<li class="todo-list" data-id="${data.id}" data-completed="${+data.completed}" data-title="${data.title}">
                <div class="list-item-view">
                    <div class="item">                        
                        <label ${data.completed && 'class="completed"'}>
                            <input type="checkbox" class="checkbox-completed-task" ${data.completed && 'checked'}>${data.title}
                        </label>
                    </div>
                    <button class="btn btn-danger delete-task">Delete</button>
                </div>
            </li>`
}

fetch(`${resource}/todos`)
    .then(res => res.json())
    .then((res) => {
        todos = res
        draw(todosSection)
        eventDeleteTask()
        eventMarkedTask()
    })


function eventDeleteTask() {
    const delBtns = document.querySelectorAll('button.delete-task')
    delBtns.forEach(button => {
        button.addEventListener('click',  (event) => handlerDeleteTask(event))
    })
}

function eventMarkedTask() {
    const markedCheckboxes = document.querySelectorAll('input.checkbox-completed-task')
    markedCheckboxes.forEach(el => {
        el.addEventListener('click',  (event) => handlerMarkedTask(event))
    })
}

function handlerDeleteTask(event) {
    const parentEl = event.target.closest('.todo-list')
    const id = parentEl.getAttribute('data-id')
    deleteTask(id)
        .then(() => {
            parentEl.remove()
        })
}

function handlerMarkedTask(event) {
    const parentEl = event.target.closest('.todo-list')
    const id = parentEl.getAttribute('data-id')
    const status = parentEl.getAttribute('data-completed')
    const title = parentEl.getAttribute('data-title')
    let newStatus = !Boolean(+status)
    changeTask({
        completed: newStatus,
        id,
        title
    })
        .then(() => {
            parentEl.setAttribute('data-completed', newStatus ? '1' : '0')
            const label = event.target.closest('label')
            if (newStatus) {
                label.className = 'completed'
            } else {
                label.className = ''
            }
        })
}


formAddTask.addEventListener('submit', (event) => handlerAddTask(event))

function handlerAddTask(event) {
    event.preventDefault()
    addTask({
        title: event.target[0].value,
        completed: false
    })
        .then(res => {
            const el = templateTodo(res)
            todosSection.innerHTML += el
            event.target[0].value = ''
            eventDeleteTask()
            eventMarkedTask()
        })
}

