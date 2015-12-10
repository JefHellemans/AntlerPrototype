var express = require("express");
var app = express();
var port = process.env.PORT = 3000;
var mongoose = require("mongoose");
var passport = require("passport");
var flash = require("connect-flash");


var morgan = require("morgan");
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var configDB = require("./config/database.js");

mongoose.connect(configDB.url);

require('./config/passport')(passport);


app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended:true
}));

app.set('view engine','ejs');

app.use(session({
    secret:'ilovemoosemoosemoose',//sesion secret
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session({}));
app.use(flash());

//laad de routes
require('./app/routes.js')(app, passport);


//API ROUTES EN CONTROLLERS
var main = require("./api/main.js");
var tradeController = require('./api/controllers/tradeController.js');

app.use('/api', main);
app.use('/api/trade', tradeController);

app.listen(port);
console.log("Server started on port: " + port);