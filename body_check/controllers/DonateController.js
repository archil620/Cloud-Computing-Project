const Donate		= require('./../models').Donate;
var moment 			= require('moment');
const axios			= require('axios');

const Index = async function(req, res){
	let donations;
	[err, donations] = await to(getAllDonates({
		status: 0
	}));
	if (err) return ReE(res, {message: err.message});
	
	return res.render('pending', {donations: donations,  linkLabel: 'Pending Donations'});
}
module.exports.Index = Index

const Get = async function(req, res){
	let donation;
	[err, donation] = await to(Donate.findById(req.params.id));
	if (err) return res.render('error', {message: err.message});
	
	let userInfo = JSON.parse(donation.customField1);
	let viewVal = Object.assign(userInfo, donation.dataValues);
	return res.render('view', viewVal);
}
module.exports.Get = Get

const Checked = async function(req, res){
	let donations;
	[err, donations] = await to(getAllDonates({
			status: 1
		}));
	if (err) return ReE(res, {message: err.message});
	
	return res.render('pending', {donations: donations, linkLabel: 'Checking Donations'});	
}
module.exports.Checked = Checked

const PostApproved = async function(req, res){
	let donation, id = req.body.id;
	[err, donation] = await to(Donate.findById(id));
	if (err) return ReE(res, {message: err.message});
	
	//notify approved bodycheck to doctor system
	[err, response] = await to(axios.post(`${CONFIG.dr_host}/api/approvedcheckbody`, {donation: donation}));
	if (err) return ReE(res, {message: err.message});
	if (!response.data.success) return ReE(res, {message: response.data.error}, 200);	
	
	await to(donation.updateAttributes({
		status: 1,
		customField2: moment().format("YYYY-MM-DD")
	}));
	return ReS(res, {message: 'Successful sent body check request'});	
}
module.exports.PostApproved = PostApproved

const Finished = async function(req, res){
	let donations;
	[err, donations] = await to(getAllDonates({
			status: 1
		}));
	if (err) return ReE(res, {message: err.message});
	
	return res.render('pending', {donations: donations,  linkLabel: 'Finished Donations'});
}
module.exports.Finished = Finished

const Create = async function(req, res){
	let donate, user = req.user;
	
	var info = req.body;
	if (!info) return ReE(res, {message: 'Please fill form data'}, 200);	
	var donateInfo = req.body.info;
	donateInfo.customField1 = JSON.stringify(req.body.donate);

	[err, donate] = await to(Donate.create(donateInfo));
	if (err) return ReE(res, {message: err.message});
	return ReS(res, {data: donate});
}
module.exports.Create = Create

const getAllDonates = function(where) {
	return new Promise(async function(resolve, reject) {
		let donations;
		[err, donations] = await to(Donate.findAll({
			where: where,
			order: [
				['created_dt', 'DESC'],
				['status', 'DESC']
			]
		}));
		if (err) reject(err);
		else {
			let results = [];
			donations.map(donationModel => {
				var row = {
					id: donationModel.dataValues.id,
					status: donationModel.dataValues.status,
					donateType: donationModel.dataValues.donateType=="BL"? "Blood": donationModel.dataValues.donateType=="TI"? "Tissues": "Organs",
					createdAt: moment(donationModel.dataValues.createdAt).format("YYYY/MM/DD"),
					checkedAt: donationModel.dataValues.customField2					
				}
				results.push(row);
			});
			resolve(results);
		}		
	});	
}
module.exports.getAllDonates = getAllDonates;