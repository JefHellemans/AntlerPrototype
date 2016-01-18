var Trade = require('../../app/models/trade');
var User = require('../../app/models/user');
var Company = require('../../app/models/company');
var Transaction = require('../../app/models/transaction');


exports.postTrade=function(req,res){
    var trade = new Trade();

    if(req.body.CompanyId===undefined){
        res.json({message:"CompanyId is missing"});
    }
    else if(req.user===undefined){
        res.json({success:false, message:'Authentication failed, log in again'});
    }
    else{
        trade.AmountInvested = req.body.AmountInvested;
        trade.PercentageInvested = req.body.PercentageInvested;
        trade.StartStockPrice= req.body.StartStockPrice;
        trade.IsShort = req.body.IsShort;
        trade.Comment = req.body.Comment;
        trade.StopStockPrice = -1;
        trade.Company=req.body.CompanyId;
        console.log("DEBUG: " + req.body.AmountInvested);
        console.log("DEBUG: " + trade.AmountInvested);
        makeTransactionForTrade(req.body.AmountInvested, req.user._id);
        trade.save(function(err){
            if(err)
                res.send(err);
            User.update({_id:req.user._id}, {$push: {trades:trade}},{safe:true,upsert:true},function(err,model){
                //make trade for all followers too
               for(var i = 0; i<req.user.followers.length;i++){
                   var followerId = req.user.followers[i];

                    trade.ParentTrade = trade;
                    User.findOne({_id:followerId},function(err,folluser){

                        var bal = Number(folluser.balance);
                        var perc = Number(trade.PercentageInvested);
                        var changetheamount = bal * perc;
                        console.log(changetheamount);
                        var tradeTwo = new Trade();
                        tradeTwo.AmountInvested = changetheamount;
                        tradeTwo.PercentageInvested = req.body.PercentageInvested;
                        tradeTwo.StartStockPrice= req.body.StartStockPrice;
                        tradeTwo.IsShort = req.body.IsShort;
                        tradeTwo.Comment = req.body.Comment;
                        tradeTwo.StopStockPrice = -1;
                        tradeTwo.Company=req.body.CompanyId;
                        tradeTwo.ParentTrade = trade;
                        makeTransactionForTrade(changetheamount, followerId);
                        tradeTwo.save(function(err){
                            if(err)
                                console.log(err);
                            User.update({_id:followerId}, {$push: {trades:tradeTwo}},{safe:true,upsert:true},function(err,model){

                            });
                        });
                    });




               }
            });

            res.json({message:'trade added', data:trade});

        });
    }


};

function makeTransactionForTrade(amnchng, userid){

        var transaction = new Transaction();
        var amountchange = amnchng;
        transaction.amountchange = amountchange;


        transaction.save(function(err){
            if(err)
                console.log(err);
            User.findOne({_id:userid},function(err,user){
                if(user.balance===undefined){
                    user.balance = 0;
                }
                var amountchangenumber = Number(amountchange*-1);
                user.balance+=amountchangenumber;
                user.markModified('balance');
                user.save();
            });
            User.update({_id:userid}, {$push: {transactions:transaction}},{safe:true,upsert:true},function(err,model){
                console.log(err);
            });




            //res.json({message:'transaction added', data:transaction});

        });

}

exports.getTradesFromCurrentUser = function(req,res){
    if(req.user===undefined){
        res.json({success:false, message:'Authentication failed, log in again'});
    }
    else{





        User.findOne({_id:req.user._id})
            .lean()
            .populate({ path: 'trades' })
            .exec(function(err, docs) {

                var options = {
                    path: 'trades.Company',
                    model: 'Company'
                };

                if (err) return res.json(500);
                User.populate(docs, options, function (err, user) {
                    res.json(user.trades);
                });
            });


    }

};

exports.getTrade=function(req,res){
  res.json({trade:'this is a trade'});
};