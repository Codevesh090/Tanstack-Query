Tanstack query is not the replacement of fetch or axios , Tanstack query is only there to manage the request and response more professionally . Tanstack me bhi hum request toh fetch yaa axios se hi maarte hai but jo uska response aata hai ya us request se jusdi cheeze like loading , error , data yeh sab etc. things will be managed by Tanstack Query .


Sabse pehle humne vite se pura "react setup kiya"

Uske baad uhumne <npm i @tanstack/react-query  @tanstack/react-query-devtools >
Yeh do commands chalayi ek hume , tanstack-query and dusara hume tanstack-devtools use karne dega

Uske baad humne main.tsx me jaakar , Imported these two things :
<import {QueryClient,QueryClientProvider} from '@tanstack/react-query'
import {ReactQueryDevtools} from '@tanstack/react-query-devtools'>


And then humne <const queryClient = new QueryClient();> client banaya .
Yeh client hi main manager hota hai jo , data caching , queries and other things karta hai 


Uske baad humne apne <App /> ko wrap kar diya <Query client Provider> se such that hamara client pura <App> me accessible ho and we can use that client as we want . Hume <Query client Provider> me client bhi batana padta hai ki client kon hai so, we told <client={queryClient}> this is the client .


Also humne <ReactQueryDevtools initialIsOpen={false} /> devtools ko bhi humne likh diya .
Yeh kya karta hai , ki yeh hume devtools deta hai jo tanstack-query specific hote hai and yeh tanstack query se aa rahi sabhi problems or what's the state of the query , data chached or not sab kuch batate hai apne dahboard par jo ki hume hamari browswer screen par dikh jaata hai . when we open http://localhost:5173/ .



Yaha initial false ka matlab hai , Ki yeh "query ki state batane wala ek parameter hai " .
Iske "true" hone ka matlab hai , ki abhi query is not complete , Yaani 
Data abhi tak fetch nahi hua
Query loading state me hai
Data is not cached yet etc...

Iske "false" hone ka matlab hai , ki abhi query is complete , Yaani 
Data fetch ho gaya hai
Query loading state me nahi hai
Data is cached and so on....

Is paramter ka use , apne main code me query ke time par kiya jata hai ....To show query stage in Devtools .


Now after that what we did , humne src folder ke andar 4 more folders banaye [ api ,components , hooks , pages ] 


Uske baad humne [ api folder ] me jaakar ek tasks.ts file banayi and usme hume ek function banaya jo ki "get" request maarega to the backend and jo bhi response aaya use humne return kar diya and then we exported that function.

<export const fetchTasks = async () => {
 const response = await fetch("http://localhost:3000/tasks")

  if (!response.ok) {
    throw new Error("Failed to fetch tasks")
  }

  return response.json()
}
>


-------------------------------------------------------------------------------------------------------------
STEP-1
Uske baad hum App.tsx par aaye and wala aakar sabse phele hume import kiya .
<import { useQuery } from "@tanstack/react-query"
import { fetchTasks } from "./api/tasks">
such that we can use the useQuery and also imported the function from ./api/tasks

-------------------------------------------------------------------------------------------------------------
Extra-Info
When we use useEffect then hum fetch control karte the ese ki , when button click , some State becomes false and then as state changed toh function fetch happens .And if we leave the dependency empty [] then any change or anythings comes on viewport it runs automatically.

But in Tanstack, yeh hume ek feature deta hai refetch ka , Yaani by default yeh refetch "true" rehta hai , yaani iska matlab hai ki , yeh apne aap refetch kar leta hai in all these conditions 

⚪️ Component Mount (Page Load) -> when component mounts for the first time on viewport
⚪️ Agar "queryKey" change ho jaye to query dobara run hoti hai.
⚪️ Window Refocus -> Agar user tab switch karke wapas tab par aata hai. <BUT IF WE WANT TO CONTROL IT MANUALLY IT PROVIDES A ATTRIBUTE "refetchOnWindowFocus: true" JO BY DEFAULT TOH TRUE REHTA HAI WHICH MEANS it will automatically refetch when tabs switch but if we manually set this ATTRIBUTE TO false "refetchOnWindowFocus: false" then it will never fetch automatically when we switch tabs >
⚪️ Agar internet disconnect ho jaye aur fir reconnect ho. ->Internet off → Internet on → API refetch <Iske liye bhi hamare paas ek attribute hai jo by default true rehta hai "refetchOnReconnect: true" but we can set it to false if we want to not auto-refetch when Internet disconnects and again connects>
⚪️But If we want ki button click hone par hi refetch ho , ese na ho in any condition toh uske hume <Hamare paas ek attribute hai "enabled:false" ka , agar hum enabled "false" karke button se refetch call kare toh , us time par fetch tabhi hoga when we trigger the button  >

