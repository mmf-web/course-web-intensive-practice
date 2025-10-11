const todoFormEl = document.querySelector("#todo-form")
const rootEl = document.getElementById("root")

const todos = []

const handleSubmit = (e) => {
  e.preventDefault()
  const formData = new FormData(e.target)
  const todo = {
    name: formData.get("todoName"),
    done: false,
  }
  todos.push(todo)

  renderTodos()
}

const renderTodos = () => {
  rootEl.innerHTML = ""

  for (const todo of todos) {
    const div = document.createElement("div")
    div.innerText = `${todo.done ? "✅" : "🌶"} ${todo.name}`
    rootEl.appendChild(div)
  }
}

todoFormEl.addEventListener("submit", handleSubmit)
