const mongoose = require('mongoose')

mongoose.set('strictQuery', false)
mongoose
  .connect(process.env.MONGODB_URI)
  .then(result => {
    console.log('Database connection succesful')
  })
  .catch(error => {
    console.log('Database connection failed: ', error.message)
  })

const personSchema = mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    required: true,
    validate: {
      validator: (v) => /^\d{2,3}-\d{2,}$/.test(v)
    }
  },
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Person', personSchema)
