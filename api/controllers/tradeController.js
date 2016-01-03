var Trade = require('../../app/models/trade');
var User = require('../../app/models/user');
var Company = require('../../app/models/company');


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

        trade.save(function(err){
            if(err)
                res.send(err);
            User.update({_id:req.user._id}, {$push: {trades:trade}},{safe:true,upsert:true},function(err,model){
               console.log(err);
            });

            res.json({message:'trade added', data:trade});

        });
    }


};

exports.getTradesFromCurrentUser = function(req,res){
    if(req.user===undefined){
        res.json({success:false, message:'Authentication failed, log in again'});
    }
    else{




/*
        User.findOne({_id:req.user._id},function(err,user){
            if (!user) {
                res.json({success: false, message: 'User not found.'});
            }
            else{


                res.json(user.trades);



            }

        }).populate('trades');
*/

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