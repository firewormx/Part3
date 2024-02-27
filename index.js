// Part3 - 3.1-3.8
require('dotenv').config()
const express= require(`express`);
const app = express();
const cors = require(`cors`);
const Phonebook = require('./models/phonebook')

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

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if(error.name === 'CastError'){
      return  response.status(400).send({ error: 'malformed id' })
  }else if(error.name ===  'ValidationError'){
      return response.status(400).json({ error: error.message })
  }
  next(error)
}

app.get("/",(request, response)=>{
response.send(`<h1>Phonebook</h1>`)
});

app.get(`/info`, (request, response, next)=>{
   Phonebook.find({})
   .then(persons => {
    response.send( `
    <p>Phonebook has info for ${persons.length} people</p>
    <br/>
    <p>${new Date()}</p>
    `)
   }).catch(error => next(error))
})

app.get('/api/persons', (request, response, next) => {
  Phonebook.find({}).then(persons => {
      response.json(persons)
  }).catch(error => next(error))
})

app.post('/api/persons', (request,response, next) => {
  const body = request.body
  if(!body.name || !body.number){
      return response.status(400).json({ error: 'name or number missing' })
  }
  const phonebook= new Phonebook({
      name: body.name,
      number: body.number
  })

  phonebook.save().then(returnedPerson => {
      response.json(returnedPerson)
  }).catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  Phonebook.findById(request.params.id).then(result => {
      if(result){
          response.json(result)
      }else{
          response.status(404).end()
      }
  }).catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Phonebook.findByIdAndDelete(request.params.id)
      .then(() => {
          response.status(204).end()
      })
      .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Phonebook.findByIdAndUpdate(
      request.params.id,
      { name, number },
      { new: true })
      .then(updatedPerson => {
          response.json(updatedPerson)
      })
      .catch(error => next(error))
})


app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})