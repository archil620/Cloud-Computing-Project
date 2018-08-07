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
  res.redirect('/login');
});

/************ local-login  *************/
router.get(     '/login',                  AuthController.GetLoginPage);
router.get(     '/dashboard', isLoggedIn,  HomeController.Dashboard);
router.get(     '/logout', isLoggedIn,  HomeController.Logout);

router.get(     '/donate',   isLoggedIn,  DonateController.Index);
router.get(     '/donate/:id',   isLoggedIn,  DonateController.Get);
router.post(	'/donate', 		isLoggedIn, DonateController.Create);

router.get(     '/checking',   isLoggedIn,  DonateController.Checked);
router.get(     '/approving',   isLoggedIn,  DonateController.Approved);
router.get(     '/finishing',   isLoggedIn,  DonateController.Finished);
/**************************** google authentication***************************/
router.get('/auth/google', passport.authenticate('google', {scope : ['profile', 'email']}))
router.get('/auth/google/callback', passport.authenticate('google', {
	successRedirect : '/dashboard',
	failureRedirect : '/login'
}));

/************ local-login  *************/
router.post(     '/api/create',             DonateController.Create);
router.post(     '/api/approved',           DonateController.PostApproved);
router.post(     '/api/checkbody',          DonateController.PostCheckbody);
router.post(     '/api/approvedcheckbody',  DonateController.ApprovedCheckbody);

module.exports = router;
