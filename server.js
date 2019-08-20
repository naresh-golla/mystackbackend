var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');
var _ = require('lodash');
var dbUrl = require('./config/mongo');
var UserInfo = require('./models/userInfo');

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/getUser/:username', (req, res) => {
    UserInfo.findOne({ username: req.params.username }, (err, info) => {
        if(err) res.status(500).send(err);
        else {
            if(_.isNil(info) || _.isEmpty(info)) res.status(200).send({});
            else res.status(200).send(info);
        }
    });
});

app.post('/createUser', (req, res) => {
    var userInfo = new UserInfo(req.body);
    userInfo.save((err) => {
        if (err) {
            res.sendStatus(500);
        }
        io.emit('userInfo', req.body);
        res.sendStatus(200);
    });
});

app.put('/updateUser/:username', (req, res) => {
    UserInfo.findOneAndUpdate(
        { username: req.params.username },
        // the change to be made. Mongoose will smartly combine your existing
        // document with this change, which allows for partial updates too
        req.body,

        // an option that asks mongoose to return the updated version
        // of the document instead of the pre-updated one.
        { new: true },
        // the callback function
        (err, info) => {
            // Handle any possible database errors
            if (err) return res.status(500).send(err);
            return res.send(info);
        });
});


io.on('connection', (socket) => {
    console.log('user connected');
});

mongoose.connect(dbUrl.devUrl, (err) => {
    console.error("mongoDb Connection", err);
});

var server = http.listen(3000, () => {
    console.log('server is listening to the port ', server.address().port);
});
