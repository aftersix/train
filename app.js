var express = require('express');
//var routes = require('./routes');

var http = require('http');
var path = require('path');

var app = express();

app.set('port',process.env.PORT || 8000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

var predictions = require('./routes/predictions');

app.get('/',predictions.predictions);

var train = require('./routes/train');
app.get('/trains', train.predictions);

var about = require('./routes/about');
app.get('/about', about.about);


var predictions = require('./routes/predictions');
app.get('/predictions', predictions.predictions);

http.createServer(app).listen(app.get('port'), function(){
console.log('Express server listening on port ' + app.get('port'));
});