'use strict';

let mongoose = require('mongoose'),
	  Schema = mongoose.Schema,
    moment = require('moment');

let clientSchema =  new Schema({
  type: Schema.ObjectId
})

let messagesSchema = new Schema({
  time :{
    type : Number,
    default : moment().unix()
  },
  status : {
    type : String,
    enum : ['sent','received','seen'],
    default : 'sent'
  },
  type : {
    type : String,
    enum : ['text','image','audio']
  },
  text : {
    type : String
  },
  sender: { 
    type: Schema.ObjectId, 
    ref: "User" 
  },
  receiver : {
    type: Schema.ObjectId, 
    ref: "User"
  },
  image : {
    type : String
  },
  audio : {
    type : String
  }
})


let matchSchema = new Schema({
  clients :  {
    type : Array,
    user : { type: Schema.ObjectId, ref: "User" }
  },
  message : [messagesSchema]
})


module.exports = mongoose.model('Match',matchSchema);