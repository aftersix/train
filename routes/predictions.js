var Sugar = require('sugar');
var request = require('request');

console.log("start");


exports.predictions = function(req,res) {

var salemSchedule = {table: [] };
var trainAlerts = {table: []};




	var salemPromise = new Promise((resolve, reject) => {
		request({
		url: 'https://api-v3.mbta.com//predictions?filter[stop]=Salem',
		json: true
		},


		 function (error, response, jsonObject) {
		  if (!error && response.statusCode == 200) {
			 try {
				 		for (var i=0; i<jsonObject['data'].length; i++){

						console.log(jsonObject);
						//var obLength = jsonObject.length;
						//console.log(obLength);
						console.log("...");
						//console.log(jsonObject['data'][0]);
						var data = jsonObject['data'][i];
						console.log("...");
						console.log(data['attributes'].arrival_time);
						console.log(data['attributes'].direction_id);
						var att = data['attributes'];
						console.log("++++");
						var arrival = att.arrival_time;
						console.log(arrival);
						//var obLength = jsonObject['data'].length;
						//console.log(obLength);
						console.log("=======");
						var newArrivalTime = arrival;
						newArrivalTime = Sugar.Date.create(newArrivalTime);
						console.log(newArrivalTime);
						var timeLeft = (newArrivalTime - Sugar.Date.create())/1000;
						newArrivalTime = Sugar.Date.format(newArrivalTime	,  '{hh}:{mm}')

						console.log(timeLeft);
						salemSchedule.table.push({train_direction: data['attributes'].direction_id, predictedTime: newArrivalTime, timeLeft: timeLeft});
					}

				} catch(err){console.log("error");}
		  }
			console.log("+=+=+=");
			console.log(salemSchedule);
		 resolve();
		});
    });

		var alertPromise = new Promise((resolve, reject) => {
			request({
			url: 'https://api-v3.mbta.com//alerts?filter[stop]=Salem',
			json: true
			},

			function (error, response, trainAlert) {
				if (!error && response.statusCode == 200) {
					for (var i=0; i<trainAlert['data'].length; i++){

						//console.log("train alert"+i);
						//console.log(trainAlert['data'][i]);
						data = trainAlert['data'][i];
						var header = data['attributes'].header;
						console.log(header);
						trainAlerts.table.push({header: header});
					 }
				}
				console.log("+=+=+=");
				console.log (trainAlerts);
			resolve();
			});
		});

		Promise.all([salemPromise, alertPromise]).then(values => {
			res.render('predictions', {title:'Train Times - BETA' , salemSchedule:salemSchedule , trainAlerts:trainAlerts});
				});



    };
