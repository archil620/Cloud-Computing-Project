const express 			= require('express');
const router 			= express.Router();

const AuthController 	= require('./../controllers/AuthController');
const HomeController 	= require('./../controllers/HomeController');
const DonateController 	= require('../controllers/DonateController');
const passport      	= require('passport');

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

router.get(     '/donate',   isLoggedIn,  DonateController.Index);			//status=0
router.get(     '/donate/:id',   isLoggedIn,  DonateController.Get);
router.post(	'/donate', 		isLoggedIn, DonateController.Create);

router.get(     '/submitted',   isLoggedIn,  DonateController.Submitted);	//status=1		received checkbody status from doctors service
router.get(     '/checking',   isLoggedIn,  DonateController.Checked);		//status=2		submitted to checkbody then status=3
router.get(     '/approving',   isLoggedIn,  DonateController.Approved);	//status=3
router.get(     '/finishing',   isLoggedIn,  DonateController.Finished);	//status=4
/**************************** google authentication***************************/
router.get('/auth/google', passport.authenticate('google', {scope : ['profile', 'email']}))
router.get('/auth/google/callback', passport.authenticate('google', {
	successRedirect : '/dashboard',
	failureRedirect : '/login'
}));

router.post(	'/to/doctor', 		isLoggedIn, DonateController.SendToDoctor);
router.post(	'/to/checkbody', 		isLoggedIn, DonateController.SendToCheckBody);
router.post(	'/api/approved',	DonateController.ApprovedDonate);
router.post(	'/api/requestedcheckbody',	DonateController.RequestedCheckBody);

module.exports = router;
