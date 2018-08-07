const express 			= require('express');
const router 			= express.Router();

const AuthController 	= require('./../controllers/AuthController');
const HomeController 	= require('./../controllers/HomeController');
const DonateController 	= require('../controllers/DonateController');

const passport      	= require('passport');
const path              = require('path');
require('../config/config');     //instantiate configuration variables

require('./../middleware/passport')(passport);

/********** check to see if user is authenticated for profile access***********/
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next() // if authenticated then go to next middleware
	res.redirect('/login') // if not authenticated then redirect to home page
}
/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/dashboard');
});

/************ local-login  *************/
router.get(     '/dashboard', HomeController.Dashboard);

router.get(     '/donate',   DonateController.Index);
router.get(     '/donate/:id',   DonateController.Get);

router.get(     '/checked',  DonateController.Finished);
/**************************** google authentication***************************/
router.get('/auth/google', passport.authenticate('google', {scope : ['profile', 'email']}))
router.get('/auth/google/callback', passport.authenticate('google', {
	successRedirect : '/dashboard',
	failureRedirect : '/login'
}));

/************ local-login  *************/
router.post(     '/api/create',             DonateController.Create);
router.post(     '/api/approved',             DonateController.PostApproved);

module.exports = router;
