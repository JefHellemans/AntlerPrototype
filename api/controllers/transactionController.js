var Transaction = require('../../app/models/transaction');
var User = require('../../app/models/user');


exports.postTransaction = function(req,res){
    var transaction = new Transaction();
    var amountchange = req.body.amountchange;
    transaction.amountchange = amountchange;

    transaction.save(function(err){
        if(err)
            res.send(err);
        User.findOne({_id:req.user._id},function(err,user){
            if(user.balance===undefined){
                user.balance = 0;
            }
            var amountchangenumber = Number(amountchange);
            user.balance+=amountchangenumber;
            user.markModified('balance');
            user.save();
        });
        User.update({_id:req.user._id}, {$push: {transactions:transaction}},{safe:true,upsert:true},function(err,model){
            console.log(err);
        });




        res.json({message:'transaction added', data:transaction});

    });
};

exports.getTransactionsFromUser =  function(req,res){
    if(req.user===undefined){
        res.json({success:false, message:'Please log in'});
    }else{
        User.findOne({_id:req.user._id},function(err,user){
            res.json(user.transactions);
        })
            .populate('transactions');
    }
};