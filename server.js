let app = require('./app');
require('./configuration/db.js');
let server = require('http').createServer(app);

server.listen(app.get('port'), () => {
	console.log('port ' + app.get('port'));
});