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






{/* 
  IMPORTANT POINT :

  The response object that we get after fetch happens , does not only contain the response , it contain this object that is made by the browser .
  {
  status: 200,
  ok: true,
  headers: Headers,
  body: ReadableStream,
  bodyUsed: false,
  url: "http://localhost:3000/tasks",
  json: function,
  text: function,
  blob: function,
  arrayBuffer: function
  }

Question ?
So, How do we get the response by just doing | const data = await response.json() |

Toh pura flow samajhte hai:
Firstly, when we make request from our frontend by providing body,content-type etc...
Toh request server par jaati hai , server us request ko process karta hai and response bhejta hai
Ab jo yeh server se HTTP response aaya hai , browser us response ko leta hai jo server se aaya tha + bowser khud se kuch functionalities leta hai and undono ko combine karta hi and creates a object and saves it in the response.
Now , is object me hamara data jo server ne bheja tha wo "body" key me store hota hai but in "ReadableStream" Form.
Now if our data is in body then why we do this | const data = await response.json() | , why we use .json()
Toh its because kyuki jab hum karte hai | const data = await response.json() | toh kya hota hai ki .
Toh internaaly this json key is written like this inside { means json key has a function } 
async function json() {
  const stream = this.body
  const text = await readStream(stream)
  return JSON.parse(text)
}
Which me it contains three steps(Isiliye we use await as this three process takes how much time we don't know , So it works by returning promise THAT'S WHY WE USE await ) , jo ReadableStream format ko convert karta hai JS-Object me .

1st-Step :
WHAT IS READABLE STREAM ? -> A ReadableStream is a way for the browser to receive data piece-by-piece (chunks) instead of all at once.
ReadableStream(SMALL PIECES) -> Raw text conversion by browser .
This [  {  "  i  d  "  :  1  ,  "  t  i  t  l  e  " ... ] -> to this -> "[{ \"id\":1, \"title\":\"Learn TanStack Query\" }]"

2nd-Step
Raw Text -> String
"[{ \"id\":1, \"title\":\"Learn TanStack Query\" }]" -> "[{ "id":1, "title":"Learn TanStack Query" }]"

3rd-Step
String -> Json Object
"[{ "id":1, "title":"Learn TanStack Query" }]" ->[{ id:1, title:"Learn TanStack Query" }]

That's it this is how the fetch works behind the scene .
  
*/}




//Yaha response.ok  me "ok" hum backend se nahi bhej rahe hai , yeh fetch ka in-built feature hai , which gives us
//functionality to check fetch failed or success means response came or not