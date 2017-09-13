/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("mongoose");

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("passport");

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var express = __webpack_require__(3),
    session = __webpack_require__(4),
    MemoryStore = __webpack_require__(5)(session),
    passport = __webpack_require__(1),
    app = express(),
    port = process.env.PORT || 3001,
    mongoose = __webpack_require__(0),
    eventModel = __webpack_require__(6),
    dropModel = __webpack_require__(7),
    userModel = __webpack_require__(8),
    inviteModel = __webpack_require__(11),
    bodyParser = __webpack_require__(12),
    cookieParser = __webpack_require__(13);

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/eventdb');

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Cookie");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

__webpack_require__(14)(app);

app.use(cookieParser());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// app.use(session({ secret: 'keyboard cat' }));
app.use(session({
  secret: 'sdfdsf',
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 365 * 24 * 60 * 60 * 1000, httpOnly: false, secure: false }
  // store: new MemoryStore()
}));

app.use(passport.initialize());
app.use(passport.session());

var routes = __webpack_require__(16);
routes(app);

app.use(function (req, res) {
  res.status(404).send({ url: req.originalUrl + ' not found' });
});

app.listen(port);

console.log('server is running on port: ' + port);

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("express-session");

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("session-memory-store");

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var mongoose = __webpack_require__(0);
var Schema = mongoose.Schema;

var EventSchema = new Schema({
  name: {
    type: String,
    Required: 'Please enter event name'
  },
  users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  drops: [{ type: Schema.Types.ObjectId, ref: 'Drop' }],
  invites: [{ type: Schema.Types.ObjectId, ref: 'Invite' }],
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
  date: {
    type: Date,
    default: Date.now
  },
  Created_date: {
    type: Date,
    default: Date.now
  },
  status: {
    type: [{
      type: String,
      enum: ['pending', 'ongoing', 'completed']
    }],
    default: ['pending']
  }
});

EventSchema.methods.availableTo = function (userId) {
  var isOwner = this.owner && this.owner.equals(userId);
  var canRead = this.users.some(function (user) {
    return user.equals(userId);
  });
  return isOwner || canRead;
};

EventSchema.methods.belongsTo = function (userId) {
  return this.owner && this.owner.equals(userId);
};

module.exports = mongoose.model('Event', EventSchema, "events");

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var mongoose = __webpack_require__(0);
var Schema = mongoose.Schema;

var DropSchema = new Schema({
  name: {
    type: String,
    Required: 'Please enter event name'
  },
  split: [{
    invite: { type: Schema.Types.ObjectId, ref: 'Invite' },
    user: { type: Schema.Types.ObjectId, ref: 'User' }
  }],
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
  event: { type: Schema.Types.ObjectId, ref: 'Event' },
  date: {
    type: Date,
    default: Date.now
  },
  Created_date: {
    type: Date,
    default: Date.now
  },
  amount: {
    type: Number
  }
});

DropSchema.methods.belongsTo = function (userId) {
  return this.owner && this.owner.equals(userId);
};

module.exports = mongoose.model('Drop', DropSchema, "drops");

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var mongoose = __webpack_require__(0),
    uniqueValidator = __webpack_require__(9),
    Schema = mongoose.Schema,
    bcrypt = __webpack_require__(10),
    SALT_WORK_FACTOR = 10;

