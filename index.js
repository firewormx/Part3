// Part3 - 3.1-3.8
const express= require(`express`);
const app = express();
const cors = require(`cors`);

app.use(express.json());
app.use(cors());
app.use(express.static(`dist`));

const morgan = require(`morgan`);
 morgan.token(`payload`, function(req){
  return (
    (req.method === `POST` && req.body.name)
    ? JSON.stringify(req.body)
    : null
  )
})

const middleWare = morgan(`:method :url :status :res[content-length] - :response-time ms :req[header] :payload`);
app.use(middleWare);

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
        "number": "00-00-111222"
    }
];

app.get("/",(request, response)=>{
response.send(`<h1>Phonebook</h1>`)
});

app.get(`/api/persons`, (request, response)=>{
response.json(notes);
})

app.get(`/info`, (request, response)=>{
    const date= new Date().toString();
response.send( `
<p>Phonebook has info for ${notes.length} people</p>
<br/>
<p>${date}</p>
`)
})

app.get(`/api/persons/:id`, (request, response)=>{
const id = Number(request.params.id);
const matchednote = notes.find(note => note.id === id);
matchednote ? response.json(matchednote) : response.status(400).end()
})

const generatedNewId = () =>{
  const maxId = notes.length > 0
  ?  Math.max(...notes.map(note => note.id))
  : 0;
  return maxId + 1
  }

app.post(`/api/persons`, (request, response)=>{
  const body = request.body;

const exsitingName = notes.find(note => note.name === body.name);
if(exsitingName){
  return response.status(400).json({error: `name must be unique`})
}
if(!body.number){
  return response.status(400).json({error: `number missing`})
}
if(!body.name){
  return response.status(400).json({error: `name missing`})
}

const newNote ={
  id: generatedNewId(),
  name: body.name,
  number: body.number 
  }

notes = notes.concat(newNote);
newNote ? response.json(newNote) : response.status(400).end()
}
)

app.put(`/api/persons/:id`,(request, response)=>{
 const id = Number(request.params.id);
 console.log(id);
 const body = request.body;

 const changedPerson = {
  name: body.name,
  number: body.number,
  id: body.id
 }
notes= notes.map(note => note.id !== id ? note :  changedPerson);
response.json(changedPerson);

})


app.delete(`/api/persons/:id`, (request,response)=>{
  const id = Number(request.params.id);
  notes = notes.filter(note => note.id !== id);
  response.status(204).end();
  })

const PORT = 3007
app.listen((PORT), () =>{
    console.log(`Server running on port ${PORT}`)
})
