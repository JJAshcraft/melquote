const express = require('express')
const app = express()
const bodyParser = require ('body-parser')
const MongoClient = require('mongodb').MongoClient


var db

MongoClient.connect('mongodb://josh:josh@ds247698.mlab.com:47698/onepositivethought', (err, client) => {
  if (err) return console.log(err)
  db = client.db('onepositivethought')
  app.listen(process.env.PORT || 3000, () => {
    console.log('listening on 3000')
  })
})
app.set('view engine', 'ejs')
app.use (bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/index.html');
// })

app.get('/', (req, res) => {
  var cursor = db.collection('quotes').find().toArray((err, result) => {
    console.log(result)
    res.render('index.ejs', {quotes: result})
  })
})

app.post ('/quotes', (req, res) => {
  db.collection('quotes').save(req.body, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/')
  })
})

app.put('/quotes', (req, res) => {
  db.collection('quotes').findOneAndUpdate(
    {
      name: 'Yoda'
    },
    {
      $set: {
        name: req.body.name,
        quote: req.body.quote
      }
    },
    {
      sort: {_id: -1},
      upsert: false
    }, (err, result) => {
      if (err) return res.send(err)
      res.json(result)
    }
  )
})

app.delete('/quotes', (req, res) => {
  db.collection('quotes').findOneAndDelete(
    {
      name: req.body.name
    },
    (err, result) => {
      if (err) return res.send(500, err)
      res.send({message: "A Vader Quote was DELETED."})
    }
  )
})
