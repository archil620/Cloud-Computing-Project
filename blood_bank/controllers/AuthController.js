const GetLoginPage = function(req, res){
	let message = req.flash('loginMessage');
	res.render('login');
}
module.exports.GetLoginPage = GetLoginPage