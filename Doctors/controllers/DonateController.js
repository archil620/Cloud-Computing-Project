const Donate		= require('./../models').Donate;
var moment 			= require('moment');
const axios			= require('axios');

const Index = async function(req, res){
	let donations, userId = req.user.id;
	[err, donations] = await to(getAllDonates({
		status: 0
	}));
	if (err) return ReE(res, {message: err.message});
	
	return res.render('pending', {donations: donations,  linkLabel: 'Pending Donations'});
}
module.exports.Index = Index

const Get = async function(req, res){
	let donation, userId = req.user.id;
	[err, donation] = await to(Donate.findById(req.params.id));
	if (err) return res.render('error', {message: err.message});
	
	let userInfo = JSON.parse(donation.customField1);
	let checkInfo = JSON.parse(donation.customField2);
	let viewVal = Object.assign(userInfo, donation.dataValues);
	viewVal.checkInfo = checkInfo;

	return res.render('view', viewVal);
}
module.exports.Get = Get

const Checked = async function(req, res){
	let donations, userId = req.user.id;
	[err, donations] = await to(getAllDonates({
			userId: userId,
			status: 1
		}));
	if (err) return ReE(res, {message: err.message});
	
	return res.render('pending', {donations: donations, linkLabel: 'Checking Donations'});	
}
module.exports.Checked = Checked

const PostCheckbody = async function(req, res){
	let donation, id = req.body.id;
	[err, donation] = await to(Donate.findById(id));
	if (err) return ReE(res, {message: err.message});
	
	//send request to body check service

	//notify requested bodycheck to blood bank system
	[err, response] = await to(axios.post(`${CONFIG.bb_host}/api/requestedcheckbody`, {appId: donation.appId}));
	if (err) return ReE(res, {message: err.message});
	if (!response.data.success) return ReE(res, {message: err.message});
	
	[err, donate] = await to(donation.updateAttributes({
		userId: req.user.id,
		status: 1
	}));
	return ReS(res, {message: 'Successful sent body check request'});	
}
module.exports.PostCheckbody = PostCheckbody

const Approved = async function(req, res){
	let donations, userId = req.user.id;
	[err, donations] = await to(getAllDonates({
			userId: userId,
			status: 2
		}));
	if (err) return ReE(res, {message: err.message});
	
	return res.render('pending', {donations: donations,  linkLabel: 'Approving Donations'});
}
module.exports.Approved = Approved

const PostApproved = async function(req, res){
	let donation, response, id = req.body.id;
	[err, donation] = await to(Donate.findById(id));
	if (err) return ReE(res, {message: err.message});
	if (!donation) return ReE(res, {message: 'The donations is not'});

	[err, response] = await to(axios.post(`${CONFIG.bb_host}/api/approved`, {appId: donation.appId}));
	if (err) return ReE(res, {message: err.message});
	await to(donation.updateAttributes({
		userId: req.user.id,
		status: 3,
		customField4: moment().format("YYYY-MM-DD")
	}));

	return ReS(res, { message: 'Successfull Approved!'});
}
module.exports.PostApproved = PostApproved

const ApprovedCheckbody = async function(req, res){
	let donation, checkedDonation = req.body.donation;
	[err, donation] = await to(Donate.findOne({
		where: {appId: checkedDonation.appId}
	}));
	if (err) return ReE(res, {message: err.message});
	if (!donation) return ReE(res, {message: 'The donations is not'});

	delete checkedDonation['customField1'];
	delete checkedDonation['customField2'];
	delete checkedDonation['customField3'];
	delete checkedDonation['customField4'];
	delete checkedDonation['customField5'];

	await to(donation.updateAttributes({
		status: 2,
		customField2: JSON.stringify(checkedDonation),
		customField3: moment().format("YYYY-MM-DD")
	}));

	return ReS(res, { message: 'Successfull Approved!'});
}
module.exports.ApprovedCheckbody = ApprovedCheckbody

const Finished = async function(req, res){
	let donations, userId = req.user.id;
	[err, donations] = await to(getAllDonates({
			userId: userId,
			status: 3
		}));
	if (err) return ReE(res, {message: err.message});
	
	return res.render('pending', {donations: donations,  linkLabel: 'Finished Donations'});
}
module.exports.Finished = Finished

const Create = async function(req, res){
	let donate, user = req.user;
	
	var info = req.body;
	if (!info) return ReE(res, {message: 'Please fill form data'}, 200);	
	var donateInfo = {
		appId: info.appId,
		asking: info.asking,
		needle: info.needle,
		donor: info.donor,
		donationDate    : info.donationDate,
		share: info.share,
		status: 0,
		customField1: JSON.stringify(info.donate)
	};

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
				var donate = JSON.parse(donationModel.dataValues.customField1);
				var row = {					
					id: donationModel.dataValues.id,
					status: donationModel.dataValues.status,
					donateType: donate.donateType=="BL"? "Blood": donate.donateType=="TI"? "Tissues": "Organs",
					createdAt: moment(donationModel.dataValues.createdAt).format("YYYY/MM/DD"),
					checkedAt: donationModel.dataValues.customField3,
					approvedAt: donationModel.dataValues.customField4
				}
				results.push(row);
			});
			resolve(results);
		}		
	});	
}
module.exports.getAllDonates = getAllDonates;