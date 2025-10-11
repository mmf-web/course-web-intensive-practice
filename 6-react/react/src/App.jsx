import { useState } from "react"

export default function App() {
  const [todos, setTodos] = useState([])

  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const todo = {
      name: formData.get("todoName"),
      done: false,
    }
    setTodos([...todos, todo])
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
