var Sugar = require('sugar');
var request = require('request');

exports.predictions = function(req,res) {

var salemSchedule = {table: [] };
var trainAlerts = {table: [] };
var predictionURL = 'https://api-v3.mbta.com//predictions?filter[stop]=Salem';
var alertURL = 'https://api-v3.mbta.com//alerts?filter[stop]=Salem';


	var salemPromise = new Promise((resolve, reject) => {
		request({
		url: predictionURL,
		json: true
		},


		 function (error, response, jsonObject) {
		  if (!error && response.statusCode == 200) {
			 try {
				 		for (var i=0; i<jsonObject['data'].length; i++){
						var data = jsonObject['data'][i];
						var att = data['attributes'];
						var arrival = att.arrival_time;
						var newArrivalTime = arrival;
						newArrivalTime = Sugar.Date.create(newArrivalTime);
						var timeLeft = (newArrivalTime - Sugar.Date.create())/1000;
						newArrivalTime = Sugar.Date.format(newArrivalTime	,  '{hh}:{mm}')
						salemSchedule.table.push({train_direction: data['attributes'].direction_id, predictedTime: newArrivalTime, timeLeft: timeLeft});
					}

				} catch(err){console.log("error");}
		  }

		 resolve();
		});
    });

		var alertPromise = new Promise((resolve, reject) => {
			request({
			url: alertURL,
			json: true
			},

			function (error, response, trainAlert) {
				if (!error && response.statusCode == 200) {
					for (var i=0; i<trainAlert['data'].length; i++){
						data = trainAlert['data'][i];
						var header = data['attributes'].header;
						trainAlerts.table.push({header: header});
					 }
				}
			resolve();
			});
		});

		Promise.all([salemPromise, alertPromise]).then(values => {
			res.render('predictions', {title:'Train Times - BETA' , salemSchedule:salemSchedule , trainAlerts:trainAlerts});
				});



    };
