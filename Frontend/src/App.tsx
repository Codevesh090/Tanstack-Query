import { useQuery } from "@tanstack/react-query"
import { fetchTasks } from "./api/tasks"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { addTask } from "./api/tasks"
import { useState } from "react"
import { deleteTask } from "./api/tasks"
import { updateTask } from "./api/tasks"


interface Task {
  id: number
  title: string
  completed: boolean
}


function App() {


  const updateMutation = useMutation({
  mutationFn: updateTask,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["tasks"] })
  }
  })

  const deleteMutation = useMutation({
  mutationFn: deleteTask,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["tasks"] })
  }
  })

  const queryClient = useQueryClient()
  const [taskTitle, setTaskTitle] = useState("")
  

  const mutation = useMutation({
  mutationFn: addTask,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["tasks"] })
  }
  })

  const handleAddTask = () => {
  mutation.mutate(taskTitle)
  setTaskTitle("")
  }

  const { data, isLoading, error } = useQuery({
    queryKey: ["tasks"],
    queryFn: fetchTasks
  })

  if (isLoading) {
    return <h1>Loading tasks...</h1>
  }

  if (error instanceof Error) {
    return <h1>Error: {error.message}</h1>
  }

  return (
    <div>
      <h1>Smart Task App</h1>
      
       <input
       value={taskTitle}
       onChange={(e) => setTaskTitle(e.target.value)}
       placeholder="Enter new task"
       />

      <button onClick={handleAddTask}>
        Add Task
      </button>
      {data?.map((task: Task) => (
         <div key={task.id} style={{ marginTop: "10px" }}>
    
          <span
             style={{
             textDecoration: task.completed ? "line-through" : "none",
             marginRight: "10px"
                   }}
          >
             {task.title}
         </span>

         <button
            onClick={() =>
            updateMutation.mutate({
            id: task.id,
            completed: !task.completed
             })
             }
         >
         Done
         </button>

         <button
         onClick={() => deleteMutation.mutate(task.id)}
         style={{ marginLeft: "10px" }}
         >
         Delete
         </button>

         </div>
      ))}

    </div>
  )
}

export default App

//Here we handled three states .
{/*
  
React Component Mount
        ↓
useQuery runs
        ↓
fetchTasks() executes
        ↓
GET /tasks
        ↓
data stored in TanStack cache
        ↓
UI renders tasks
   
*/}