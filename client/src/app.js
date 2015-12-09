var canvas;
var ctx;
var WIDTH;
var HEIGHT;
var trades = [];
var dragging = null;

var rect = function(l,t,w,h) {
    ctx.beginPath();
    var x = l - (w/2);
    var y = t - (h/2);
    ctx.rect(x,y,w,h);
    ctx.closePath();
    ctx.fill();
};

var cir = function(x, y, rad) {
    ctx.beginPath();
    ctx.arc(x, y, rad, 0, 2 * Math.PI, false);
    ctx.closePath();
    ctx.fill();
};

function clear() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
}

function init() {
    canvas = document.getElementById("trades");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    WIDTH = window.innerWidth;
    HEIGHT = window.innerHeight;
    ctx = canvas.getContext("2d");

    for(var i = 0; i < 20; i++) {
        var x = Math.floor(Math.random() * WIDTH);
        var y = Math.floor(Math.random() * HEIGHT);
        var rad = Math.floor((Math.random() * 100) + 20);
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var j = 0; j < 6; j++ ) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        trades.push(new Trade(i, x, y, rad, color));
    }

    return setInterval(draw, 10);
}

function draw() {
    clear();

    for(var i = 0; i < trades.length; i++) {
        trades[i].draw();
    }
}

function myMove(e){
    if (dragging !== null) {
        dragging.x = e.pageX;
        dragging.y = e.pageY;
    }
}

function myDown(e){
    for(var i = trades.length -1 ; i >= 0; i--) {
        var trade = trades[i];
        if((Math.pow((e.pageX - trade.x), 2) + Math.pow((e.pageY - trade.y), 2)) <= Math.pow(trade.rad, 2)) {
            dragging = trade;
            trades.splice(i, 1);
            trades.push(trade);
            canvas.onmousemove = myMove;
            canvas.touchmove = myMove;
            break;
        }
    }
}

function myUp(){
    dragging = null;
    canvas.onmousemove = null;
    canvas.touchmove = null;
}

init();
canvas.onmousedown = myDown;
canvas.onmouseup = myUp;
canvas.touchstart = myDown;
canvas.touchend = myDown;

function Trade(text, x, y, rad, color) {
    this.text = text;
    this.x = x;
    this.y = y;
    this.rad = rad;
    this.color = color;
}

Trade.prototype.draw = function() {
    ctx.fillStyle = this.color;
    cir(this.x, this.y, this.rad);
    ctx.font = "30px Arial";
    ctx.fillStyle = "#000000";
    ctx.textAlign = "center";
    ctx.fillText(this.text, this.x, this.y);
};