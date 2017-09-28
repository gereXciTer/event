const passport = require('passport'),  
  LocalStrategy = require('passport-local').Strategy,
  mongoose = require('mongoose'),
  User = mongoose.model('User');

function findUser (email, callback) {
  User.findOne({'email': email.toLowerCase()})
  .populate({path: 'friends', select: 'email name _id'})
  .exec(function(err, user){
    if(err){
      return callback(null);
    }
    return callback(null, user);
  })
}

passport.serializeUser(function (user, callback) {
  callback(null, user.email)
})

passport.deserializeUser(function (email, callback) {
  findUser(email, callback)
})


function authenticationMiddleware () {  
  return function (req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
    res.status(401).send({success: false, message: 'Authentication error', redirect: true})
  }
}

function initPassport() {
  passport.use(new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password',
      failureFlash: true
    },
    function(email, password, done) {
      findUser(email, function (err, user) {
        if (err) {
          return done(err)
        }
        if (!user) {
          return done(null, false, {success: false, emailError: 'Email not found'})
        }
        user.comparePassword(password, function(err, match){
          if(err){
            return done(err, false)
          }else if(match){
            return done(null, user.toJSON({success: true}))
          }else{
            return done(null, false, {success: false, passwordError: 'Please check your password and try again'})
          }
        })
      })
    }
  ))
  passport.authenticationMiddleware = authenticationMiddleware
}
  

module.exports = initPassport