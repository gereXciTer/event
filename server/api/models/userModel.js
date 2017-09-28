'use strict'
var mongoose = require('mongoose'),
  uniqueValidator = require('mongoose-unique-validator'),
  Schema = mongoose.Schema,
  bcrypt = require('bcrypt-nodejs'),
  SALT_WORK_FACTOR = 10;

var UserSchema = new Schema({
  email: {
    type: String,
    required: [true, 'Please enter email'],
    unique: true,
    lowercase: true,
    dropDups: true
  },
  password: {
    type: String,
    required: [true, 'Please enter password']
  },
  name: {
    type: String,
    required: [true, 'Please enter your name']
  },
  events: [{type: Schema.Types.ObjectId, ref: 'Event'}],
  friends: [{type: Schema.Types.ObjectId, ref: 'User'}],
  Created_date: {
    type: Date,
    default: Date.now
  }
});

UserSchema.pre('save', function(next) {
  var user = this;
  if(!user.isModified('password')) return next();

  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt){
    if(err) return next(err);

    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if(err) return next(err);

      user.password = hash;
      next();
    })
  })
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

UserSchema.methods.toJSON = function(params) {
  var obj = this.toObject()
  delete obj.password
  delete obj.__v
  delete obj.Created_date
  return Object.assign(obj, params)
}

UserSchema.plugin(uniqueValidator);
module.exports = mongoose.model('User', UserSchema, "users");