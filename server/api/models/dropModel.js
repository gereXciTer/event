'use strict'
var mongoose = require('mongoose');
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

DropSchema.methods.belongsTo = function(userId) {
  return this.owner && this.owner.equals(userId);
};


module.exports = mongoose.model('Drop', DropSchema, "drops");