Example : OF BUTTON TRIGGER FETCH
But yaha jab hum Tanstack query use karte hai , toh agar hume button se fetch ko control karna hai toh hum ese karte hai .

<const { data, refetch } = useQuery({
  queryKey: ["tasks"],
  queryFn: fetchTasks,
  enabled: false
})>

<button onClick={() => refetch()}>
  Fetch Tasks
</button>

-------------------------------------------------------------------------------------------------------------
Step-2
USKE BAAD HUMNE YEH LIKHA 


const { data, isLoading, error } = useQuery({
    queryKey: ["tasks"],
    queryFn: fetchTasks
  })


Now yeh line kya kar rahi hai , Toh hoga yeh ki
🟨 useQuery hook 2-do argument leta hai <atleast>, 
🟨 Pehla <queryKey> , Querykey is a uniqueId used in dataCaching later , we can give any key like we gave "tasks" or we can give "hello" anything .
🟨 Dusara hai , <queryFn> which takes a function , yaani yeh wahi fetch-function hai jo yeh run karta hai.
🟨 Now , kyuki humne yaha refetch ko enable:false nahi kiya hai ya koi manual fetch condition nahi lagai hai toh jaise hi <component mount hoga yeh khud hi useQuery run kar dega ,And run karte hi uske andar ka function run ho jaayega and in return we get a object> . Yeh jo object aata hai yeh <sirf response hi contain nahi karta hai> , yeh ese bana hota hai ki when we call function then jo response aata hai us response ko yeh ek data naam ki key me daal deta hai and tanstack also adds more fields in this object like isLoading , error , refectch etc.This is the default object we get , when we call useQuery
{
  data: undefined,
  error: null,
  status: "loading",

  isLoading: true,
  isError: false,
  isSuccess: false,

  isFetching: true,
  isRefetching: false,

  refetch: function,

  dataUpdatedAt: 0,
  errorUpdatedAt: 0,

  fetchStatus: "fetching"
}

🟨 Now ab Humne us object ko destructure kiya , and used it as we want . 
🟨 Like humne bola ki
    if (isLoading) {
      return <h1>Loading tasks...</h1>
    }
    which means agar data abhi tak fetch nahi hua hoga tab toh loading true hogi , toh hum tab tak <h1>Loading tasks...</h1> yeh dikhayenge . Similiary we used other "keys".


   🟡 NOTE:
    data? me humne ? isliye lagaya because jab tak fetch marega , tab tak toh data undefined rahega and if data is undefined toh crash ho jaayegi website ,

    Hence we used this -> ? Yeh bolta hai
    agar data exist karta hai → map chalao
    agar data undefined / null hai → kuch mat karo


---------------------------------------------------------------------------------------------------------------
Extra-Info

HOW DOES CACHING And Refetching WORKS IN TANSTACK ?

Toh hota yeh hai ki when we runs this code:
useQuery({
  queryKey: ["tasks"],
  queryFn: fetchTasks
})

TanStack Query internally yeh karta hai at 1st Time fetch:

Sabse pehle api fetch request jaayegi ,  response aayega and us response ko ek "data" name ki key me daal denge
Uske baad wo key ko hum , Query cache me daal denge yaani wo data ko cache kar denge 
Uske baad ab wo jo <data(key):response(value)> , jo ki cached hai wo ek object se se combine hoga and ek new object banega and wahi object as a response aata hai when we call useQuery .
And Components usi cached data se bane object ko use karega and UI RENDERS AND WE SEE EVERYTHING ON SCREEN.
Yaani Components read from cache, not directly from the API

