const moment        = require('moment');
const axios         = require('axios');
const Donate          = require('../models').Donate;
const async         = require('async');

const requestApprovedToDoctor = function(data){
    async.waterfall([
        function(callback) {
            axios.post(`${CONFIG.dr_host}/api/create`, data).then(response => {
                if (response.data.success) callback(null, false, response.data);
                else callback(null, true, response.data.message);
            }).catch(error => {
                callback(null, true, error);
            });
        },
        function(err, result, callback) {
            if (err) callback(true, result);
            else {
                let donate;
                Donate.findById(data.appId)
                .then(async (donate) => {
                    await to(donate.updateAttributes({
                        status: 1
                    }));
                    callback(false, donate);
                })
                .catch(err => {
                    callback(true, err);
                });                
            }
        }
    ], function(err, result) {  
        return new Promise((resolve, reject) => {
            if (err) reject(result);
            else resolve(result);
        });
    });   
}
module.exports.requestApprovedToDoctor = requestApprovedToDoctor;
