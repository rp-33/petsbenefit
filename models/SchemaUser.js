'use strict';

let mongoose = require('mongoose'),
 	  bcrypt = require('bcrypt-nodejs'),
	  Schema = mongoose.Schema;

let userSchema = new Schema({
	displayName:{
		type:String,
		lowercase: true
	},
	email :{
		type:String,
		unique:true,
		lowercase: true,
		required:[true, '{PATH} es obligatorio.']
	},
	password:{
		type:String,
		required:[true, '{PATH} es obligatorio.']
	},
	avatar:{
		type:String
	},
	sex: {
		type : String,
		lowercase :  true,
		emun : ['male','female']
	},
	distance :{ 
		type: Number,
		default : 50
  },
  notifications : {
    type : Boolean,
  	default : true
  },
  geo: {
    type: [Number], 
    index: '2d'
  },
  stateApp:{
    type:String,
    default : 'active',
    enum: ['active','background','inactive']
  },
  tokenMobile:{
    type:String
  },
  biography : {
    type: String
  },
  hobbies : {
    type:Array,
    lowercase : true
  },
  pictures : {
    type : Array
  },
  families: {
    type: Array
  },
  like : {
    type : Array,
    user : { type: Schema.ObjectId, ref: "User" },
    super : {type:Boolean}
  },
  dislike : {
    type:Array,
    user : { type: Schema.ObjectId, ref: "User" }
  }
})

userSchema.pre('save',function(next){ 

    if (!this.isModified('password')) return next();

    bcrypt.genSalt(10, (err, salt) => {

       if (err) return next(err); 

       bcrypt.hash(this.password,salt,null,(hashError,hash)=>{

        if (hashError) return next(hashError);
        
        this.password = hash;

        next();
        
       });

    });
});



module.exports = mongoose.model('User',userSchema);