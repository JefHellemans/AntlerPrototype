var express = require('express');
var app = express();
var router = express.Router();

router.get("/",function(req,res){
    res.send("Welcome to our MOOSE MOOSE MOOSE api");
});


module.exports=router;