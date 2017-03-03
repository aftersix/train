var Sugar = require('sugar');
var request = require('request');


//var mbtaFeed; //needs to be a universal variable to pass outside of the 





console.log("ran predictions.js");


exports.predictions = function(req,res) {

var salemSchedule = {table: [] };
var trainAlerts;

	var salemPromise = new Promise((resolve, reject) => {
		request({
		url: 'http://realtime.mbta.com/developer/api/v2/predictionsbystop?api_key=wX9NwuHnZU2ToO7GmGR9uw&stop=Salem&format=json',
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
							//console.log(route['direction'][k]['direction_name']);
							for (var l=0; l<direction['trip'].length; l++){
								//console.log(direction['trip'][l]['trip_name']);
								
								direction['trip'][l]['sch_arr_dt'] = Sugar.Date.format(new Date(direction['trip'][l]['sch_arr_dt']*1000),  '{hh}:{mm}');
								//console.log("Scheduled at: " + direction['trip'][l]['sch_arr_dt']);
								direction['trip'][l]['pre_dt'] = Sugar.Date.format(new Date(direction['trip'][l]['pre_dt']*1000),  '{hh}:{mm}');
								
								salemSchedule.table.push({train_direction: route['direction'][k]['direction_name'], train_name: direction['trip'][l]['trip_name'], scheduleTime: direction['trip'][l]['sch_arr_dt'],predictedTime:direction['trip'][l]['pre_dt']});
								//console.log(salemSchedule);
								
								
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
					
					console.log(trainAlert['alerts'][i]['short_header_text']);
				 }  
		  }
		trainAlerts = trainAlert;  
		resolve();
		});
	});
	

	Promise.all([salemPromise, alertPromise]).then(values => { 
	  res.render('predictions', {title:'predictions' , salemSchedule:salemSchedule , trainAlerts:trainAlerts});
	  console.log("ran predictions.js exports module - promise done.");
	});

	
	

};
