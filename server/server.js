'use strict'

let express = require('express');
var bodyParser = require('body-parser');
var app = express();
var path = require('path');
var UserHandler = require('./userhandler');
var decoder = require('./morsedecoder');


app.init = function () {
    app.handler = new UserHandler();
};

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }));


app.post('/users', function (req, res) {
    if (app.handler.checkIfUserExists(req.body.username)) {
        res.status(400).json();
    } else {
        app.handler.addUser(req.body);
        res.status(200).json({
            token: UserHandler.encodeUserName(req.body.username)
        });
    }
});

app.post('/users/:username/messages', function (req, res) {

    if (!req.get('X-Auth') || !app.handler.checkIfAuthExists(req.get('X-Auth'))) {
        res.status(401).json();

    }
    else if (!app.handler.checkIfUserExists(req.params.username)) {
        res.status(404).json();
    }
    else {

        let message = decoder.create(req.body.message).execute();
        app.handler.addMessage(
            app.handler.searchUserByAuth(req.get('X-Auth')),
            req.params.username,
            message
        );
        res.status(202).json();
    }


});

app.get('/users/:username/messages', (req, res) => {
    if (!req.get('X-Auth') || !app.handler.checkIfAuthExists(req.get('X-Auth')))
        res.status(401).json();
    else if (app.handler.searchUserByAuth(req.get('X-Auth')) !== req.params.username)
        res.status(403).json();
    else {
        res.status(200).json(app.handler.getUserMessages(req.params.username));

    }

});

app.get('/users', (req, res) => {
    res.status(200).json(app.handler.listUsers());
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/../public', 'index.html'));
});


app.listen(process.env.PORT || 3000, () => {
    app.init();
    console.log('Server started in the port: ', process.env.PORT || 3000);
});

module.exports = app;
