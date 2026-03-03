export const fetchTasks = async () => {
  const response = await fetch("http://localhost:3000/tasks")

  if (!response.ok) {
    throw new Error("Failed to fetch tasks")
  }

  return response.json()
}

export const addTask = async (title: string) => {
  const response = await fetch("http://localhost:3000/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ title })
  })

  if (!response.ok) {
    throw new Error("Failed to add task")
  }

  return response.json()
}




export const deleteTask = async (id: number) => {
  const response = await fetch(`http://localhost:3000/tasks/${id}`, {
    method: "DELETE"
  })

  if (!response.ok) {
    throw new Error("Failed to delete task")
  }

  return response.json()
}




interface UpdateTaskPayload {
  id: number
  completed: boolean
}

export const updateTask = async ({ id, completed }: UpdateTaskPayload) => {
  const response = await fetch(`http://localhost:3000/tasks/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ completed })
  })

  if (!response.ok) {
    throw new Error("Failed to update task")
  }

  return response.json()
}





//Yaha response.ok  me "ok" hum backend se nahi bhej rahe hai , yeh fetch ka in-built feature hai , which gives us
//functionality to check fetch failed or success means response came or not