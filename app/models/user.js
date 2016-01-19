// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var TradeSchema = require('./trade.js');

// define the schema for our user model
var userSchema = mongoose.Schema({

        firstname    : String,
        lastname     : String,
        email        : String,
        password     : String,
        image        : String,
        trades :[
                    {
                        type:mongoose.Schema.Types.ObjectId, ref: 'Trade'
                    }
               ],
        canBeFound : Boolean,
        admin:Boolean,
        transactions:[
                        {
                            type:mongoose.Schema.Types.ObjectId, ref:'Transaction'
                        }
                     ],
        balance:Number,
        following:[
                        {
                            type:mongoose.Schema.Types.ObjectId, ref:'User'
                        }
                    ],
        followers:[
                        {
                            type:mongoose.Schema.Types.ObjectId, ref:'User'
                        }
                    ],
        imageUrl: {type: String, default: "http://localhost:3000/dist/images/logos/antlerlogo.png"}

});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

userSchema.methods.verifyPassword = function(password, cb) {
    bcrypt.compare(password, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);