require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

const Person = require('./models/person')

const app = express()

// let persons = [
//   {
//     id: 1,
//     name: 'Arto Hellas',
//     number: '040-123456',
//   },
//   {
//     id: 2,
//     name: 'Ada Lovelace',
//     number: '39-44-5323523',
//   },
//   {
//     id: 3,
//     name: 'Dan Abramov',
//     number: '12-43-234345',
//   },
//   {
//     id: 4,
//     name: 'Mary Poppendieck',
//     number: '39-23-6423122',
//   },
// ]

morgan.token('payload', (req, res) => JSON.stringify(req.body))

// const morganLogger = morgan('tiny')
const morganLogger = morgan(
  ':method :url :status :res[content-length] - :response-time ms :payload'
)

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, req, res, next) => {
  console.log(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(cors())
app.use(express.json())
app.use(morganLogger)
app.use(express.static('build'))

app.get('/info', (req, res) => {
  // const display = `
  //   <p>Phonebook has info for ${persons.length} people</p>
  //   <p>${new Date()}</p>
  // `
  // res.send(display)

  Person.countDocuments({}).then(count => {
    const display = `
    <p>Phonebook has info for ${count} people</p>
    <p>${new Date()}</p>
  `
    res.send(display)
  })
})

app.get('/api/persons', (req, res) => {
  // res.json(persons)
  Person.find({}).then(result => {
    res.json(result)
  })
})

app.get('/api/persons/:id', (req, res, next) => {
  // const id = Number(req.params.id)
  // const person = persons.find(p => p.id === id)

  // if (!person) {
  //   return res.status(404).end()
  // }

  // res.json(person)
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})

const generateId = () => {
  // persons.length ? Math.max(...persons.map(p => p.id)) + 1 : 0
  return Math.floor(Math.random() * 99999) + 1
}

app.post('/api/persons', (req, res, next) => {
  const body = req.body

  // !(body.name && body.number)
  // if (!body.name || !body.number) {
  //   return res.status(400).json({ error: 'missing field' })
  // }

  // const person = persons.find(
  //   p => p.name.toLowerCase() === body.name.toLowerCase()
  // )
  //
  // if (person) {
  //   return res.status(400).json({ error: 'name must be unique' })
  // }
  //
  // const newEntry = {
  //   id: generateId(),
  //   name: body.name,
  //   number: body.number,
  // }

  // persons = persons.concat(newEntry)

  // res.status(201).json(newEntry)

  const newPerson = new Person({
    name: body.name,
    number: body.number,
  })

  newPerson
    .save()
    .then(savedPerson => {
      res.status(201).json(savedPerson)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  // const body = req.body
  const { name, number } = req.body

  // const updatedEntry = {
  //   name: body.name,
  //   number: body.number,
  // }

  // Person.findByIdAndUpdate(req.params.id, updatedEntry, { new: true })
  Person.findByIdAndUpdate(
    req.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(person => {
      res.json(person)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  // const id = Number(req.params.id)

  // // no handling for non existing "note"
  // persons = persons.filter(p => p.id !== id)

  // res.status(204).end()
  Person.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

app.use(unknownEndpoint)
app.use(errorHandler)

// const PORT = 3001
const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`)
})
