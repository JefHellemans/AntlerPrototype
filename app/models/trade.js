var mongoose = require('mongoose');

var tradeSchema = mongoose.Schema({
    Company:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required:true
    },
    AmountInvested: Number,
    PercentageInvested: Number,
    StartStockPrice: Number,
    IsShort: Boolean,
    Comment: String,
    ParentTrade:{
        type:mongoose.Schema.Types.ObjectId, ref: 'Trade'
    }

});


module.exports=mongoose.model('Trade', tradeSchema);