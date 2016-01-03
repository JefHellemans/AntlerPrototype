var mongoose = require('mongoose');

var transactionSchema = mongoose.Schema({
    amountchange:Number,
    date: { type: Date, default: Date.now }
});


module.exports=mongoose.model('Transaction', transactionSchema);