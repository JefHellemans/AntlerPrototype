var User = require('../../app/models/user');
var path = require('path'),
    fs = require('fs');

exports.getUsers = function(req,res){
  User.find({},function(err,users){
      res.json(users);
  });
};

exports.getLoggedInUser = function(req, res){
    User.find({_id: req.user._id}, function(err, user){
        res.json(user);
    });
};

exports.getUserById = function(req, res){
    User.find({_id: req.params.user_id}, function(err, user){
        res.json(user);
    });
};

