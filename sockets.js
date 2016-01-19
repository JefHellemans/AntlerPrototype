var User = require('./app/models/user');
var Company = require('./app/models/company');
var mongoose = require('mongoose');


module.exports = function(io){

    var traders = [];
    var companiesarray;
    Company.find(function(err,companies){
        companiesarray = companies;
        var intervalID = setInterval(function(){
            for (var i=0; i<companiesarray.length; i++) {

                companiesarray[i].CurrentStockPrice += (Math.random() * 5) - 4;
                companiesarray[i].CurrentStockPrice = Math.round(companiesarray[i].CurrentStockPrice * 100) / 100


            }



            //console.log(companiesarray);
            io.sockets.emit('priceUpdate', Date.now() + "");
        }, 5000);
    });

    io.on('connection', function(socket){
        console.log("Trader connected with id: " + socket.id);
        socket.emit('socketID', { id : socket.id});

        socket.on('newTrade', function(data){
            var followers;
            User.findOne({_id:data.traderid}, function(err,person){
                followers = person.followers;
                for(var i = 0; i<followers.length; i++){
                    for(var ii = 0; ii<traders.length;ii++){
                        if(followers[i]._id==traders[ii].antlerid){
                            console.log("Sockets ok!");
                            if (io.sockets.connected[traders[ii].id]) {
                                io.sockets.connected[traders[ii].id].emit('newTradeFromFollowing', {trade:data.trade} );
                            }
                        }

                    }

                }


            }).populate('followers');


        });

        socket.on('attachAntlerId',function(data){
           traders.push(new trader(socket.id, data.antlerid));
        });

        socket.on('disconnect', function(){
            console.log("Trader disconnected");
            for(var i = 0; i<traders.length; i++){
                if(traders[i].id == socket.id){
                    traders.splice(i, 1);
                }
            }
        })




    });



    function trader(id, antlerid){
        this.id = id;
        this.antlerid = antlerid;
    }
};