const passport = require('passport') 

var mongoose = require('mongoose'),
  User = mongoose.model('User');

exports.auth_user = function(req, res){
  res.json(req.user)
}
exports.login_user = function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.status(401).send(info); }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.send(user);
    });
  })(req, res, next);
}

exports.logout_user = function(req, res){
    req.logout();
    res.send({success: true});
  }

exports.signup = function(req, res, next) {
  var user = new User({
    email: req.body.email,
    name: req.body.name,
    password: req.body.password
  });
  if(req.body.password === req.body.passwordRepeat){
    user.save((err, user) => {
      if (err){
        res.status(401).send(err);
      }
      next();
    })
  }else{
    return res.status(401).send(null, false, {
      success: false, 
      errors: {
        password: {message: 'Please check your password and try again'}
      }
    })
  }
}
exports.get_profile = function(req, res){
  User.findById(req.user._id)
    .populate({path: 'friends', select: '_id name email'})
    .exec(function(err, user){
      if(err){
        res.send(err);
      }
      res.json(user.toJSON());
    })
}
exports.save_profile = function(req, res){
  User.findById(req.user._id).exec(function(err, user){
    if(err){
      return res.send(err);
    }
    user.name = req.body.name;
    user.email = req.body.email;
    user.save(function(err){
      if(err){
        return res.send(err);
      }
      res.json(user);
    });
  })
}

exports.get_all = function(req, res, next) {
  User.find().exec(function(err, users){
    res.send(users)
  })
}
exports.delete = function(req, res){
  User.findByIdAndRemove(req.params.userId, function(err, user){
    if(err){
      res.send(err);
    }
    res.json(user);
  }).exec()
}
