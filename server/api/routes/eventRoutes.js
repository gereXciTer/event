'use strict'

const passport = require('passport') 
module.exports = function(app) {
  var events = require('../controllers/eventController');
  var users = require('../controllers/userController');
  var invites = require('../controllers/inviteController');
  var drops = require('../controllers/dropController');

//DEV STUFF
app.get('/users', users.get_all)
app.delete('/user/:userId', users.delete)
app.get('/events/all', events.list_all_events)
app.get('/events/cleanup', events.cleanup_events)

  app.route('/events')
    .get(passport.authenticationMiddleware(), events.list_user_events)
    .post(passport.authenticationMiddleware(), events.create_event);

  app.route('/events/:eventId')
    .get(passport.authenticationMiddleware(), events.read_event)
    .put(passport.authenticationMiddleware(), events.update_event)
    .delete(passport.authenticationMiddleware(), events.delete_event);

  app.post('/user/auth', passport.authenticationMiddleware(), users.auth_user);

  app.get('/user/profile', passport.authenticationMiddleware(), users.get_profile)
  app.put('/user/profile', passport.authenticationMiddleware(), users.save_profile)

  app.post('/user/login', users.login_user)

  app.post('/user/logout', users.logout_user);

  app.post('/user/signup', users.signup, users.login_user)

  app.post('/invite', passport.authenticationMiddleware(), invites.create_invite)
  app.get('/invite/:inviteId', passport.authenticationMiddleware(), invites.read_invite)
  app.delete('/invite/:inviteId', passport.authenticationMiddleware(), invites.delete_invite)

  app.route('/drop')
    .post(passport.authenticationMiddleware(), drops.create_drop);

  app.route('/drop/:dropId')
    .put(passport.authenticationMiddleware(), drops.update_drop)
    .delete(passport.authenticationMiddleware(), drops.delete_drop);

}