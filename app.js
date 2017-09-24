//
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const config = require('./config/database');
//initialising app variable with express
const app = express();

const http = require('http').Server(app);
const io = require('socket.io')(http);

//connecting to db
mongoose.connect(config.database);

//on connection
mongoose.connection.on('connected', () =>{
    console.log('connected to database:'+config.database);
});
//socket io
io.on('connection', (socket)=>{
  console.log('a user connected');

  //test messages
  socket.on('event1', (data)=>{
      console.log(data.msg);
  });
  socket.emit('event2', {
      msg: 'server to client, do you read? Over.'
  });
  socket.on('event3', (data)=>{
      console.log(data.msg);
      socket.emit('event4',{
          msg: 'Loud and clear:)'
      });
  });
});

//on error
mongoose.connection.on('error', (err) =>{
    console.log('error:'+err);
});




const users = require('./routes/users');

//initialize port variable
const port = 3000;

//set up client side files(static files)
app.use(express.static(path.join(__dirname, 'client')));

//index route
app.get('/',(req, res)=>{
    res.send('invalid endpoint')
});

app.get('*',function(req, res){
    res.sendFile(path.join(__dirname, 'client/index.html'))
})

//start server
app.listen(port, () =>{
    console.log('started server on port'+port);
});

//to allow access from different domains
app.use(cors());
 
 //body parser passes incoming requests eg from submitted forms
 app.use(bodyParser.json());

 //passport
 app.use(passport.initialize());
 app.use(passport.session());

 require('./config/passport')(passport);

 app.use('/users', users);
