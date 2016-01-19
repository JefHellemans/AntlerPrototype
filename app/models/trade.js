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
    StopStockPrice: Number,
    IsShort: Boolean,
    Comment: String,
    Date: { type: Date, default: Date.now },
    ParentTrade:String,
    IsNew: Boolean
});


module.exports=mongoose.model('Trade', tradeSchema);