var UserSchema = new Schema({
  email: {
    type: String,
    required: [true, 'Please enter email'],
    unique: true,
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
  events: [{ type: Schema.Types.ObjectId, ref: 'Event' }],
  friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  Created_date: {
    type: Date,
    default: Date.now
  }
});

UserSchema.pre('save', function (next) {
  var user = this;
  if (!user.isModified('password')) return next();

  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, null, function (err, hash) {
      if (err) return next(err);

      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

UserSchema.methods.toJSON = function (params) {
  var obj = this.toObject();
  delete obj.password;
  delete obj.__v;
  delete obj.Created_date;
  return Object.assign(obj, params);
};

UserSchema.plugin(uniqueValidator);
module.exports = mongoose.model('User', UserSchema, "users");

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = require("mongoose-unique-validator");

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = require("bcrypt-nodejs");

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var mongoose = __webpack_require__(0);
var Schema = mongoose.Schema;

var InviteSchema = new Schema({
  email: { type: String },
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
  event: { type: Schema.Types.ObjectId, ref: 'Event' },
  date: {
    type: Date,
    default: Date.now
  },
  Created_date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Invite', InviteSchema, "invites");

/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = require("body-parser");

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = require("cookie-parser");

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

const passport = __webpack_require__(1),
      LocalStrategy = __webpack_require__(15).Strategy,
      mongoose = __webpack_require__(0),
      User = mongoose.model('User');

function findUser(email, callback) {
  User.findOne({ 'email': email }).populate({ path: 'friends', select: 'email name _id' }).exec(function (err, user) {
    if (err) {
      return callback(null);
    }
    return callback(null, user);
  });
}

passport.serializeUser(function (user, callback) {
  callback(null, user.email);
});

passport.deserializeUser(function (email, callback) {
  findUser(email, callback);
});

function authenticationMiddleware() {
  return function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).send({ success: false, message: 'Authentication error', redirect: true });
  };
}

function initPassport() {
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    failureFlash: true
  }, function (email, password, done) {
    findUser(email, function (err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { success: false, emailError: 'Email not found' });
      }
      user.comparePassword(password, function (err, match) {
        if (err) {
          return done(err, false);
        } else if (match) {
          return done(null, user.toJSON({ success: true }));
        } else {
          return done(null, false, { success: false, passwordError: 'Please check your password and try again' });
        }
      });
    });
  }));
  passport.authenticationMiddleware = authenticationMiddleware;
}

module.exports = initPassport;

/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports = require("passport-local");

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const passport = __webpack_require__(1);
module.exports = function (app) {
  var events = __webpack_require__(17);
  var users = __webpack_require__(18);
  var invites = __webpack_require__(19);
  var drops = __webpack_require__(20);

  //DEV STUFF
  app.get('/users', users.get_all);
  app.delete('/user/:userId', users.delete);
  app.get('/events/all', events.list_all_events);
  app.get('/events/cleanup', events.cleanup_events);

  app.route('/events').get(passport.authenticationMiddleware(), events.list_user_events).post(passport.authenticationMiddleware(), events.create_event);

  app.route('/events/:eventId').get(passport.authenticationMiddleware(), events.read_event).put(passport.authenticationMiddleware(), events.update_event).delete(passport.authenticationMiddleware(), events.delete_event);

  app.post('/user/auth', passport.authenticationMiddleware(), users.auth_user);

  app.get('/user/profile', passport.authenticationMiddleware(), users.get_profile);
  app.put('/user/profile', passport.authenticationMiddleware(), users.save_profile);

  app.post('/user/login', users.login_user);

  app.post('/user/logout', users.logout_user);

  app.post('/user/signup', users.signup, users.login_user);

  app.post('/invite', passport.authenticationMiddleware(), invites.create_invite);
  app.get('/invite/:inviteId', passport.authenticationMiddleware(), invites.read_invite);
  app.delete('/invite/:inviteId', passport.authenticationMiddleware(), invites.delete_invite);

  app.route('/drop').post(passport.authenticationMiddleware(), drops.create_drop);

  app.route('/drop/:dropId').put(passport.authenticationMiddleware(), drops.update_drop).delete(passport.authenticationMiddleware(), drops.delete_drop);
};

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var mongoose = __webpack_require__(0),
    Event = mongoose.model('Event'),
    Drop = mongoose.model('Drop'),
    Invite = mongoose.model('Invite'),
    User = mongoose.model('User');

exports.cleanup_events = function (req, res) {
  Event.find().populate('owner').remove({ owner: null }, function (err, data) {
    var deletedEvents = data;
    Drop.find().populate('event').remove({ event: null }, function (err, data) {
      var deletedDrops = data;
      Invite.find().populate('event').remove({ event: null }, function (err, data) {
        var deletedInvites = data;
        res.send({
          deletedEvents: deletedEvents,
          deletedDrops: deletedDrops,
          deletedInvites: deletedInvites
        });
      });
    });
  });
};

exports.list_all_events = function (req, res) {
  Event.find().populate('owner').exec(function (err, events) {
    res.send(events);
  });
};

exports.list_user_events = function (req, res) {
  User.findById(req.user._id).populate('events').exec(function (err, user) {
    if (err) {
      res.send(err);
    }
    res.json(user.events);
  });
};