Component Mount
      ↓
API Request (GET /tasks)
      ↓
Data received
      ↓
Stored in Query Cache
      ↓
Component reads from cache
      ↓
UI renders


Uske baad 
Now let say , internet gaya and wapas aaya , jisse refetch hua
Now ab hum Tanstack ke refetch feature ko samajhte hai , How does this works ?
Toh refetch jab bhi hota hai wo hamesha background me hota hai , 
Yaani jab internet reconnect hua , Toh ek refetch request background me jaayegi
But Tab tak hume old cached data hi screen par dikhta hai .
And now jab refetch complete hua yaani , data aaya gaya 
Toh uske baad wo aaya hua data phir cached hota hai , yaani old data hat jata hai and new data cache hota hai.
Uske baad Phir component takes the new cahed data again
And UI renders again and new UI hume screen par dikh jaati hai .
This is how The refetch and cache works 

Old cached data still shown in UI
      ↓
Background API Request (GET /tasks)
      ↓
New Data Received
      ↓
Cache Updated
      ↓
React detects cache change
      ↓
Component Re-renders
      ↓
UI automatically updates with new data

----------------------------------------------------------
Means the total flow is :

Component Mount
      ↓
API Request (GET /tasks)
      ↓
Data Received
      ↓
Stored in Query Cache
      ↓
Component reads data from Cache
      ↓
UI renders with cached data
      ↓
User internet gone and comes back
      ↓
React Query triggers Refetch
      ↓
Old cached data still shown in UI
      ↓
Background API Request (GET /tasks)
      ↓
New Data Received
      ↓
Cache Updated
      ↓
React detects cache change
      ↓
Component Re-renders
      ↓
UI automatically updates with new data


🟩 IMPORTANT
Why this feels fast ?

Instead of showing 
Loading... , 
(Yaani when internet backs then again refetch happens , But agar hum yahi tanstack ka use nahi kar rahe hote toh hume loading dikhai deta , but kyuki we are using tanstack , so it uses the old data to bypass showing loading improving the user experience .)


React Query shows:
Old data instantly
+ background fetch
+ UI updates silently


This pattern is called:
Stale While Revalidate


🟩 IMPORTANT
But Where Cache Lives ? 
Yaani jo data aata hai use toh hum QueryCache me daal dete hai but the yeh Query cache kaha rehta hai ?

The cache lives inside QueryClient that we created earlier.
This one -> const queryClient = new QueryClient()

This query client stores this all
Query Cache
Mutation Cache
Observers
Timers


--------------------------------------------------------------------------------------------------------------
Abhi tak hum "Get request" padh rahe the ki kaise lana hai ,Humne pada ki get request ke liye we use <useQuery;
Now ab hum post request padenge ki kaise dalna hai , daalne ka kya process hai , For post we use <useMutation;


Toh sabse pehle humne <route create kiya backend me> ki jab uspar request aayegi ,toh <use in-memory me task add karne hai >

Uske baad humne ab main frontend me ./api/tasks me jaakar ke <function banaya which makes the post request.


------------------------------------------------------------------
After that we import three things

useMutation -> It work same a useQuery , its a react hook , Yeh atleast <do parameter> leta hai and when we use it then in return it gives back a <object> which look like this :

{
  data: undefined,
  error: null,
  variables: undefined,

  status: "idle",

  isIdle: true,
  isPending: false,
  isSuccess: false,
  isError: false,

  mutate: function,
  mutateAsync: function,
  reset: function,

  failureCount: 0,
  failureReason: null,

  submittedAt: 0
}

useQueryClient -> Yeh hume access deta hai us <client> se jo humne starting me banaya tha in main.jsx .
And Because client have the access to everything from cache to mutation , So hum client ka use karte hai do do all manual stuff . Ese client ka use kyu padega yaha ? Toh client ka use tabhi hota hai if we want to do these things manually
invalidateQueries → refetch trigger -> <Yaani .invalidateQueries se hum cache ko manually bol sakte hai ki cache me jo data hai wo purana ho gaya hai and isko invalid kar do .>
refetchQueries → manual refetch
setQueryData → cache update
getQueryData → cache read
prefetchQuery → advance fetch
removeQueries → cache delete
Simliarly,we have these other features that we use .


