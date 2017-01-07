var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var fs = require('fs');
var path = require('path');


app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname, '/../public', 'index.html'));
});

app.listen(process.env.PORT || 3000, function() {
    console.log('Server started in the port: ', process.env.PORT || 3000);
});

module.exports = app;