exports.read_event = function (req, res) {
  Event.findById(req.params.eventId).populate({
    path: 'users owner',
    select: '_id name'
  }).populate({
    path: 'drops',
    populate: [{ path: 'split.user' }, { path: 'split.invite' }, { path: 'owner', select: 'name _id' }]
  }).exec(function (err, event) {
    if (err) {
      res.send(err);
    }
    if (event.availableTo(req.user._id)) {
      event.users.push(event.owner);
      Invite.find({ event: event._id }).exec(function (err, invites) {
        event.invites = invites;
        res.json(event);
      });
    } else {
      res.status(401).send({ success: true, message: 'Access denied', redirect: '/events' });
    }
  });
};

exports.create_event = function (req, res) {
  var new_event = new Event(Object.assign(req.body, { owner: req.user._id }));
  new_event.save((err, event) => {
    if (err) {
      res.send(err);
    }
    User.findById(req.user._id, function (err, user) {
      user.events.push(event);
      user.save(function (err, user) {
        if (err) res.status(500).send(err);else res.json(event);
      });
    });
  });
};

exports.update_event = function (req, res) {
  Event.findById(req.params.eventId).exec(function (err, event) {
    if (err) {
      return res.send(err);
    }
    if (!event.belongsTo(req.user._id)) {
      return res.status(401).send({ success: false });
    }
    event.name = req.body.name;
    event.save();
    res.json(event);
  });
};

exports.delete_event = function (req, res) {
  Event.findById(req.params.eventId).exec(function (err, event) {
    if (err) {
      res.send(err);
    }
    User.findById(req.user._id).then(function (user) {
      if (user) {
        user.events = user.events.filter(function (e) {
          return !e.equals(event._id);
        });
        user.save();
      }
    });
    if (event.owner.equals(req.user._id)) {
      event.remove();
      User.find({ '_id': { $in: event.users } }, function (err, users) {
        users.forEach(function (user) {
          if (user) {
            user.events = user.events.filter(function (e) {
              return !e.equals(event._id);
            });
            user.save();
          }
        });
      });
      Drop.find({ '_id': { $in: event.drops } }, function (err, drops) {
        drops.forEach(function (drop) {
          drop.remove();
        });
      });
    } else {
      event.users.filter(function (user) {
        return !user.equals(req.user._id);
      });
      event.save();
    }
    res.json(event);
  });
};

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

const passport = __webpack_require__(1);

var mongoose = __webpack_require__(0),
    User = mongoose.model('User');

exports.auth_user = function (req, res) {
  res.json(req.user);
};
exports.login_user = function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).send(info);
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      return res.send(user);
    });
  })(req, res, next);
};

exports.logout_user = function (req, res) {
  req.logout();
  res.send({ success: true });
};

exports.signup = function (req, res, next) {
  var user = new User({
    email: req.body.email,
    name: req.body.name,
    password: req.body.password
  });
  if (req.body.password === req.body.passwordRepeat) {
    user.save((err, user) => {
      if (err) {
        res.status(401).send(err);
      }
      next();
    });
  } else {
    return res.status(401).send(null, false, {
      success: false,
      errors: {
        password: { message: 'Please check your password and try again' }
      }
    });
  }
};
exports.get_profile = function (req, res) {
  User.findById(req.user._id).populate({ path: 'friends', select: '_id name email' }).exec(function (err, user) {
    if (err) {
      res.send(err);
    }
    res.json(user.toJSON());
  });
};
exports.save_profile = function (req, res) {
  User.findById(req.user._id).exec(function (err, user) {
    if (err) {
      return res.send(err);
    }
    user.name = req.body.name;
    user.email = req.body.email;
    user.save(function (err) {
      if (err) {
        return res.send(err);
      }
      res.json(user);
    });
  });
};

exports.get_all = function (req, res, next) {
  User.find().exec(function (err, users) {
    res.send(users);
  });
};
exports.delete = function (req, res) {
  User.findByIdAndRemove(req.params.userId, function (err, user) {
    if (err) {
      res.send(err);
    }
    res.json(user);
  }).exec();
};

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var mongoose = __webpack_require__(0),
    Event = mongoose.model('Event'),
    Invite = mongoose.model('Invite'),
    User = mongoose.model('User');

