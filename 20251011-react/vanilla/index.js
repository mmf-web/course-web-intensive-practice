const todoFormEl = document.querySelector("#todo-form")
const rootEl = document.getElementById("root")

class Api {
  static #baseUrl = "http://localhost:3000"

  static async getTodos() {
    const response = await fetch(`${Api.#baseUrl}/todos`)
    return await response.json()
  }

  static async createTodo(todo) {
    const response = await fetch(`${Api.#baseUrl}/todos`, {
      method: "POST",
      body: JSON.stringify(todo),
    })
    return await response.json()
  }
}

let todos = []

// Начальная загрузка данных
Api.getTodos().then((allTodos) => {
  todos = allTodos
  renderTodos()
})

const handleSubmit = async (e) => {
  e.preventDefault()
  const formData = new FormData(e.target)
  const todo = {
    name: formData.get("todoName"),
    done: false,
  }

  const newTodo = await Api.createTodo(todo)
  todos.push(newTodo)
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
