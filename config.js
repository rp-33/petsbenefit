var config = {
	server:{
		port : process.env.PORT || 8888
	},
 	db:{
 		port: process.env.MONGODB_URI || 'mongodb://localhost/petsbenefits'
 	},
 	token :{
 		secret : 'petsbenefits'
 	},
 	cloudinary : {
		name : 'kbernal',
		key : '539411141286339',
		secret : '2kD9E3gbgSErF4zDlb_Jz1lPDbA'
	},
	mailgun : {
		domain: "mg.cuponapp.com",
		apiKey: "key-54a1be463d37bce3adf31f26e8bf52c2"
	}
};

module.exports = config;
