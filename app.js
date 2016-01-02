var express = require("express");
var app = express();
var port = process.env.PORT = 3000;
var mongoose = require("mongoose");
var passport = require("passport");
var flash = require("connect-flash");
var path = require("path");

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


app.set('views', __dirname + "/src/pages");
app.set('view engine', 'html');

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

app.use(express.static(path.join(__dirname, '/src')));

//API ROUTES EN CONTROLLERS
var router = express.Router();
var authController = require('./api/controllers/auth.js');
var tradeController = require('./api/controllers/tradeController.js');


router.route('/trades')
    .post(authController.isAuthenticated, tradeController.postTrade);


router.route('/trades/:trade_id')
    .get(authController.isAuthenticated, tradeController.getTrade);


app.use('/api',router);


app.listen(port);
console.log("Server started on port: " + port);