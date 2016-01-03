var User = require('../../app/models/user');

exports.makeNewFollow = function(req,res){

    User.findOne({_id:req.body.person_id},function(err,person){


        User.update({_id:req.user._id}, {$push: {following:person}},{safe:true,upsert:true},function(err,model){
            res.json({success:true,'message':'following new person'});
        });


    });

};

exports.getAllFollowing = function(req,res){
    User.findOne({_id:req.user._id}, function(err,person){
        res.json(person.following);
    }).populate('following');
};