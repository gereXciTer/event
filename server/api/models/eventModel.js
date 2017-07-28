'use strict'
var mongoose = require('mongoose');
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

EventSchema.methods.availableTo = function(userId) {
  var isOwner = this.owner && this.owner.equals(userId);
  var canRead = this.users.some(function(user){ return user.equals(userId) })
  return isOwner || canRead
};

EventSchema.methods.belongsTo = function(userId) {
  return this.owner && this.owner.equals(userId);
};


module.exports = mongoose.model('Event', EventSchema, "events");