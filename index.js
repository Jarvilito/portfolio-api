// **** DO NOT USE THIS FILE ****
// **** WE DONT USE THIS ANYMORE ****
// **** IF YOU WILL UPDATE SOMETHING, EVERYTHING SHOULD BE UPDATED INSIDE FUNCTIONS FOLDER ****
// **** TO TEST GO INSTALL FIRST (firebase init emulators) ******
// **** THEN (firebase emulators:start --only functions) ****

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const GithubStrategy = require('passport-github').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const functions = require('firebase-functions');
const keys = require('./functions/config/oauth');
const chalk = require('chalk');
let user = {};

require('dotenv').config();

// Set the baseURL based on environment
const baseURL =
	process.env.NODE_ENV === 'production'
		? 'https://webservice-api-jarvis-portfolio.onrender.com'
		: 'http://localhost:5001';

// Set the local client URL for redirection
const localClientUrl =
	process.env.NODE_ENV === 'production'
		? 'https://jarvis-tech-portfolio.web.app/'
		: 'http://localhost:3000/';

// CORS configuration
const corsOptions = {
	origin:
		process.env.NODE_ENV === 'production'
			? 'https://jarvis-tech-portfolio.web.app'
			: 'http://localhost:3000',
	credentials: true,
};

// Initialize express app
const app = express();
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle preflight requests
app.use(express.json());
app.enable('trust proxy');

// Passport configuration
passport.serializeUser((user, cb) => {
	cb(null, user);
});

passport.deserializeUser((user, cb) => {
	cb(null, user);
});

// Facebook Strategy
passport.use(
	new FacebookStrategy(
		{
			clientID: keys.FACEBOOK.clientID,
			clientSecret: keys.FACEBOOK.clientSecret,
			callbackURL: `${baseURL}/auth/facebook/callback`,
		},
		(accessToken, refreshToken, profile, cb) => {
			const picture = `https://graph.facebook.com/${profile.id}/picture?width=200&height=200&access_token=${accessToken}`;
			user = { ...profile, picture };
			return cb(null, profile);
		}
	)
);

// Github Strategy
passport.use(
	new GithubStrategy(
		{
			clientID: keys.GITHUB.clientID,
			clientSecret: keys.GITHUB.clientSecret,
			callbackURL: `${baseURL}/auth/github/callback`,
		},
		(accessToken, refreshToken, profile, cb) => {
			user = { ...profile };
			return cb(null, profile);
		}
	)
);

// Google Strategy
passport.use(
	new GoogleStrategy(
		{
			clientID: keys.GOOGLE.clientID,
			clientSecret: keys.GOOGLE.clientSecret,
			callbackURL: `${baseURL}/auth/google/callback`,
		},
		(accessToken, refreshToken, profile, cb) => {
			const picture = profile.photos
				? profile.photos[0].value
				: '/img/faces/unknown-user-pic.jpg';
			user = { ...profile, picture };
			return cb(null, profile);
		}
	)
);

// Initialize Passport middleware
app.use(passport.initialize());
app.use(passport.session()); // Use sessions if needed

// Routes for authentication
app.get('/auth/facebook', passport.authenticate('facebook'));
app.get(
	'/auth/facebook/callback',
	passport.authenticate('facebook'),
	(req, res) => {
		res.redirect(localClientUrl);
	}
);

app.get('/auth/github', passport.authenticate('github'));
app.get(
	'/auth/github/callback',
	passport.authenticate('github'),
	(req, res) => {
		res.redirect(localClientUrl);
	}
);

app.get(
	'/auth/google',
	passport.authenticate('google', { scope: ['profile', 'email'] })
);
app.get(
	'/auth/google/callback',
	passport.authenticate('google'),
	(req, res) => {
		res.redirect(localClientUrl);
	}
);

// Route to get user data
app.get('/user', (req, res) => {
	res.send(user);
	user = {}; // Clear user after sending
});

// Route to log out
app.get('/auth/logout', (req, res) => {
	user = {}; // Clear user data
	res.json('Log out success.');
});

// MongoDB connection setup
const uri =
	'mongodb+srv://Admin:boGfE8g7gRNVH435@cluster0.r4qlg.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(uri, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.once('open', () => {
	console.log('MongoDB database connection established successfully');
});

// Routers for different routes
const exercisesRouter = require('./routes/exercises');
const usersRouter = require('./routes/users');
const skillsRouter = require('./routes/skills');
const timelineRouter = require('./routes/timelines');
const commentsRouter = require('./routes/comments');
const replyRouter = require('./routes/reply');

app.use('/exercises', exercisesRouter);
app.use('/users', usersRouter);
app.use('/skills', skillsRouter);
app.use('/timelines', timelineRouter);
app.use('/comments', commentsRouter);
app.use('/reply', replyRouter);

// Production setup for serving frontend
if (process.env.NODE_ENV === 'production') {
	app.use(express.static(path.join(__dirname, '../build')));
	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, '../build', 'index.html'));
	});
}

// Start the server
const port = 3003;
app.listen(port, () => {
	console.log(`Server is running on port: ${port}`);
});

exports.api = functions.https.onRequest(app);
