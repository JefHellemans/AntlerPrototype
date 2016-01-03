var User = require('../../app/models/user');
var mongoose = require('mongoose');

exports.makeNewFollow = function(req,res){

    User.findOne({_id:req.body.person_id},function(err,person){



        User.update({_id:req.user._id}, {$push: {following:person}},{safe:true,upsert:true},function(err,model){
            //res.json({success:true,'message':'following new person'});


            User.findOne({_id:req.user._id},function(err,person){



                User.update({_id:req.body.person_id}, {$push: {followers:person}},{safe:true,upsert:true},function(err,model){
                    res.json({success:true,'message':'following new person'});
                });


            });


        });


    });



};

exports.getAllFollowing = function(req,res){
    User.findOne({_id:req.user._id}, function(err,person){
        res.json(person.following);
    }).populate('following');
};

exports.getAllFollowers = function(req,res){

};

exports.unFollow = function(req,res){

    var myId = req.user._id; // not req.body._id
    var personId = req.params.person_id; // not req.body._id





    User.findOne({_id:myId}, function(err,user){
        removeA(user.following,personId);
        user.save(function(err){
            if(err)
                res.json({'success':false,'message':'Something went wrong unfollowing'});
            else{
                User.findOne({_id:personId}, function(err,user){
                    removeA(user.followers,myId);
                    user.save(function(err){
                        if(err)
                            res.json({'success':false,'message':'Something went wrong unfollowing'});
                        else
                            res.json({'success':true,'message':"Successfully unfollowed"});
                    });

                });
            }

        });

    });

};

function removeA(arr){
    var what, a= arguments, L= a.length, ax;
    while(L> 1 && arr.length){
        what= a[--L];
        while((ax= arr.indexOf(what))!= -1){
            arr.splice(ax, 1);
        }
    }
    return arr;
}