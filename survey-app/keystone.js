// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require('dotenv').config();

// Require keystone
var keystone = require('keystone');
var social = require('keystone-social-login');

// Initialise Keystone with your project's configuration.
// See http://keystonejs.com/guide/config for available options
// and documentation.

keystone.init({
	'name': 'BCAT',
	'brand': 'BCAT',

	'stylus': 'public',
	'static': 'public',
	'favicon': 'public/favicon.ico',
	'views': 'templates/views',
	'view engine': 'pug',

	'auto update': true,
	'session': true,
	'auth': true,
	'user model': 'User',
});

social.config({
	keystone: keystone,
	'signin url': `${process.env.SERVER_URL}/signup/social`,
	'auto create user': true,
	onAuthenticate: function (accessToken, refreshToken, profile, cb) {
        User.findOrCreate({ githubId: profile.id }, function (err, user) {
            return cb(err, user);
        });
    },
	providers: {
		google: {
			clientID: 'your-client-id',
			clientSecret: 'your-client-secret'
		},
		github: {
			clientID: process.env.GITHUB_CLIENT_ID,
			clientSecret: process.env.GITHUB_CLIENT_SECRET
		}
	}
});

// Load your project's Models
keystone.import('models');

// Setup common locals for your templates. The following are required for the
// bundled templates and layouts. Any runtime locals (that should be set uniquely
// for each request) should be added to ./routes/middleware.js
keystone.set('locals', {
	_: require('lodash'),
	env: keystone.get('env'),
	utils: keystone.utils,
	editable: keystone.content.editable,
});

// Load your project's Routes
keystone.set('routes', require('./routes'));

// Set login image
keystone.set('signin logo', '../images/BCATlogo.svg');
keystone.set('signin redirect', '/home');
keystone.set('signout redirect', '/');

// Configure the navigation bar in Keystone's Admin UI
keystone.set('nav', {
	users: ['users', 'teams'],
	modules: ['modules', 'ModulePath'],
});

// Start Keystone to connect to your database and initialise the web server


social.start();
keystone.start();
