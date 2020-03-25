'use strict';

let User = require('../models/SchemaUser'),
    Match = require('../models/SchemaMatch'),
    token = require('../services/token'),
    image = require('../services/image'),
  bcrypt = require('bcrypt-nodejs'),
  moment = require('moment');

module.exports = {

	verifiedEmail : async(req,res)=>{
		try
		{
			let person = await User.findOne({email:req.query.email.toLocaleLowerCase()},{_id:true,email:true});
			if(person) return res.status(400).send({error:'Email already exists'});
			res.status(204).send();
		}
		catch(err)
		{
			res.status(500).send({error:'Server Error'});
		}
	},
	signup :  async (req,res)=>{
		try
		{

			let {
                email,
                displayName,
                password,
                sex
			} = req.body;
			
			let person = await User.findOne({email:email.toLocaleLowerCase()},{email:true});

            if(person) return res.status(400).send({error:'Email already exists'});
            
            let newImage = await image.create(req.file.path);       

			person = new User({
				email: email.toLocaleLowerCase(),
				password: password.toLocaleLowerCase(),
                displayName : displayName,
                avatar : newImage,
                sex: sex
			})

			await person.save();

			res.status(201).send({
                _id: person._id,
            	token : token.create(person,360),
                email : person.email,
                displayName : person.displayName,
                avatar : person.avatar,
                distance : person.distance,
                notifications : person.notifications,
                sex : person.sex,
                pictures : person.pictures,
                hobbies : person.hobbies,
                families : person.families,
                biography : person.biography,
                isAuthenticated : true
           	})
        }
        catch(err)
        {
        	res.status(500).send({error:'Server Error'});
        }
    },
    login : async(req,res)=>{

    	const {
    		email,
    		password
    	} = req.body;

    	const person = await User.findOne({"email" : email.toLocaleLowerCase()});

        if(!person) return res.status(401).send({error:'Email incorrect'});

        if(!bcrypt.compareSync(password.toLocaleLowerCase(),person.password)) return res.status(403).send({error:'password invalid'});

        res.status(200).send({
            _id: person._id,
           	token : token.create(person,360),
            email : person.email,
            displayName : person.displayName,
            avatar : person.avatar,
            distance : person.distance,
            notifications : person.notifications,
            sex : person.sex,
            isAuthenticated : true,
            pictures : person.pictures,
            hobbies : person.hobbies,
            families : person.families,
            biography : person.biography,
        })

    },
    searchUsers : async(req,res)=>{
        try
        {
            let users = await User.find(
                                    { 
                                        $and:[{sex:{$ne:req.query.sex},_id:{$ne:req.user}},{"like.user":{$nin:[req.user]}},{"dislike":{$nin:[req.user]}} ] 
                                    },
                                    {
                                        password:false,
                                        like:false,
                                        dislike:false,
                                        notifications:false,
                                        stateApp:false,
                                        hobbies :{$slice:-3},
                                        pictures : {$slice:-5}
                                    }
                                );
            if(users.length>0) return res.status(200).send(users);
            res.status(204).send();
        }
        catch(err)
        {
            res.status(500).send({error:'Server Error'});
        }
    },
    editAvatar : async (req,res)=>{
        try
        {

            let newImage = await image.create(req.file.path);
            const user = await User.updateOne(
                {_id:req.user},
                {
                    $set:{avatar : newImage},
                    $push:{pictures:req.body.avatar}
                }
            );
            if(user.n > 0 && user.ok > 0) return res.status(201).send({avatar : newImage});
            res.status(400).send({error:'user does not exist'});
        }
        catch(err)
        {
            res.status(500).send({error:'Server Error'});
        }
    },
    saveFamily : async (req,res)=>{
        try
        {
            let newImage = await image.create(req.file.path);
            const user = await User.updateOne({_id:req.user},{$push:{families:newImage}});
            if(user.n > 0 && user.ok > 0) return res.status(201).send({avatar : newImage});
            res.status(400).send({error:'user does not exist'});
        }
        catch(err)
        {
            res.status(500).send({error:'Server Error'});
        }
    },
    editBiography : async (req,res)=>{
        try
        {   
            let {biography} = req.query;
            const user = await User.updateOne({_id:req.user},{$set:{biography:biography}});
            if(user.n > 0 && user.ok > 0) return res.status(201).send();
            res.status(400).send({error:'user does not exist'});
        }
        catch(err)
        {
            res.status(500).send({error:'Server Error'});
        }
    },
    saveHobbie : async (req,res)=>{
        try
        {
            let {hobbie} = req.query;
            hobbie = hobbie.toLocaleLowerCase()
            const user = await User.updateOne({_id:req.user},{$push:{hobbies:hobbie}});
            if(user.n > 0 && user.ok > 0) return res.status(201).send({hobbie:hobbie});
            res.status(400).send({error:'user does not exist'});
        }
        catch(err)
        {
            res.status(500).send({error:'Server Error'});
        }
    },
    deleteHobbie : async (req,res)=>{
        try
        {
            let {hobbie} = req.query;
            hobbie = hobbie.toLocaleLowerCase()
            const user = await User.updateOne({_id:req.user},{$pull:{hobbies:hobbie}});
            if(user.n > 0 && user.ok > 0) return res.status(201).send({hobbie:hobbie});
            res.status(400).send({error:'user does not exist'});
        }
        catch(err)
        {
            res.status(500).send({error:'Server Error'});
        } 
    },
    deletePicture : async (req,res)=>{
        try
        {
            let {picture} = req.query;
            const user = await User.updateOne({_id:req.user},{$pull:{pictures:picture}});
            if(user.n > 0 && user.ok > 0) return res.status(201).send();
            res.status(400).send({error:'user does not exist'});
        }
        catch(err)
        {
            res.status(500).send({error:'Server Error'});
        } 
    },
    deleteFamily : async (req,res)=>{
        try
        {
            let {family} = req.query;
            const user = await User.updateOne({_id:req.user},{$pull:{families:family}});
            if(user.n > 0 && user.ok > 0) return res.status(201).send();
            res.status(400).send({error:'user does not exist'});
        }
        catch(err)
        {
            res.status(500).send({error:'Server Error'});
        } 
    },
    editDisplayName : async (req,res)=>{
        try
        {   
            let {displayName} = req.query;
            const user = await User.updateOne({_id:req.user},{$set:{displayName:displayName}});
            if(user.n > 0 && user.ok > 0) return res.status(201).send();
            res.status(400).send({error:'user does not exist'});
        }
        catch(err)
        {
            res.status(500).send({error:'Server Error'});
        }
    },
    logout : async(req,res)=>{
        try
        {
            let person = await User.findOne({_id:req.user});
            if(!person) return res.status(400).send({error:'user does not exist'});
            res.status(204).send();
        }
        catch(err)
        {
            res.status(500).send({error:'Server Error'});
        }
    },
    editDistance : async (req,res)=>{
        try
        {   
            let {distance} = req.query;
            const user = await User.updateOne({_id:req.user},{$set:{distance:distance}});
            if(user.n > 0 && user.ok > 0) return res.status(201).send();
            res.status(400).send({error:'user does not exist'});
        }
        catch(err)
        {
            res.status(500).send({error:'Server Error'});
        }
    },
    editSex : async (req,res)=>{
        try
        {   
            let {sex} = req.query;
            const user = await User.updateOne({_id:req.user},{$set:{sex:sex}});
            if(user.n > 0 && user.ok > 0) return res.status(201).send();
            res.status(400).send({error:'user does not exist'});
        }
        catch(err)
        {
            res.status(500).send({error:'Server Error'});
        }
    },
    editNotifications : async (req,res)=>{
        try
        {   
            let {notifications} = req.query;
            const user = await User.updateOne({_id:req.user},{$set:{notifications:notifications}});
            if(user.n > 0 && user.ok > 0) return res.status(201).send();
            res.status(400).send({error:'user does not exist'});
        }
        catch(err)
        {
            res.status(500).send({error:'Server Error'});
        }
    },
    editPassword : async (req,res)=>{
        try
        {
            let {password} = req.query;
            const user = await User.updateOne({_id:req.user},{$set:{password: bcrypt.hashSync(password.toLocaleLowerCase())}});
            if(user.n > 0 && user.ok > 0) return res.status(201).send();
            res.status(400).send({error:'user does not exist'});
        }
        catch(err)
        {
            res.status(500).send({error:'Server Error'});
        }
    },
    like : async (req,res)=>{
        try
        {
           let {
            user,
            like
           } = req.query

            const person =  await User.findOne(
                                {
                                    $and:[
                                        {_id:req.user},
                                        {"like.user" : user}
                                    ]
                                }
                        )
         
            await User.updateOne(
                        {
                            _id: user
                        },
                        {
                            $push:{
                                like : {
                                    user : req.user,
                                    like : like
                                }
                               
                            }
                        }
                )

            if(person)
            {

                let match = new Match({
                    clients : [req.user,user]  
                })

                await match.save();
                return res.status(201).send({message:'match'});
            }

            res.status(201).send({message:'like'})

        }
        catch(err)
        {
            res.status(500).send({error:'Server Error'});
        }
    },
    findMatches : async (req,res)=>{
        try
        {
            let {page} = req.query;
            page = parseInt(page);
            
            let skip = page * 10;

            let users = await Match.aggregate([
                    {$match:{clients:req.user}},
                    {$unwind:"$clients"},//desacoplo el array a un json
                    {$match:{clients:{$ne:req.user}}},//filtro al usuario que no soy yo negando $ne
                    { $project: {
                        user: "$clients",
                    }},//muestro los datos que quiero
                    {$facet :{
                        data : [
                            {$skip:skip},
                            {$limit:10}
                        ]
                    }}//paginacion
                ])  
            await User.populate([users[0].data],{path:'user',select:["displayName","avatar"]});
            if(users[0].data.length>0) return res.status(200).send(users[0].data);
            res.status(204).send();
        }
        catch(err)
        {

            res.status(500).send({error:'Server Error'});
        }
    },
    findUser : async (req,res)=>{
        try
        {
            let {
                _id
            }  = req.query;
            let user = await User.findOne({_id},{_id:true,biography:true,family:true,pictures:true,hobbies:true});
            if(user) return res.status(200).send(user);
            res.status(400).send({error:'user does not exist'});
        }
        catch(err)
        {
            res.status(500).send({error:'Server Error'});
        }
    },
    newMessageText : async (req,res)=>{
        try
        {
            let {
                _id,
                text,
                type,
                receiver,
                time
            } = req.query;

            let message = await Match.updateOne({_id},{$push:{
                                                message : {
                                                text,
                                                type,
                                                sender:req.user,
                                                receiver,
                                            }}
                                })
            if(message.n > 0 && message.ok > 0) return res.status(201).send({time:time});
            res.status(400).send({time:time})

        }
        catch(err)
        {
            res.status(500).send({error:'Server Error'});
        }
    }
}