var canvas;
var ctx;
var WIDTH;
var HEIGHT;
var xOff = 0;
var yOff = 0;
var mouseX = null;
var mouseY = null;
var trades = [];
var scale = 1;
var dragging = null;
var movingCanvas = null;
var logos = ["logo0.png", "logo1.jpg", "logo2.jpg", "logo3.png", "logo4.png"];

(function() {
    canvas = document.getElementById("trades");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.onmousedown = myDown;
    canvas.onmouseup = myUp;
    WIDTH = window.innerWidth;
    HEIGHT = window.innerHeight;
    ctx = canvas.getContext("2d");

    for(var i = 0; i < 5; i++) {
        var x = Math.floor(Math.random() * WIDTH);
        var y = Math.floor(Math.random() * HEIGHT);
        var rad = Math.floor((Math.random() * 100) + 50);
        trades.push(new Trade("dist/images/" + logos[i], x, y, x, y, rad));
    }

    document.getElementById("scaleCanvas").onmousemove = function() {
        scale = this.value;
        for(var i = trades.length - 1; i >= 0; i--) {
            var trade = trades[i];
            var p = sfc(trade.x, trade.y);
            trade.scX = p[0];
            trade.scY = p[1];
        }
    };

    document.getElementById("resetOffset").onclick = function() {
        var a = yOff / xOff;
        movingCanvas = setInterval(function() {
            xOff -= (xOff / 30);
            if(Math.abs(xOff) <= 1) {
                xOff = 0;
            }
            yOff = (a * xOff);
            if(Math.abs(yOff) <= 1) {
                yOff = 0;
            }
            if(xOff === 0 && yOff === 0) {
                clearInterval(movingCanvas);
            }
        }, 10);
    };

    setInterval(draw, 10);

})();

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

var rect = function(l, t, w, h) {
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

function clear() {
    ctx.fillStyle = "#eeeeee";
    ctx.fillRect(0,0,WIDTH,HEIGHT);
}

function draw() {
    clear();

    for(var i = 0; i < trades.length; i++) {
        trades[i].draw();
    }
}

function myMove(e) {
    if(dragging === canvas) {
        xOff += (e.pageX - mouseX) * (1 / scale);
        yOff += (e.pageY - mouseY) * (1 / scale);
        mouseX = e.pageX;
        mouseY = e.pageY;
    } else if(dragging !== null) {
        dragging.scX = (e.pageX - (xOff * scale));
        dragging.scY = (e.pageY - (yOff * scale));
    }
}

function myDown(e) {
    clearInterval(movingCanvas);
    for(var i = trades.length - 1; i >= 0; i--) {
        var trade = trades[i];
        if((Math.pow((e.pageX - (trade.scX + (xOff * scale))), 2) + Math.pow((e.pageY - (trade.scY + (yOff * scale))), 2)) <= Math.pow((trade.rad * scale), 2)) {
            dragging = trade;
            trades.splice(i, 1);
            trades.push(trade);
            canvas.onmousemove = myMove;
            break;
        }
    }
    if(dragging === null) {
        dragging = canvas;
        mouseX = e.pageX;
        mouseY = e.pageY;
        canvas.onmousemove = myMove;
    }
}

function myUp() {
    var p = sbfc(dragging.scX, dragging.scY);
    dragging.x = p[0];
    dragging.y = p[1];
    dragging = null;
    mouseX = null;
    mouseY = null;
    canvas.onmousemove = null;
}