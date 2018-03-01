var express = require('express'),
  session = require('express-session'),
  MemoryStore = require('session-memory-store')(session),
  passport = require('passport'),
  app = express(),
  port = process.env.PORT || 3001,
  mongoose = require('mongoose'),
  eventModel = require('./api/models/eventModel'),
  dropModel = require('./api/models/dropModel'),
  userModel = require('./api/models/userModel'),
  inviteModel = require('./api/models/inviteModel'),
  bodyParser = require('body-parser'),
  cookieParser = require('cookie-parser');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/eventdb', {useMongoClient: true});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://split.webgears.org");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Cookie");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

require('./auth')(app)

app.use(cookieParser());

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// app.use(session({ secret: 'keyboard cat' }));
app.use(session({  
  secret: 'sdfdsf',
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 365 * 24 * 60 * 60 * 1000,httpOnly: false, secure: false},
  // store: new MemoryStore()
}))

app.use(passport.initialize())  
app.use(passport.session())  

var routes = require('./api/routes/eventRoutes');
routes(app);

app.use(function(req, res){
  res.status(404).send({url: req.originalUrl + ' not found'})
})

app.listen(port);

console.log('server is running on port: ' + port);
