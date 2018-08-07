const DonateController		= require('./DonateController');
const Dashboard = async function(req, res){
	let userId = req.user.id;
	let donations;
	[err, donations] = await to(DonateController.getAllDonates({userId: userId}));
	
	if (err) return res.render('err', {message: err.message});
	return res.render('index', {donations: donations});
}
module.exports.Dashboard = Dashboard

const Logout = async function(req, res){
	req.logout();
	return res.redirect("/login");
}
module.exports.Logout = Logout