var mongoose = require('mongoose');

var companySchema = mongoose.Schema({
    Name : String,
    Image : String,
    CurrentStockPrice : Number
});


module.exports=mongoose.model('Company', companySchema);