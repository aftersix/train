var Sugar = require('sugar');
var request = require('request');

exports.predictions = function(req,res) {


var station = req.param("station");
var url = "http://realtime.mbta.com/developer/api/v2/predictionsbystop?api_key=wX9NwuHnZU2ToO7GmGR9uw&stop="+station+"&format=json"

var salemSchedule = {table: [] };
var trainAlerts;

	var salemPromise = new Promise((resolve, reject) => {
		request({
		url: url,
		json: true
		},

		 function (error, response, jsonObject) {
		  if (!error && response.statusCode == 200) {
			 
				for (var i=0; i<jsonObject['mode'].length; i++){  
					var mode = jsonObject['mode'][i];
					for (var j=0; j<mode['route'].length; j++){
						var route = mode['route'][j];
						for (var k=0; k<route['direction'].length; k++){
							var direction = route['direction'][k];
							for (var l=0; l<direction['trip'].length; l++){
								try {
									var difference = direction['trip'][l]['sch_arr_dt'] - direction['trip'][l]['pre_dt'];
									difference = Math.abs(difference);
									direction['trip'][l]['sch_arr_dt'] = Sugar.Date.format(Sugar.Date.create(direction['trip'][l]['sch_arr_dt']*1000)	,  '{hh}:{mm}');							
									//direction['trip'][l]['pre_dt'] = Sugar.Date.format(Sugar.Date.create(direction['trip'][l]['pre_dt']*1000)	,  '{hh}:{mm}');
									salemSchedule.table.push({train_direction: route['direction'][k]['direction_name'], train_name: direction['trip'][l]['trip_name'], scheduleTime: direction['trip'][l]['sch_arr_dt'],predictedTime:direction['trip'][l]['pre_dt'],difference:difference});
								} catch(err) {}
							}
						}
					}
				  }  
		  }
		 resolve(); 
		});
	  });
	  
	var alertPromise = new Promise((resolve, reject) => {  
		request({
		url: 'http://realtime.mbta.com/developer/api/v2/alertsbyroute?api_key=wX9NwuHnZU2ToO7GmGR9uw&route=CR-Newburyport&include_access_alerts=false&include_service_alerts=true&format=json',
		json: true
		},

		function (error, response, trainAlert) {
		  if (!error && response.statusCode == 200) {
				for (var i=0; i<trainAlert['alerts'].length; i++){  
					
					//console.log(trainAlert['alerts'][i]['short_header_text']);
				 }  
		  }
		trainAlerts = trainAlert;  
		resolve();
		});
	});
	

	Promise.all([salemPromise, alertPromise]).then(values => { 
	  res.render('train', {title:'Train Times' , salemSchedule:salemSchedule , trainAlerts:trainAlerts, station:req.param("station")});
	  	});

	
	

};
