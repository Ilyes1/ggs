const express = require('express')
const mongoose = require('mongoose')
var bodyParser = require('body-parser');
var Task = require('./taskSchema')
var nodemailer = require('nodemailer');

const app = express()

app.use(express.static(__dirname))
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs')

//connect to database
mongoose.connect('mongodb://localhost/todo_list', { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
  if (err) throw err

  console.log('connected to db')

  app.post('/todo', (req, res) => {
    var task = new Task ({
      task: req.body.todo,
      date: Date.now()
    })
  
    task.save((err) => {
      if (err) throw err
      console.log('saved')
      res.redirect('/')
    })
  })
  
  app.get('/', (req, res) => {
    Task.find({}, (err, result) => {
      if (err) throw err
      res.render('view', {result: result, pres: ''})
    })
  })

  app.use('/delete/:id', (req, res) => {
    const ID = req.params.id
    Task.deleteOne({_id: ID}, (err) => {
      if (err) throw err
      console.log('Deleted!')
    })
    res.redirect('/')
  })

})

app.post('/send', (req, res) => {
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'ihannouch7@gmail.com',
      pass: 'Qwertylyes8'
    }
  });
  
  var mailOptions = {
    from: 'ihannouch7@gmail.com',
    to: req.body.email,
    subject: 'Sending Email using Node.js',
    text: 'That was sooo easy!'
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

  res.redirect('/')
})


const port = process.env.PORT || 3000


app.listen(port)