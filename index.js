const express= require(`express`);
const app = express();
app.use(express.json());

let notes=[
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    },
    {
        "id":5,
        "name": "test",
        "number": "00-00-1112223"
    }
]

app.get("/",(request, response)=>{
response.send(`<h1>Phonebook</h1>`)
});

app.get(`/api/persons`, (request, response)=>{
response.json(notes);
})

app.get(`/info`, (request, response)=>{
    const date= new Date();
response.send( `
<p>Phonebook has info for ${notes.length} people</p>
<br/>
<p>${date}</p>
`)
})

app.get(`/api/persons/:id`, (request, response)=>{
const id = Number(request.params.id);
const matchednote = notes.find(note => note.id === id);
matchednote ? response.json(notes[id-1]) : response.status(400).end()
})

const PORT = 3005
app.listen((PORT), () =>{
    console.log(`Server running on port ${PORT}`)
})
