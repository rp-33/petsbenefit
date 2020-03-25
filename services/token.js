'use strict';

global.config = require('../config');
	let jwt = require('jwt-simple'),
  	   moment = require('moment');

exports.create = (user,days) => {
    let payload = {
        sub : user._id, // id del usuario
        iat : moment().unix(), //momento que se ha creado el token
        exp : moment().add(days,'days').unix() //momento que sera expirado el token
    };
    return jwt.encode(payload,global.config.token.secret)
};//crea el token del usuario con una fecha de expiracion 

exports.decode = token => {
    
    let decode = new Promise( ( resolve , reject ) =>{
        try{
            const payload = jwt.decode(token,global.config.token.secret);
            if(payload.exp < moment().unix()) {
                    reject({
                        status : 403,
                        message : 'El token ha expirado'
                    });
            }

            resolve({
                status : 200,
                id : payload.sub
            });		
        }catch(err) {
            reject({
                status : 500,
                message : 'Token invalido'
            })
        }
    })

    return decode;

    
};//decodifica el toquen para validar si tiene autorizacion o no