AddTask kuch nahi wo function hai jise humne ./api/tasks me likha hai .



<import { useMutation, useQueryClient } from "@tanstack/react-query"
import { addTask } from "./api/tasks">

------------------------------------------------------------------
Uske baad humne Yeh Likha 

POINT-1
const mutation = useMutation({
  mutationFn: addTask,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["tasks"] })
  }
})


and iske saath hi humne yeh sab bhi likha .

POINT-2
<import { useState } from "react"

<const [taskTitle, setTaskTitle] = useState("")


and yeh bhi

POINT-3
const handleAddTask = () => {
  mutation.mutate(taskTitle)
  setTaskTitle("")
}

and return me yeh bhi

POINT-4
<input
  value={taskTitle}
  onChange={(e) => setTaskTitle(e.target.value)}
  placeholder="Enter new task"
/>

<button onClick={handleAddTask}>
  Add Task
</button>



Toh yaani humne yaha POINT-> 1-4 me kya kiya , 
Toh humne sabse pehle <useMutation hook> ka use karke set kar diya ki jab hum <mutation variable> ko trigger karenge toh yeh <mutationfuction chalana hai and isSuccess par queryInvalidate karni hai.>
Toh humne yaha bola ki jab <Add task> button par click hoga toh 
Ek function chalega <handleAddTask> and isme hume humne <mutation.mutate(taskTitle)> se humne bola ki
<mutation function ko run karo aur server ko request bhejo with parameter (taskTitle)>, yaani we triggered the hook .
Toh ab kya hoga , Toh ab hoga yeh ki ek post request jaayegi server par yaani backend par 
BACKEND us request ko process karega yaani ,wo taskTitle humne body me bheja tha use lega and 
1st thing -> It will put that in in-memory db and 2nd thing wo jo humne bheja tha use hi wapas kar dega.
Now , response successfully aane ka matlab hai ,ki ab OnSuccess chalega and OnSuccess kya karega ki wo manually
khud hi bolega queryClient se ki "tasks" id waale Querycache me jo bhi data hai use invalidate(inavlidate karna yaani stale karne in terms of Tanstack) kar do (humne yaha key isliye di hai kyuki React Query cache me sirf ek cache nahi multiple cahe hote hai , toh hum har cache ko ek unique id dete hai taaki baad me hum us cache ko use id se access kar sake).Ab data invalid hone se kya hoga ki , kyuki tanstack hume feature deta hai ki cache me data purana hone oar wo khud hi refetch kar dega , toh agar hum use invalid kar denge toh automatically hi again refetch ho jaayega (refetch yaani new GET request chali jaayegi apne aap jo humne pehle banayi thi waise hi) and refetch se "task" id waale cache me new data aa jayega and new data aate hi wo old data hatega and new data UI par dikh jaayega .

Iske baad mutation.mutate finish hoga and then again input me value "" yeh set ho jaayegi. That's it

This is how , we post anything using Tanstack query .



This is the full mindmap :

User adds task (BY INPUT AND THEN BUTTON CLICK)
      ↓
mutation.mutate()
      ↓
POST /tasks
      ↓
Server saves task in db
      ↓
onSuccess fires
      ↓
invalidateQueries(["tasks"])
      ↓
Marks it as stale
      ↓
React Query refetches GET /tasks
      ↓
Cache updated
      ↓
Components re-render
      ↓
UI shows new task


--------------------------------------------------------------------------------------------------------------
GET and POST ke baad ,Ab hum seekhenge ki DELETE kaise karte hai .

Toh delete me kya hi hota hai , when we click on delete button then something is removed from the db , 
Toh yaha kya hoga , toh yaha bhi kuch nahi when we click on delete , 
Then ek delete request jaayegi and db se wo data delete ho jaayega 
Uske baad response aayega yaani request successful thi which means 
OnSuccess run karega jo cache ke data ko invalidate kar dega jisse 
Again refetch yaani phir ek GET request jaayegi and new data aayega 
"tasks" key waale Cache me and then Ui re-render hogi and new UI 
screen par visible ho jaayegi . This is what happens in DELETE also .

Humne isme sirf 4 steps kiye 


