module.exports = function(io){
    io.on('connection', function(socket){
        console.log("Trader connected with id: " + socket.id);

        socket.on('disconnect', function(){
            console.log("Trader disconnected");
        })
    });
}