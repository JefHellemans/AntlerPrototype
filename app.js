var express = require("express");
var app = express();
var port = process.env.PORT = 3000;
var mongoose = require("mongoose");
var passport = require("passport");
var flash = require("connect-flash");
var path = require("path");
var jwt = require("jsonwebtoken");

var morgan = require("morgan");
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var configDB = require("./config/database.js");

mongoose.connect(configDB.url);

require('./config/passport')(passport);

app.set('superSecret', 'ilovethemoosemoosemoose');

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
var tradeController = require('./api/controllers/tradeController.js');
var userController = require('./api/controllers/userController.js');
var companyController = require('./api/controllers/companyController.js');
var transactionController = require ('./api/controllers/transactionController.js');
var followersController = require('./api/controllers/followersController.js');


//token authenticate function
var User = require('./app/models/user');
router.post('/authenticate', function(req, res) {

    // find the user
    User.findOne({email: req.body.email}, function(err, user) {

        if (err) throw err;

        if (!user) {
            res.json({ success: false, message: 'Authentication failed. User not found.' });
        } else if (user) {

            // check if password matches
            user.verifyPassword(req.body.password, function (err, isMatch) {
                var errortje = false;
                if (err) {
                    //res.json({ success: false, message: 'Something went wrong' + err });
                    errortje = true;
                }

                // Password did not match
                if (!isMatch) {
                    //res.json({ success: false, message: 'Password did not match' });
                    errortje = true;
                }


                //success
                // if user is found and password is right
                // create a token

                if(!errortje){
                    var token = jwt.sign(user, app.get('superSecret'), {
                        expiresInMinutes: 1440 // expires in 24 hours
                    });

                    // return the information including token as JSON
                    res.json({
                        success: true,
                        message: 'Enjoy your token!',
                        token: token
                    });
                }
                else{
                    res.json({success:false,message:'Error'});
                }


            });
        }



    });
});

/*
//deze functie wordt gebruikt om api te beveiligen
router.use(function(req, res, next) {

    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    // decode token
    if (token) {

        // verifies secret and checks exp
        jwt.verify(token, app.get('superSecret'), function(err, decoded) {
            if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' });
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });

    } else {

        // if there is no token
        // return an error
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });

    }
});
//einde beveiligfunctie
*/

//maak hier de api routes

router.route('/companies')
    .get(companyController.getCompanies)
    .post(companyController.postCompany);

router.route('/users')
    .get(userController.getUsers);

router.route('/loggedInUser')
    .get(userController.getLoggedInUser);

router.route('/trades')
    .get(tradeController.getTradesFromCurrentUser)
    .post(tradeController.postTrade);


router.route('/trades/:trade_id')
    .get(tradeController.getTrade);

router.route('/transactions')
    .post(transactionController.postTransaction)
    .get(transactionController.getTransactionsFromUser);

router.route('/followers')
    .post(followersController.makeNewFollow)
    .get(followersController.getAllFollowing);





app.use('/api',router);


app.listen(port);
console.log("Server started on port: " + port);