1st
Backend me ek route banaya 

app.delete("/tasks/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id)

  tasks = tasks.filter(task => task.id !== id)

  res.json({ message: "Task deleted" })
})

2nd 
Uske Baad humne ./api/tasks me ek function banaya jo us route par fetch(yaani delete) karega

export const deleteTask = async (id: number) => {
  const response = await fetch(`http://localhost:3000/tasks/${id}`, {
    method: "DELETE"
  })

  if (!response.ok) {
    throw new Error("Failed to delete task")
  }

  return response.json()
}

3rd
Uske baad we imported it
import { deleteTask } from "./api/tasks"

and then we wrote 
const deleteMutation = useMutation({
  mutationFn: deleteTask,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["tasks"] })
  }
})

4th
Uske baad kuch nahi Humne ek "delete" button add kar diya , jisse hi toh hook trigger hoga and request jaayegi.
<button
      onClick={() => deleteMutation.mutate(task.id)}
      style={{ marginLeft: "10px" }}
    >
      Delete
    </button>

That's it



The whole flow :

User clicks delete
      ↓
DELETE /tasks/:id
      ↓
Server removes task
      ↓
onSuccess runs
      ↓
invalidateQueries(["tasks"])
      ↓
TanStack refetches tasks
      ↓
UI updates automatically


--------------------------------------------------------------------------------------------------------------
AFTER GET,POST,DELETE ONLY ONE IS LEFT WHICH IS "PATCH" or "PUT" request
So, yeh bhi same hi hoga 



Yha bhi humne pehle backend likha 
Then ./api/tasks me function create kiya which make the put request
Then uske baad we imported it and wrote this:
 const updateMutation = useMutation({
  mutationFn: updateTask,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["tasks"] })
  }
})
Uske baad to trigger this hook we make a button whose name is "Done"
Now ab jab hum button par click karte hai toh , hook trigger hota hai 
Uske baad put request jaati hai ,(yaani state undone se update hokar done ho gayi) 
If fetch request is successful then OnSuccess runs 
Which invalidates the cache and marks as stale(means outdated )
Which cause the refetch to happen , means new GET request made in background
Then new data came and cache updated with new data 
which cause UI rendering again and then new UPDATED UI VISIBLE TO US.THAT'S IT


The whole flow:
User clicks done
       ↓
PATCH /tasks/:id
       ↓
Server updates task
       ↓
onSuccess
       ↓
invalidateQueries(["tasks"])
       ↓
TanStack refetches tasks
       ↓
UI updates

---------------------------------------------------------------------------------------------------------------
Now we will study about , ⭐️ " Optimistic updates " ⭐️

Toh iska matlab yeh hai ki , abhi tak agar hume koi query delete karni hoti thi , toh Hum kya karte the.
We do these three Updates :
Click delete
     ↓
Wait for server
     ↓
UI updates


But agar hum ese karne lag jaayenge , toh yeh approach bahut slow lagegi , kyuki kya pata server delete karne
me kitna time le , So, Companies like Twitter,Instagram etc. Use optimistic update method to make this fast.
So what they do ?

Toh wo companies kya karti hai wo is model ko use karti hai .
Click delete
      ↓
UI updates instantly
      ↓
Server confirms later

Yaani hota yeh hai ki jab aadmi DELETE par click karta hai , toh instantly UI update hota hai pehle and then
Server request runs in background and wait for the server confirmation and jab server peeche db me wo delete karke success response karta hai tab wo UI change ko system permanent maan leta hai , but let say if server fails then "rollback" ho jaata hai yaani jo screen par dikh raha tha deleted wo wapas aa jaata hai .Similiar concept like transaction agar server success then change permanent or else rollback happens means no change happens . So, <Either change will happen for sure or NO change will happen >

Click Delete
   ↓
UI updates instantly
   ↓
Server request -> If Success -> Permanent
   ↓
If Fail → Rollback




Now how this approach is more beneficial ?
Because It
1. Make UI instant
2. Improve user experience
3. Reduce perceived latency ( means Making the app feel faster to the user, even if the server actually takes time to respond.)
4. Keep data safe with rollback



Now how we achieved it here?

