//var Trade = require('../../app/models/trade');

exports.postTrade=function(req,res){

    res.json({message:'Trade added to db'});
};

exports.getTrade=function(req,res){
  res.json({trade:'this is a trade'});
};