exports.read_invite = function (req, res) {
  Invite.findById(req.params.inviteId, function (err, invite) {
    if (err) {
      res.send(err);
    }
    if (!invite || invite.email !== req.user.email) {
      return res.status(404).send({ success: false, redirect: '/events' });
    }
    Event.findById(invite.event).populate('drops').exec(function (err, event) {
      if (invite.owner.equals(req.user._id)) {
        return res.send({ eventId: event._id, user: req.user.name || req.user.email });
      }
      User.findById(req.user._id, function (err, user) {
        var existingEvents = user.events.some(function (event) {
          return event.equals(event._id);
        });
        if (!existingEvents || !existingEvents.length) {
          user.events.push(event);
        }
        //add user to invite owner's friends list
        User.findById(invite.owner, function (err, owner) {
          var isFriend = owner.friends.some(function (u) {
            return u.equals(user._id);
          });
          if (!isFriend) {
            owner.friends.push(user._id);
            owner.save();
          }
        });
        var isFriend = user.friends.some(function (u) {
          return u.equals(invite.owner);
        });
        if (!isFriend) {
          user.friends.push(invite.owner);
        }
        user.save();
        var existingUsers = event.users.some(function (u) {
          return u.equals(user._id);
        });
        if (!existingUsers) {
          event.users.push(user);
          event.invites = event.invites.filter(function (e) {
            return !e.equals(invite._id);
          });
        }
        event.drops = event.drops.map(function (drop) {
          var inviteConverted = false;
          drop.split = drop.split.map(function (split) {
            if (split.invite && split.invite.equals(invite._id)) {
              split = { user: req.user._id };
              inviteConverted = invite._id;
            }
            return split;
          });
          if (inviteConverted) {
            drop.save();
          }
          return drop;
        });
        event.save();
        invite.remove();
        res.json({ success: true, eventId: event._id, user: user.name || user.email });
      });
    });
  });
};

exports.create_invite = function (req, res) {
  Invite.count({
    event: req.body.event,
    email: req.body.email
  }).exec(function (err, count) {
    if (!count) {
      var new_invite = new Invite({
        owner: req.user._id,
        event: req.body.event,
        email: req.body.email
      });
      new_invite.save((err, invite) => {
        if (err) {
          res.send(err);
          return;
        }
        //TODO: Send invite
        res.json(invite);
      });
    }
  });
};

exports.delete_invite = function (req, res) {
  Invite.findByIdAndRemove(req.params.inviteId, function (err, invite) {
    if (err || invite && !invite.owner.equals(req.user._id)) {
      return res.status(401).send(err || { success: false });
    }
    res.json(invite);
  }).exec();
};

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var mongoose = __webpack_require__(0),
    Event = mongoose.model('Event'),
    Drop = mongoose.model('Drop'),
    User = mongoose.model('User');

exports.drops_by_event = function (req, res) {
  Event.findById(req.params.eventId).populate({
    path: 'drops',
    populate: {
      path: 'owner'
    }
  }).exec(function (err, event) {
    if (err) {
      return res.send(err);
    }
    res.send(event.drops);
  });
};

exports.create_drop = function (req, res) {
  var new_drop = new Drop({
    owner: req.user._id,
    event: req.body.event,
    name: req.body.name,
    amount: req.body.amount,
    split: req.body.split
  });
  new_drop.save((err, drop) => {
    if (err) {
      return res.send(err);
    }
    Event.findById(drop.event).exec(function (err, event) {
      if (err) {
        return res.send(err);
      }
      event.drops.push(drop);
      event.save(function (err, event) {
        Drop.findById(drop._id).populate({ path: 'split.user split.invite' }).exec(function (err, drop) {
          res.json(drop);
        });
      });
    });
  });
};

exports.delete_drop = function (req, res) {
  Drop.findById(req.params.dropId).exec(function (err, drop) {
    if (err) {
      return res.send(err);
    }
    if (!drop.belongsTo(req.user._id)) {
      return res.status(401).send({ success: false });
    }
    drop.remove();
    Event.findById(drop.event).exec(function (err, event) {
      if (err) {
        return res.send(err);
      }
      event.drops = event.drops.filter(function (d) {
        return !d.equals(drop._id);
      });
      event.save(function (err, event) {
        res.json(drop);
      });
    });
  });
};

exports.update_drop = function (req, res) {
  Drop.findById(req.params.dropId).exec(function (err, drop) {
    if (err) {
      return res.send(err);
    }
    if (!drop.belongsTo(req.user._id)) {
      return res.status(401).send({ success: false });
    }
    drop.name = req.body.name;
    drop.split = req.body.split;
    drop.amount = req.body.amount;
    drop.save();
    res.json(drop);
  });
};

/***/ })
/******/ ]);