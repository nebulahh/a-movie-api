const express = require('express')
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient
const app = express()
require('dotenv').config()

let dbConnectionStr = process.env.DB_STRING


MongoClient.connect(dbConnectionStr)
    .then(client => {
        console.log(`Connected to Database.`)
        const db = client.db('movies')
        const quotescollection = db.collection('movies')
        app.set('view engine', 'ejs')
        app.use(express.urlencoded({ extended: true }))
        app.use(express.static('public'))
        app.use(express.json())

        app.use(express.json())
        app.use(cors())


app.get('/', (req, res) => {
  quotescollection.find().sort({likes: -1}).toArray()
    .then(result => {
      // console.log(result);
      res.render('index.ejs', { characters: result })
    })
    .catch(error => console.error(error))
})

app.post('/characters', (req, res) => {
const body = req.body
console.log(body);
  if (!body.name || !body.movie) {
  return res.status(400).json({
    error: 'Name or number is missing'
  })
}
//  quotescollection.find(person => person.name === body.name)
//   .then( f => {
//     if (f) {
//       return res.status(400).json({
//         error: 'name must be unique'
//       })
//     }
//   }
//   )


  quotescollection.insertOne({name: req.body.name, movie: req.body.movie, likes: 0})
    .then(result => {
      console.log(result);
      res.redirect('/')
    })
    .catch(error => console.error(error))
})


app.put('/addLikes', (req, res) => {
  quotescollection.updateOne(
    { name: req.body.name, movie: req.body.movie, likes: req.body.likes },
    {
      $set: {
        likes: req.body.likes + 1
      }
    },
    {
      sort: {_id: -1},
      upsert: true
    }
  )
  .then(result => {
    console.log(result);
    res.json('success')
  })
  .catch(error => console.error(error))
})

app.delete('/deleteCharacter', (req, res) => {
  quotescollection.deleteOne(
  { name: req.body.name }
  )
  .then(result => {
    if (result.deletedCount === 0) {
      return res.json('No data to delete')
    }
    res.json("deleted character.")
  })
  .catch(error => console.error(error))
})


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)


})
.catch(error => console.error(error))


const PORT = 4000
app.listen(process.env.PORT || PORT, () => {
  console.log(`Server running on port ${PORT}`);
})