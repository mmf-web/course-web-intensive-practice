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

  static async updateTodo(id, updates) {
    const response = await fetch(`${Api.#baseUrl}/todos/${id}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    })
    return await response.json()
  }
}

// Жизненный цикл в классовых компонентах (старый подход)
// class App extends React.Component {
//   constructor() {}
//   componentWillMount() {} (не используем в функциональных)

//   Основные методы
//   componentDidMount() {}
//   componentDidUpdate() {}
//   componentWillUnmount() {}
//   render() {}
// }

export default function App() {
  const [todos, setTodos] = useState([])

  // componentDidMount
  useEffect(() => {
    console.log("Enter useEffect")
    Api.getTodos().then(setTodos)
  }, [])

  // componentDidMount, componentDidUpdate
  // useEffect(() => {
  //   console.log("Enter useEffect with todos")
  // }, [todos])

  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const todo = {
      name: formData.get("todoName"),
      done: false,
    }
    Api.createTodo(todo).then((todo) => setTodos([...todos, todo]))
  }

  const handleDoneUpdate = (e, id) => {
    const updatedDone = e.target.checked
    Api.updateTodo(id, { done: updatedDone }).then((updatedTodo) => {
      setTodos(todos.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo)))
    })
  }

  return (
    <div>
      <h1>React TODO list</h1>
      <form onSubmit={handleSubmit}>
        <input className="border-2 border-gray-300 rounded-md p-2" type="text" name="todoName" />
        <button type="submit">Создать</button>
      </form>
      <div>
        {todos
          // .sort((a, b) => a.done - b.done) // ! WARN: .sort() sorts in-place !
          .toSorted((a, b) => a.done - b.done)
          .map((todo) => (
            <Todo key={todo.id} id={todo.id} name={todo.name} done={todo.done} onChangeDone={handleDoneUpdate} />
          ))}
      </div>
    </div>
  )
}

function Todo({ id, done, name, onChangeDone }) {
  return (
    <div>
      <input type="checkbox" checked={done} onChange={(e) => onChangeDone(e, id)} />
      {name}
    </div>
  )
}
