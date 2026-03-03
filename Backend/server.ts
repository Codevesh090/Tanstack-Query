import express from "express"
import type { Request, Response } from "express"
import cors from "cors"

const app = express()

app.use(cors())
app.use(express.json())

// Task type
type Task = {
  id: number
  title: string
  completed: boolean
}

// In-memory database
let tasks: Task[] = [
  { id: 1, title: "Learn TanStack Query", completed: false },
  { id: 2, title: "Build Smart Task App", completed: false },
  { id: 3, title: "Understand caching", completed: false }
]

// GET all tasks
app.get("/tasks", (req: Request, res: Response) => {
  res.json(tasks)
})

// CREATE task
app.post("/tasks", (req: Request, res: Response) => {
  const newTask: Task = {
    id: Date.now(),
    title: req.body.title,
    completed: false
  }

  tasks.push(newTask)

  res.json(newTask)
})

// UPDATE task
app.patch("/tasks/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id)

  tasks = tasks.map(task =>
    task.id === id ? { ...task, ...req.body } : task
  )

  res.json({ message: "Task updated" })
})

// DELETE task
app.delete("/tasks/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id)

  tasks = tasks.filter(task => task.id !== id)

  res.json({ message: "Task deleted" })
})

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000")
})