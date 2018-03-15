var express = require('express');
var mongoose = require('mongoose');
var path = require('path');
var bodyParser = require('body-parser');
var sessions = require('express-session');
var User = require('./User.model');

var app = express();
var session;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(sessions({
  secret: 'SDSDFS#$@#$@#23423423',
  resave: false,
  saveUninitialized: true
}));

app.use('/cssFiles', express.static(__dirname + '/assets'));

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/test_db');

app.get('/', (req, resp) => {
  session = req.session;
  if(session.uniqueId){
    resp.redirect('/redirects');
  }else {
    resp.sendFile('index.html', {root: path.join(__dirname, './files')});
  }
});

app.get('/login', (req, resp) => {
  session = req.session;
  if(session.uniqueId){
    resp.redirect('/redirects');
  }else {
    resp.sendFile('login.html', {root: path.join(__dirname, './files')});
  }
});

app.get('/register', (req, resp) => {
  session = req.session;
  if(session.uniqueId){
    resp.redirect('/redirects');
  }else {
    resp.sendFile('register.html', {root: path.join(__dirname, './files')});
  }
});

app.get('/home', (req, resp) => {
  session = req.session;
  if(session.uniqueId){
    resp.sendFile('home.html', {root: path.join(__dirname, '/files')});
  }else{
    resp.redirect('/');
  }
});

app.get('/logout', (req, resp) => {
  req.session.destroy();
  resp.redirect('/');
});

app.get('/redirects', (req, resp) => {
  session = req.session;
  if(session.uniqueId){
    console.log(session.uniqueId);
    resp.redirect('/home');
  }else{
    resp.end('/');
  }
});

app.post('/login', (req, resp) => {
  User.findOne(req.body)
    .exec()
    .then((user) => {
      if(user !== null ){
        session = req.session;
        session.uniqueId = user._id;
      }
      resp.redirect('/redirects');
    })
    .catch((err) => {
      resp.send('error occured');
    });
});

app.post('/register', (req, resp) => {
  console.log('User is registering');
  User.create(req.body)
    .then((user)=> {
      console.log(user);
      resp.send('data inserted successfully..');
    })
    .catch((err) => {
      resp.send('Error occured..');
    });
});

app.listen(1337, () => {
  console.log('App is listening at port:1337..');
});
