import { useState } from 'react'
import { useEffect} from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"



export default function App() {
  const [tasks, setTasks] = useState([])
  const [input, setInput] = useState("")
  const [error, setError] = useState(false)
  const [called, setCalled] = useState(false)
  const [completed, setCompleted] = useState([])
  const [editIndex, setEditIndex] = useState(null)
  const [rename, setRename] = useState("")

  useEffect(() => {
    fetch('http://localhost:5000/todos')
        .then(res => res.json())
        .then(data => setTasks(data))
  }, [])

  return (
    <div className="min-h-screen bg-gray-700 flex items-center justify-center">
      <Card className="p-8 w-full max-w-2xl bg-gray-800 text-white">

        <h1 style={{ textAlign: "center" }}>Todo App</h1>
      
        <div style={{ display: "flex", gap: 8 }}>
          <Input 
            type="text"  
            placeholder="enter your task" 
            value={input} 
            onChange={(e) => setInput(e.target.value)}
          />
          <Button onClick={() => AddTask(input)}>
            Add
          </Button>
        </div>

        {called && (error ? (
          <p>please enter a task</p>
        ) : (
          <p>task added successfully</p>
        ))}

        <br/>
        <br/>
        <h2>My List Of Tasks</h2>
        <br/>
        
        <div style={{ display: "flex", gap: 30, textAlign: "left", display: "inline-flex" }}>
          <div style={{ minWidth: 200, border: "1px solid gray", padding: 10, borderRadius: 8 }}>
            <h3 style={{ textDecoration: "underline" }}>pending tasks</h3>
            <ul>
              {tasks.map((task, index) => (
                <li key={index} style={{ maxWidth: 200, wordWrap: "break-word" }}>
                  {task.title} 
                  {editIndex === index ? (
                    <>
                      <Input 
                        type="text"
                        value={rename}
                        onChange={(e) => setRename(e.target.value)}
                      />
                      <Button onClick={() => ConfirmRename()}>confirm</Button>
                    </>
                  ) : (
                    <>
                      <Button style={{ marginLeft: 8 }} onClick={() => StartRename(index)}>rename</Button>
                    </>
                  )}
                  <Button style={{ marginLeft: 8 }} onClick={() => DeleteTask(index)}>done</Button>
                </li>
              ))}
            </ul>
          </div>
          <div style={{ border: "1px solid gray", padding: 10, borderRadius: 8 }}>
            <h3 style={{ textDecoration: "underline" }}>completed tasks</h3>
            <ul>
              {completed.map((completed, index) => (<li key={index}>{completed.title}</li>))}
            </ul>
          </div>
        </div>

      </Card>
    </div>
  )

  function AddTask(input) {
    setCalled(true)
    if (input.trim() === "") {
      setError(true)
      return
    }
    setError(false)
    fetch('http://localhost:5000/todos', {method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: input })})
      .then(res => res.json())
      .then(newTodo => setTasks((now) => [...now, newTodo]))
    setInput("")
  }

  function DeleteTask(index) {
    const id = tasks[index].id
    fetch(`http://localhost:5000/todos/${id}`, { method: 'DELETE' })
        .then(res => res.json())
        .then(() => setTasks((now) => now.filter((task) => task.id !== id)))
    setCompleted((now) => [...now, tasks[index]])
  }

  function ConfirmRename() {
    const id = tasks[editIndex].id
    fetch(`http://localhost:5000/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: rename })
    })
    .then(res => res.json())
    .then(updatedTodo => setTasks((now) => now.map((task) => task.id === updatedTodo.id ? updatedTodo : task)))
    setEditIndex(null)
  }

  function StartRename(index) {
    setEditIndex(index)
  }
}