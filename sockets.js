var User = require('./app/models/user');
var mongoose = require('mongoose');


module.exports = function(io){

    var traders = [];

    io.on('connection', function(socket){
        console.log("Trader connected with id: " + socket.id);
        socket.emit('socketID', { id : socket.id});

        socket.on('newTrade', function(data){
            var followers;
            console.log(data);
            User.findOne({_id:data.traderid}, function(err,person){
                followers = person.followers;
                for(var i = 0; i<followers.length; i++){

                    for(var ii = 0; ii<traders.length;ii++){

                        if(followers[i]._id==traders[ii].antlerid){
                            console.log("gevonden");
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