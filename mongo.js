const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Missing argument: password')
  process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://ph9t:${password}@an9el.7dvxbvi.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  Person.find({}).then(result => {
    console.log('phonebook: ')
    result.forEach(person => console.log(`${person.name} ${person.number}`))
    mongoose.connection.close()
  })
}

if (process.argv.length === 5) {
  const [name, number] = process.argv.slice(3)

  const newPerson = new Person({
    name,
    number,
  })

  newPerson.save().then(result => {
    console.log(`added ${result.name} ${result.number} to phonebook`)
    mongoose.connection.close()
  })
}
