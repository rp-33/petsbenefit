'use strict';

let cloudinary = require('../configuration/cloudinary');

exports.create = async(file) => {
    try
    {
    	let image = await cloudinary.v2.uploader.upload(file); 
    	return image.secure_url;
    }
    catch(err)
    {

    }
    
};//decodifica el toquen para validar si tiene autorizacion o no
