const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://phonebook:${password}@cluster0.m5qb2s6.mongodb.net/?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const phonebookSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Phonebook = mongoose.model('Phonebook', phonebookSchema)

const phonebook = new Phonebook({
  name: process.argv[3],
  number : process.argv[4]
})
//if password, name and number are given as command-line arguments, add the person to the phonebook
if(process.argv.length === 5){
  phonebook.save().then(result => {
    console.log('new phone item saved!');
    console.log(`added ${process.argv[3]} number ${process.argv[4]} to phonebook`)
    mongoose.connection.close()
  })
}

if(process.argv.length === 3){
  Phonebook.find({}).then(result => {
    result.forEach(item => {
      console.log(`phonebook: ${item.name} ${item.number}`)
    })
    mongoose.connection.close()
  })
}

if(process.argv.length === 4 || process.argv.length > 5){
  console.log('Please provide the right number of arguments. If the name you are trying to add containes spaces, wrap it in quotes.'
  )
  mongoose.connect.close()
}