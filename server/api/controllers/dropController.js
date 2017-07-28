'use strict'

var mongoose = require('mongoose'),
  Event = mongoose.model('Event'),
  Drop = mongoose.model('Drop'),
  User = mongoose.model('User');


exports.drops_by_event = function (req, res) {
  Event.findById(req.params.eventId)
    .populate({
      path: 'drops',
      populate: {
        path: 'owner'
      }
    })
    .exec(function(err, event){
      if(err){
        return res.send(err)
      }
      res.send(event.drops)
    })
}

exports.create_drop = function (req, res) {
  var new_drop = new Drop({
    owner: req.user._id,
    event: req.body.event,
    name: req.body.name,
    amount: req.body.amount,
    split: req.body.split
  });
  new_drop.save((err, drop) => {
    if (err){
      return res.send(err);
    }
    Event.findById(drop.event)
      .exec(function(err, event){
        if(err){
          return res.send(err)
        }
        event.drops.push(drop)
        event.save(function(err, event){
          Drop.findById(drop._id)
            .populate({path: 'split.user split.invite'})
            .exec(function(err, drop){
              res.json(drop);
            })
        })
      })
  })
}

exports.delete_drop = function (req, res) {
  Drop.findById(req.params.dropId)
    .exec(function(err, drop){
      if(err){
        return res.send(err);
      }
      if(!drop.belongsTo(req.user._id)){
        return res.status(401).send({success: false})
      }
      drop.remove()
      Event.findById(drop.event)
        .exec(function(err, event){
          if(err){
            return res.send(err)
          }
          event.drops = event.drops.filter(function(d){ return !d.equals(drop._id) })
          event.save(function(err, event){
            res.json(drop);
          })
        })
    })
}

exports.update_drop = function (req, res) {
  Drop.findById(req.params.dropId).exec(function(err, drop){
    if(err){
      return res.send(err);
    }
    if(!drop.belongsTo(req.user._id)){
      return res.status(401).send({success: false})
    }
    drop.name = req.body.name;
    drop.split = req.body.split;
    drop.amount = req.body.amount;
    drop.save();
    res.json(drop);
  })
}