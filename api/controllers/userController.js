var User = require('../../app/models/user');
var path = require('path'),
    fs = require('fs');

exports.getUsers = function(req,res){
  User.find({},function(err,users){
      res.json(users);
  });
};

exports.getLoggedInUser = function(req, res){

    User.findOne({_id:req.user._id})
        .lean()
        .populate([{ path: 'trades' }, {path:'transactions'}])
        .exec(function(err, docs) {

            var options = {
                path: 'trades.Company',
                model: 'Company'
            };

            if (err) return res.json(500);
            User.populate(docs, options, function (err, user) {
                res.json(user);
            });
        });

};

exports.getUserById = function(req, res){
    User.find({_id: req.params.user_id}, function(err, user){
        res.json(user);
    });
};

exports.uploadUrl = function(req, res){
    User.find({_id: req.params.user_id}, function(err, user){

        console.log(req.body.url);
        if(req.body.url != ""){

            User.update({_id: req.params.user_id}, {$set: {imageUrl:req.body.url}},{safe:true,upsert:true},function(err,model){
                console.log(err);
                res.json({message: "Image uploaded", success: true});
            });
        }
    });
};

