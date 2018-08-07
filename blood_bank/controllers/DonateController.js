const Donate		= require('./../models').Donate;
var moment 			= require('moment');
const DoctorService 	= require('../services/DoctorService');
const axios			= require('axios');

const Index = async function(req, res){
	let donations, userId = req.user.id;
	[err, donations] = await to(getAllDonates({
			userId: userId,
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
	
	return res.render('view', {baseinfo: donation.dataValues, askedinfo: JSON.parse(donation.customField1), checkbodyinfo: JSON.parse(donation.customField2)});
}
module.exports.Get = Get

const Submitted = async function(req, res){
	let donations, userId = req.user.id;
	[err, donations] = await to(getAllDonates({
			userId: userId,
			status: 1
		}));
	if (err) return ReE(res, {message: err.message});
	
	return res.render('pending', {donations: donations, linkLabel: 'Checking Donations'});	
}
module.exports.Submitted = Submitted

const Checked = async function(req, res){
	let donations, userId = req.user.id;
	[err, donations] = await to(getAllDonates({
			userId: userId,
			status: 2
		}));
	if (err) return ReE(res, {message: err.message});
	
	return res.render('pending', {donations: donations, linkLabel: 'Checking Donations'});	
}
module.exports.Checked = Checked

const Approved = async function(req, res){
	let donations, userId = req.user.id;
	[err, donations] = await to(getAllDonates({
			userId: userId,
			status: 3
		}));
	if (err) return ReE(res, {message: err.message});
	
	return res.render('pending', {donations: donations,  linkLabel: 'Approving Donations'});
}
module.exports.Approved = Approved

const ApprovedDonate = async function(req, res){
	let donation, id = req.body.appId;
	[err, donation] = await to(Donate.findById(id));
	if (err) return ReE(res, {message: err.message});

	await to(donation.updateAttributes({
		status: 4,
		customField4: moment().format('YYYY-MM-DD')
	}));
	return ReS(res, {message: 'Successfully handshake'});
}
module.exports.ApprovedDonate = ApprovedDonate

const Finished = async function(req, res){
	let donations, userId = req.user.id;
	[err, donations] = await to(getAllDonates({
			userId: userId,
			status: 4
		}));
	if (err) return ReE(res, {message: err.message});
	
	return res.render('pending', {donations: donations,  linkLabel: 'Finished Donations'});
}
module.exports.Finished = Finished

const Create = async function(req, res){
	let donate, user = req.user;
	
	var donateInfo = req.body;
	if (!donateInfo) return ReE(res, {message: 'Please fill form data'});
	donateInfo.userId = user.id;
	donateInfo.status = 0;

	[err, donate] = await to(Donate.create(donateInfo));
	if (err) return res.render('error', {message: err.message});
	return res.redirect('/donate');
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

const SendToDoctor = async function(req, res){
	let donate, doctor, user = req.user;
	
	var info = req.body;
	if (!info) return ReE(res, {message: 'Please fill form data'});
	[err, donate] = await to(Donate.findById(info.appId));
	if (err) return res.render('error', {message: err.message});
	if (!donate) return res.render('error', {message: 'Please select correct donation!'});
	
	info.donate = donate.dataValues;	
	[err, doctor] = await to(axios.post(`${CONFIG.dr_host}/api/create`, info));
	if (err) return res.render('error', {message: err.message});
	
	await to(donate.updateAttributes({
		status: 1,
		customField1: JSON.stringify(req.body)
	}));	
	return res.redirect('/submitted');
}
module.exports.SendToDoctor = SendToDoctor

/** requested checkbody */
const RequestedCheckBody = async function(req, res) {
	let donation, id = req.body.appId;
	[err, donation] = await to(Donate.findById(id));
	if (err) return ReE(res, {message: err.message});

	await to(donation.updateAttributes({
		status: 2,
	}));
	return ReS(res, {message: 'Successfully handshake'});
}
module.exports.RequestedCheckBody = RequestedCheckBody

const SendToCheckBody = async function(req, res){
	let donate, doctor, original_info;
	
	var info = req.body;
	if (!info) return ReE(res, {message: 'Please fill form data'});
	[err, donate] = await to(Donate.findById(info.appId));
	if (err) return res.render('error', {message: err.message});
	if (!donate) return res.render('error', {message: 'Please select correct donation!'});	
	var newDonate = donate.dataValues;
	delete newDonate['customField1'];
	delete newDonate['customField2'];
	delete newDonate['customField3'];
	delete newDonate['customField4'];
	delete newDonate['customField5'];

	[err, doctor] = await to(axios.post(`${CONFIG.cb_host}/api/create`, {info: info, donate: newDonate}));
	if (err) return res.render('error', {message: err.message});
	
	await to(donate.updateAttributes({
		status: 3,
		customField2: JSON.stringify(info),
		customField3: moment().format("YYYY-MM-DD")
	}));	
	return res.redirect('/approving');
}
module.exports.SendToCheckBody = SendToCheckBody