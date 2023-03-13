const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

const app = express()


let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
]

morgan.token('payload', (req, res) => JSON.stringify(req.body))

// const morganLogger = morgan('tiny')
const morganLogger = morgan(
  ':method :url :status :res[content-length] - :response-time ms :payload'
)

app.use(cors())
app.use(express.json())
app.use(morganLogger)

app.get('/info', (req, res) => {
  const display = `
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>
  `
  res.send(display)
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(p => p.id === id)

  if (!person) {
    return res.status(404).end()
  }

  res.json(person)
})

const generateId = () => {
  // persons.length ? Math.max(...persons.map(p => p.id)) + 1 : 0
  return Math.floor(Math.random() * 99999) + 1
}

app.post('/api/persons', (req, res) => {
  const body = req.body

  // !(body.name && body.number)
  if (!body.name || !body.number) {
    return res.status(400).json({ error: 'missing field' })
  }

  const person = persons.find(
    p => p.name.toLowerCase() === body.name.toLowerCase()
  )

  if (person) {
    return res.status(400).json({ error: 'name must be unique' })
  }

  const newEntry = {
    id: generateId(),
    name: body.name,
    number: body.number,
  }

  persons = persons.concat(newEntry)

  res.status(201).json(newEntry)
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)

  // no handling for non existing "note"
  persons = persons.filter(p => p.id !== id)

  res.status(204).end()
})

// const PORT = 3001
const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`)
})
