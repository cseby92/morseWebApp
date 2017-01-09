var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var fs = require('fs');
var path = require('path');
var UserHandler = require('./userhandler');


app.init = function() {
    app.handler = new UserHandler();
};

app.use(bodyParser.urlencoded({ extended: true }));


app.post('/users', function(req, res) {
    if(app.handler.checkIfUserExists(req.body.username)){
        res.status(400).json();
    }else{
        app.handler.addUser(req.body);
        res.status(200).json({
            token : UserHandler.encodeUserName(req.body.username)
        });
    }
});

app.post('/users/:username/messages', function(req, res){

    if(!req.get('X-Auth') || !app.handler.checkIfAuthExists(req.get('X-Auth'))){
        res.status(401).json();

    }
    else if(!app.handler.checkIfUserExists(req.params.username)){
        res.status(404).json();
    }
    else{
        app.handler.addMessage( 
                app.handler.searchUserByAuth(req.get('X-Auth')), 
                req.params.username, 
                req.body.message
            );
            
        res.status(202).json();
    }


});

app.get('/users/:username/messages', function(req, res){
 //todo
});

app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname, '/../public', 'index.html'));
});


app.listen(process.env.PORT || 3000, function() {
    app.init();
    console.log('Server started in the port: ', process.env.PORT || 3000);
});

module.exports = app;