Humne yaha kiya yeh hai ki 
1. Sabse pehle humne simple yeh banaya <const deleteMutation = useMutation()>
2. Now ab humne useMutation me 4 attribute paas kiye mutationFn,onMutate,onError,onSettled
3. Toh hota yeh hai ki sabse pehle jab useMutation hook trigger hota hai .
4. Toh phele mutation function(mutationFn) run nahi hota hai balki , sabse pehle onMutate trigger hota hai
5. Now ab onMutate contains a function , jo sabse pehle "task id" as a parameter lega , taaki wo us task ko delete kar sake .
6. Now ab us function me sabse pehele run hota hai .cancelQueries jo kya karta hai ki agar koi bhi refetch yaa get request running hoga use cancel kar deti hai instantly . Stop any running GET /tasks request such that it doesn't overwrite our optimistic update
7. Now uske baad humne backup banaya hai . Humne .getQueries(yeh kisi bhi cache se daata laane ka kaam karti hai , like if we want to take some data from any cache manually) ka use kiya hai , it takes a argument jisme humne bataya hai ki kis cache se tumhe saara data laana hai (whose id is "tasks"). And then we saved that cached data in a variable named "previousTasks" .Now,our backup is ready ki agar rollback hua toh kya dikhana hai .
8. After that what we did , Humne .setQueries ka use kiya , jiska kaam hai cache me data daalna and it is used when we want to put data manually in cache , also this takes two arguments one is "tasks-id" and one is the function we will be running . Yaani In-total yeh kya karega ki , ki "tasks" cache ka current data uthayega and uske humne filter laga diya hai jo kya karega ki us task-id waala task find karega and use delete kar dega and then new array ko wapas cache me rakh dega jisse UI bhi instantly update ho jaayegi . Remember abhi tak server request nahi gayi hai yaani abhi tak db me data delete nahi hua hai sirf frontend ke cache se gaya hai . Kyuki humne yaha server request nahi maari hai toh yeh kaam toh fast hota hai , toh isiliye we see the change instantly .
9. Now,ab humne us previous task me jo backup data store kiya tha use return kar denge taaki aane next aage we can use it . Jab bhi hum on mutate ke function se kuch return karte hai , toh wo always ek context naam ke object me save hota hai as a key-value pair . And we can access it like context.previousTasks .
10. Now,after this all a "mutationFn" runs and then ek DELETE request jaayegi db me change ke liye .
11. Now agar ab agar wo request fail hui yaani db me change nahi ho raha hai , toh use handle karne ke liye we have OnError: attribute jo kya karta hai , ki agar error aaya toh roll back kar dega yaani cache me wapas jo backup kiya tha use wapas daal dega jisse wapas se frontend rollback ho jaayega . 
12. Now, a last step is left which is tricky
13. Now ab chahe request success ho yaa error aaye ek cheez chalti hi chalti hai hamesha which is OnSettle:
14. Now OnSettle kya karta hai ki , wo "tasks" cache me pade data ko invalidate yaani stale(outdated) kar dega jisse kya hoga ki ek refetch request last me jaayegi , jo GET request maaregi and again data db se laakar cache me daal degi jisse , jisse phir UI update hoga and we see final state on UI .


<Question>
Why we inavlidate queries ?
<Answer>
Yeh step isliye karte hai last me ki taaki jo db me hai wahi UI par bhi ho , esa galti se bhi nahi hona chahiye ki frontend pe kuch aur chal raha hai and db me kuch aur means its the last final check ki sab proper and in-sync hai naa .


<Question>
If server fails ,At that time then we just refetch and current data will come and we just show it on screen UI , Whats the point of making backup then ?
<Answer>
Its because :
If server returns false then through backup instantly previous state dikh jayegi, and then refetch hoga and data aayega and show ho jayega.
But if backup nahi hai, then if server returns false uske baad refetch hoga, but utni der tak wrong state screen par dikhti rahegi jab tak refetch complete nahi hota.
So to make sure wrong thing screen par jyada time tak na dikhe, we use previous backup (previousTasks) so that UI instantly rollback ho jaye.




<Question>
What is old in this 👇
queryClient.setQueryData(["tasks"], (old: any) =>
      old.filter((task: Task) => task.id !== taskId)
    ) 
