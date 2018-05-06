'use strict'
var mongoose = require('mongoose');
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
}, { usePushEach: true });

module.exports = mongoose.model('Invite', InviteSchema, "invites");