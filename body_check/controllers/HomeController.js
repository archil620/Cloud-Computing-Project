const DonateController		= require('./DonateController');
const Dashboard = async function(req, res){	
	let donations;
	[err, donations] = await to(DonateController.getAllDonates({}));
	
	if (err) return res.render('err', {message: err.message});
	return res.render('index', {donations: donations});
}
module.exports.Dashboard = Dashboard