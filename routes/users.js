'use strict';

const router = require('express-promise-router')(),
      upload =  require('../middlewares/upload'),
        Auth = require('../middlewares/auth');

const {
	verifiedEmail,
	signup,
	login,
	searchUsers,
	editAvatar,
	saveFamily,
	editBiography,
	saveHobbie,
	deleteHobbie,
	deleteFamily,
	deletePicture,
	editDisplayName,
	logout,
	editDistance,
	editSex,
	editNotifications,
	editPassword,
	like,
	findMatches,
	findUser,
	newMessageText
} = require('../controllers/CtrlUser');

/* GET home page. */

router.get('/verifiedEmail',verifiedEmail);

router.get('/searchUsers',Auth,searchUsers);

router.get('/logout',Auth,logout);

router.get('/find/matches',Auth,findMatches);

router.get('/find/user',Auth,findUser);

/* POST home page. */

router.post('/signup',upload.single('file'),signup);

router.post('/login',login);

router.post('/like',Auth,like);

/* PUT home page. */

router.put('/user/edit/avatar',Auth,upload.single('file'),editAvatar);

router.put('/user/saveFamily',Auth,upload.single('file'),saveFamily);

router.put('/user/edit/biography',Auth,editBiography);

router.put('/user/saveHobbie',Auth,saveHobbie);

router.put('/user/deleteHobbie',Auth,deleteHobbie);

router.put('/user/deletePicture',Auth,deletePicture);

router.put('/user/deleteFamily',Auth,deleteFamily);

router.put('/user/edit/displayName',Auth,editDisplayName);

router.put('/user/edit/distance',Auth,editDistance);

router.put('/user/edit/sex',Auth,editSex);

router.put('/user/edit/notifications',Auth,editNotifications);

router.put('/user/edit/password',Auth,editPassword);

router.put('/message/text',Auth,newMessageText);

/* DELETE home page. */


module.exports = router;
