import { useState } from 'react'
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
                  {task} 
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
              {completed.map((completed, index) => (<li key={index}>{completed}</li>))}
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
      return;
    } else {
      setError(false)
      setTasks((now) => [...now, input])
      console.log(tasks)
      setInput("")
      return(
        console.log(input)
      );
    }
  }

  function DeleteTask(index) {
    setCompleted((now) => [...now, tasks[index]])
    setTasks((now) => now.filter((_, i) => i !== index))
  }

  function StartRename(index) {
    setEditIndex(index)
  }

  function ConfirmRename() {
    setTasks((now) => now.map((task, i) => i === editIndex ? rename : task))
    setEditIndex(null)
  }
}