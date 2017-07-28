'use strict'

var mongoose = require('mongoose'),
  Event = mongoose.model('Event'),
  Invite = mongoose.model('Invite'),
  User = mongoose.model('User');

exports.read_invite = function(req, res){
  Invite.findById(req.params.inviteId, function(err, invite){
    if(err){
      res.send(err);
    }
    if(!invite || invite.email !== req.user.email){
      return res.status(404).send({success: false, redirect: '/events'});
    }
    Event.findById(invite.event)
      .populate('drops')
      .exec(function(err, event){
        if(invite.owner.equals(req.user._id)){
          return res.send({eventId: event._id, user: req.user.name || req.user.email})
        }
        User.findById(req.user._id, function(err, user){
          var existingEvents = user.events.some(function(event){ return event.equals(event._id) })
          if(!existingEvents || !existingEvents.length){
            user.events.push(event)
          }
          //add user to invite owner's friends list
          User.findById(invite.owner, function(err, owner){
            var isFriend = owner.friends.some(function(u){ return u.equals(user._id) });
            if(!isFriend){
              owner.friends.push(user._id)
              owner.save()
            }
          })
          var isFriend = user.friends.some(function(u){ return u.equals(invite.owner) });
          if(!isFriend){
            user.friends.push(invite.owner)
          }
          user.save()
          var existingUsers = event.users.some(function(u){ return u.equals(user._id) })
          if(!existingUsers){
            event.users.push(user)
            event.invites = event.invites.filter(function(e){ return !e.equals(invite._id) })
          }
          event.drops = event.drops.map(function(drop){
            var inviteConverted = false;
            drop.split = drop.split.map(function(split){
              if(split.invite && split.invite.equals(invite._id)){
                split = {user: req.user._id}
                inviteConverted = invite._id;
              }
              return split;
            })
            if(inviteConverted){
              drop.save()
            }
            return drop;
          })
          event.save()
          invite.remove()
          res.json({success: true, eventId: event._id, user: user.name || user.email})
        })
      })
  })
}

exports.create_invite = function(req, res){
  Invite.count({
    event: req.body.event,
    email: req.body.email
  }).exec(function(err, count){
    if(!count){
      var new_invite = new Invite({
        owner: req.user._id,
        event: req.body.event,
        email: req.body.email
      });
      new_invite.save((err, invite) => {
        if (err){
          res.send(err);
          return;
        }
        //TODO: Send invite
        res.json(invite);
      })
    }
  })
}

exports.delete_invite = function(req, res){
  Invite.findByIdAndRemove(req.params.inviteId, function(err, invite){
    if(err || (invite && !invite.owner.equals(req.user._id))){
      return res.status(401).send(err || {success: false});
    }
    res.json(invite);
  }).exec()
}

