const env = require('dotenv');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);
const moment = require('moment-timezone');
const cookieParser = require('cookie-parser');
const util = require('./util/util.js');

// loads .env variables
env.config();

// set the default port to 3000
// const port = process.env.PORT || 3000;
// const ip = process.env.IP || '127.0.0.1';

// set the template engine
//app.set('view engine', 'ejs');

// TODO: Make somehow conditional

// handle authentication
app.use(session({
	secret: 'supersecretsecret',
	name: 'gthubcookie',
	store: new MemoryStore({
		checkPeriod: 86400000
	}),
	//proxy: true,
	resave: false,
	saveUninitialized: false
}));

// get all data/stuff of the body (POST) parameters
// parse application/json
app.use(bodyParser.json());

// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride('X-HTTP-Method-Override'));

// NOTE: use the static-directory instead
// set the static files location /public/img will be /img for users
//app.use(express.static(__dirname + '/public'));

// enable cookie-handling
app.use(cookieParser());

// routes
// need to set this to have the same api in test-env
const index = require('./routes/index');
if (process.env.NODE_ENV !== 'test')
	app.use('/', index);
else
	app.use('/api', index);

// allow Moment.js to be accessible from within EJS templates
app.locals.moment = moment;

// integrate with Nuxt, but run it without in test-env
if (process.env.NODE_ENV !== 'test') {
	module.exports = {
		path: '/api',
		handler: app
	};
} else {
	let port;
	if (process.env.NODE_ENV === 'test')
		port = process.env.TESTPORT || 3001;
	else
		port = process.env.PORT || 3000;
	const ip = process.env.IP || '127.0.0.1';
	const server = app.listen(port, ip, () => {
		util.print('Server running on ' + ip + ':' + port);
	});

	module.exports = server;
}
