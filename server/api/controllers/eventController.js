'use strict'

var mongoose = require('mongoose'),
  Event = mongoose.model('Event'),
  Drop = mongoose.model('Drop'),
  Invite = mongoose.model('Invite'),
  User = mongoose.model('User');

exports.cleanup_events = function(req, res){
  Event.find().populate('owner').remove({owner: null}, function(err, data){
    var deletedEvents = data
    Drop.find().populate('event').remove({event: null}, function(err, data){
      var deletedDrops = data
      Invite.find().populate('event').remove({event: null}, function(err, data){
        var deletedInvites = data
        res.send({
          deletedEvents: deletedEvents, 
          deletedDrops: deletedDrops,
          deletedInvites: deletedInvites
        })
      })
    })
  })
}

exports.list_all_events = function(req, res){
  Event.find()
    .populate('owner')
    .exec(function(err, events){
      res.send(events)
    })
}

exports.list_user_events = function(req, res){
  User.findById(req.user._id)
    .populate('events')
    .exec(function(err, user){
      if(err){
        res.send(err);
      }
      res.json(user.events);
     })
}

exports.read_event = function(req, res){
  Event.findById(req.params.eventId)
    .populate({
      path: 'users owner',
      select: '_id name'
    })
    .populate({
      path: 'drops',
      populate: [
        {path: 'split.user'}, 
        {path: 'split.invite'}, 
        {path: 'owner', select: 'name _id'}
      ]
    })
    .exec(function(err, event){
      if(err){
        res.send(err);
      }
      if(event.availableTo(req.user._id)){
        event.users.push(event.owner)
        Invite.find({event: event._id})
          .exec(function(err, invites){
            event.invites = invites;
            res.json(event);
          })
      }else{
        res.status(401).send({success: true, message: 'Access denied', redirect: '/events'});
      }
    })
}

exports.create_event = function(req, res){
  var new_event = new Event(Object.assign(req.body, { owner: req.user._id }));
  new_event.save((err, event) => {
    if (err){
      res.send(err);
    }
    User.findById(req.user._id, function(err, user){
      user.events.push(event)
      user.save(function(err, user){
        if(err)
          res.status(500).send(err)
        else
          res.json(event);
      })
    })
  })
}

exports.update_event = function(req, res){
  Event.findById(req.params.eventId).exec(function(err, event){
    if(err){
      return res.send(err);
    }
    if(!event.belongsTo(req.user._id)){
      return res.status(401).send({success: false})
    }
    event.name = req.body.name;
    event.save();
    res.json(event);
  })
}

exports.delete_event = function(req, res){
  Event.findById(req.params.eventId).exec(function(err, event){
    if(err){
      res.send(err);
    }
    User.findById(req.user._id)
      .then(function(user){
        if(user){
          user.events = user.events.filter(function(e){ return !e.equals(event._id) })
          user.save()
        }
      })
    if(event.owner.equals(req.user._id)){
      event.remove()
      User.find({ '_id': { $in: event.users }}, function(err, users){
        users.forEach(function(user){
          if(user){
            user.events = user.events.filter(function(e){ return !e.equals(event._id) })
            user.save()
          }
        })        
      })
      Drop.find({ '_id': { $in: event.drops }}, function(err, drops){
        drops.forEach(function(drop){
          drop.remove()
        })
      })
    }else{
      event.users.filter(function(user){ return !user.equals(req.user._id) })
      event.save()
    }
    res.json(event);
  })
}

