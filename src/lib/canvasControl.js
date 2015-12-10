var canvas;
var ctx;
var WIDTH;
var HEIGHT;
var trades = [];
var scale = 1;
var dragging = null;

var cX = function() {
    return (WIDTH / 2);
};

var cY = function() {
    return (HEIGHT / 2);
};

var sfc = function(x, y) {
    var a = (y - cY())/(x - cX());
    var d = Math.sqrt(Math.pow((x - cX()), 2) + Math.pow((y - cY()), 2));
    d = d * scale;
    var angleY = (Math.atan(a) / Math.PI) * 180;
    if(angleY < 0) {
        angleY = -angleY;
    }
    var angleX = 90 - angleY;
    var nX = d * Math.sin(((angleX / 180) * Math.PI));
    var nY = d * Math.sin(((angleY / 180) * Math.PI));
    if(x > cX()) {
        nX = -nX;
    }
    if(y > cY()) {
        nY = -nY;
    }
    return [cX() - nX, cY() - nY];
};

var sbfc = function(x, y) {
    var a = (y - cY())/(x - cX());
    var d = Math.sqrt(Math.pow((x - cX()), 2) + Math.pow((y - cY()), 2));
    d = d * (1 / scale);
    var angleY = (Math.atan(a) / Math.PI) * 180;
    if(angleY < 0) {
        angleY = -angleY;
    }
    var angleX = 90 - angleY;
    var nX = Math.ceil(d * Math.sin(((angleX / 180) * Math.PI)));
    var nY = Math.ceil(d * Math.sin(((angleY / 180) * Math.PI)));
    if(x > cX()) {
        nX = -nX;
    }
    if(y > cY()) {
        nY = -nY;
    }
    return [cX() - nX, cY() - nY];
};

var rect = function(l,t,w,h) {
    ctx.beginPath();
    var x = l - (w/2);
    var y = t - (h/2);
    ctx.rect(x, y, w * scale, h * scale);
    ctx.closePath();
    ctx.fill();
};

var cir = function(x, y, rad) {
    ctx.beginPath();
    ctx.arc(x, y, rad * scale, 0, 2 * Math.PI, false);
    ctx.closePath();
    ctx.fill();
};

var clear = function() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
};

var init = function() {
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
        trades.push(new Trade(i, x, y, x, y, rad, color));
    }

    return setInterval(draw, 10);
};

var draw = function() {
    clear();

    for(var i = 0; i < trades.length; i++) {
        trades[i].draw();
    }
};

var myMove = function(e) {
    if (dragging !== null) {
        dragging.scX = e.pageX;
        dragging.scY = e.pageY;
    }
};

var myDown = function(e) {
    for(var i = trades.length - 1; i >= 0; i--) {
        var trade = trades[i];
        if((Math.pow((e.pageX - trade.scX), 2) + Math.pow((e.pageY - trade.scY), 2)) <= Math.pow((trade.rad * scale), 2)) {
            dragging = trade;
            trades.splice(i, 1);
            trades.push(trade);
            canvas.onmousemove = myMove;
            break;
        }
    }
};

var myUp = function() {
    var p = sbfc(dragging.scX, dragging.scY);
    dragging.x = p[0];
    dragging.y = p[1];
    dragging = null;
    canvas.onmousemove = null;
};

init();
canvas.onmousedown = myDown;
canvas.onmouseup = myUp;

document.getElementById("scaleCanvas").onmousemove = function() {
    scale = this.value;
    for(var i = trades.length - 1; i >= 0; i--) {
        var trade = trades[i];
        var p = sfc(trade.x, trade.y);
        trade.scX = p[0];
        trade.scY = p[1];
    }
};

var Trade = function(text, x, y, scX, scY, rad, color) {
    this.text = text;
    this.x = x;
    this.y = y;
    this.scX = scX;
    this.scY = scY;
    this.rad = rad;
    this.color = color;
};

Trade.prototype.draw = function() {
    ctx.fillStyle = this.color;
    cir(this.scX, this.scY, this.rad);
    var fontSize = 30 * scale;
    ctx.font = fontSize + "px Arial";
    ctx.fillStyle = "#000000";
    ctx.textAlign = "center";
    ctx.fillText(this.text, this.scX, this.scY);
};