?

<Answer>
Current cache value at the moment setQueryData runs .


<Full Optimistic Update Flow>

User clicks Delete button
      ↓
mutation.mutate(taskId) runs
      ↓
onMutate executes (before API request)
      ↓
cancelQueries(["tasks"])
Stops any running GET /tasks request
      ↓
getQueryData(["tasks"])
Backup current tasks → previousTasks
      ↓
setQueryData(["tasks"])
Optimistically remove task from cache
      ↓
Cache updates immediately
      ↓
React components re-render
      ↓
UI instantly removes the task
      ↓
DELETE /tasks/:id request sent to server



<Case 1️⃣ Server Success>

Server successfully deletes task
      ↓
onSettled runs
      ↓
invalidateQueries(["tasks"])
      ↓
React Query refetches GET /tasks
      ↓
Latest tasks returned from server
      ↓
Cache updated
      ↓
UI re-renders
      ↓
UI stays correct and synced with server



<Case 2️⃣ Server Error>

Server fails to delete task
      ↓
onError runs
      ↓
Rollback using previousTasks
queryClient.setQueryData(["tasks"], previousTasks)
      ↓
Cache restored
      ↓
React components re-render
      ↓
UI instantly returns to previous state
      ↓
onSettled runs
      ↓
invalidateQueries(["tasks"])
      ↓
GET /tasks runs again
      ↓
Cache updated with server data
      ↓
UI fully synchronized



---------------------------------------------------------------------------------------------------------------
Now, we will study about ⭐️Stale time and Caching Behaviour⭐️


1st Info 🟡
Tanstack has three caching states :
Fresh
Stale
Fetching


Fresh -> Matlab tumhara data jo cached hai wo "fresh" hai and jab tak data fresh state me hota hai , tab tak Tanstack kabhi bhi refetch nahi karta hai us cache ko . 

Stale -> Matlab tumhara data jo cached hai wo "outdated" ho gaya hai and if data or cache is in stale state toh if we change tabs or internet connect etc. conditions me refetch ho jaata hai .

Fetching -> It is the state jab naa toh data stale hai and na hi fresh , abhi data hi nahi hai , abhi wo fetch ho raha hai means the middle state .


2nd Info 🟡
By default <staleTime = 0> hota hai .
Yaani jab bhi refetch hota hai and data aata hai , toh <aate hi wo data stale ho jaata hai> yaani outdated ho jaata hai .


3rd Info 🟡
Tanstack Query hume "staleTime(in milliseconds)" karke ek attribute deta hai . Jise hum set kar sakte hai apne accordingly      
For example : 

<const { data, isLoading, error } = useQuery({
  queryKey: ["tasks"],
  queryFn: fetchTasks,
  staleTime: 10000
})>

Now this means ki :
Data stays fresh for 10 seconds , yaani ab hum chahe jo bhi kare like "tabs change" ,"network reconnnect", "component mounting" refetch nahi hoga ek bhi baar for 10 seconds as for 10 seconds our data in cache is fresh.


4th Info 🟡
gcTime (Garbage Collection Time) is a setting in TanStack Query that decides "how long unused query data should stay in cache before being deleted" . Yaani agar humne ek cache bana diya and usme data pada hai but bahut time se us data ka kahi bhi use nahi ho raha hai , wo bus cache memory me pada hua hai , toh kitni der baad wo unused data apne aap delete ho jaayega , that is gc Time .

--> For controling gcTime we have a attribute named "gcTime"

For example:

useQuery({
  queryKey: ["tasks"],
  queryFn: fetchTasks,
  gcTime: 60000(milliseconds)
})

which means "Cache will be removed after 1 minute or we can say 60 seconds of inactivity"

REMEMBER:
1sec = 1000milliseconds


ONE IMPORTANT NOTE :
queryClient.refetchQueries({ queryKey: ["tasks"] })

.refetchQueries se hum kisi cache ko manually refetch kar sakte hai .

---------------------------------------------------------------------------------------------------------------


Last one step left -> Step 12 ---- See chatgpt to study next -> Chat name "Tanstack Query Overview"


---------------------------------------------------------------------------------------------------------------