var User = require('../../app/models/user');

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