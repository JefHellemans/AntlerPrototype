var express = require('express');
var app = express();
var router = express.Router();

router.get("/",function(req,res){
    res.send("Welcome to tradecontroller");
});


module.exports=router;