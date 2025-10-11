import { useEffect, useState } from "react"

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

export default function App() {
  const [todos, setTodos] = useState([])

  // Начальная загрузка данных
  useEffect(() => {
    Api.getTodos().then((todos) => setTodos(todos))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const todo = {
      name: formData.get("todoName"),
      done: false,
    }
    const newTodo = await Api.createTodo(todo)
    setTodos([...todos, newTodo])
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" name="todoName" />
        <button type="submit">Создать</button>
      </form>
      <div>
        {todos.map((todo) => (
          <div>
            {todo.done ? "✅" : "🌶"} {todo.name}
          </div>
        ))}
      </div>
    </div>
  )
}
