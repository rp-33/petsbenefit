'use strict';

let cloudinary = require('cloudinary');

cloudinary.config({
    cloud_name : global.config.cloudinary.name,
    api_key : global.config.cloudinary.key,
    api_secret : global.config.cloudinary.secret
})

module.exports =  cloudinary;