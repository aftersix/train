var Sugar = require('sugar');
var request = require('request');

console.log("start");

//exports.predictions = function(req,res) {

var salemSchedule = {table: [] };


	var salemPromise = new Promise((resolve, reject) => {
		request({
		url: 'https://api-v3.mbta.com//predictions?filter[stop]=Salem',
		json: true
		},

		 function (error, response, jsonObject) {
		  if (!error && response.statusCode == 200) {
			 try {
					console.log(jsonObject);
					//var obLength = jsonObject.length;
					//console.log(obLength);
					console.log("...");
					//console.log(jsonObject['data'][0]);
					var data = jsonObject['data'][0];
					console.log("...");
					console.log(data['attributes']);
					var attributes = data['attributes'];
					consolde.log("++++");
					console.log(attributes);
					//var obLength = jsonObject['data'].length;
					//console.log(obLength);
					console.log(data['status']);
					console.log("test");
				} catch(err){console.log("error");}
		  }
		 resolve();
		});
    });


  //  };
