var Canvas = function(x, y, id, color, el) {
    var self = this;

    var c = document.getElementById(id);
    c.width = x;
    c.height = y;
    var bg = color;

    this.ctx = c.getContext("2d");

    this.center = new Vector2D(x / 2, y / 2);
    this.offset = new Vector2D(0, 0);
    this.scale = 1;

    this.objs = el;

    var mouseTime = 0;
    var trackMouseDownTime = null;

    var animationTick = 0;
    var animationTimer = null;

    var movingCanvas = null;

    var dragging = null;
    var hover = null;

    var mouseX = null;
    var mouseY = null;

    var clear = function() {
        self.ctx.clearRect(0, 0, c.width, c.height);
        self.ctx.fillStyle = bg;
        self.ctx.fillRect(0, 0, c.width, c.height);
    };

    var draw = function() {
        clear();

        for(var i = 0; i < self.objs.length; i++) {
            self.objs[i].preDraw(self);
        }

        for(var j = 0; j < self.objs.length; j++) {
            self.objs[j].draw(self);
        }

        if(hover !== null) {
            if(typeof hover.postDraw === 'function') {
                if(animationTimer === null) {
                    hover.postDraw(self, 1);
                } else {
                    hover.postDraw(self, animationTick);
                }
            }
        }
    };
    this.drawCanvas = function() {
        draw();
    };

    var myMove = function(e) {
        var newPos = new Vector2D(e.pageX, e.pageY - 50);
        var prevPos = new Vector2D(mouseX, mouseY);
        newPos = newPos.subVector(prevPos);
        if(dragging === c) {
            self.offset = self.offset.addVector(newPos);
            for(var i = 0; i < self.objs.length; i++) {
                self.objs[i].calculate(self);
            }
        } else if(dragging !== null) {
            dragging.actualPos = dragging.actualPos.addVector(newPos);
            var angle = 180 / (dragging.traders.length + 1);
            for(var j = 0; j < dragging.traders.length; j++) {
                var alpha = angle * (j + 1 - ((dragging.traders.length + 1) / 2));
                dragging.traders[j].calculate(self.scale, dragging.rad, alpha, dragging.actualPos);
            }
        }
        mouseX = e.pageX;
        mouseY = e.pageY - 50;
        draw();
    };

    c.onmousedown = function(e) {
        clearInterval(movingCanvas);
        movingCanvas = null;
        trackMouseDownTime = setInterval(function() {
            mouseTime++;
        }, 10);
        mouseX = e.pageX;
        mouseY = e.pageY - 50;
        for(var i = self.objs.length - 1; i >= 0; i--) {
            var obj = self.objs[i];
            var oPos = obj.actualPos;
            var mousePos = new Vector2D(e.pageX, e.pageY - 50);
            mousePos = mousePos.subVector(oPos);
            if(mousePos.length() <= (obj.rad * self.scale)) {
                dragging = obj;
                self.objs.splice(i, 1);
                self.objs.push(obj);
                c.onmousemove = myMove;
                break;
            }
        }
        if(dragging === null) {
            dragging = c;
            c.onmousemove = myMove;
        }
    };

    c.onmouseup = function(e) {
        clearInterval(trackMouseDownTime);
        if(mouseTime <= 30) {
            animationTimer = setInterval(function() {
                animationTick += (1 / 10);
                draw();
                if(animationTick >= 1) {
                    clearInterval(animationTimer);
                    animationTimer = null;
                    animationTick = 0;
                    hover = null;
                }
            }, 10);
            var found = false;
            for(var i = self.objs.length - 1; i >= 0; i--) {
                var obj = self.objs[i];
                for(var j = obj.traders.length - 1; j >= 0; j--) {
                    var trader = obj.traders[j];
                    var oPos = trader.actualPos;
                    var mousePos = new Vector2D(e.pageX, e.pageY - 50);
                    mousePos = mousePos.subVector(oPos);
                    if(mousePos.length() <= (25 * self.scale)) {
                        hover = trader;
                        found = true;
                        break;
                    }
                }
                if(found) {
                    break;
                }
            }
        }
        mouseTime = 0;
        if(dragging !== null) {
            if(typeof dragging.reverse === 'function') {
                dragging.reverse(self);
            }
        }
        draw();
        dragging = null;
        mouseX = null;
        mouseY = null;
        c.onmousemove = null;
    };

    document.getElementById("scaleCanvas").onmousemove = function() {
        self.scale = this.value;
        for(var i = 0; i < self.objs.length; i++) {
            self.objs[i].calculate(self);
        }
        draw();
    };

    document.getElementById("resetOffset").onclick = function() {
        if(movingCanvas === null) {
            movingCanvas = setInterval(function() {
                console.log("movingCanvas");
                if(self.offset.x === 0 && self.offset.y === 0) {
                    clearInterval(movingCanvas);
                    movingCanvas = null;
                }
                var d = self.offset;
                d = d.div(30);
                self.offset = self.offset.subVector(d);
                if(Math.abs(self.offset.x) <= 1) {
                    self.offset.x = 0;
                }
                if(Math.abs(self.offset.y) <= 1) {
                    self.offset.y = 0;
                }
                for(var i = 0; i < self.objs.length; i++) {
                    self.objs[i].calculate(self);
                }
                draw();
            }, 10);
        }
    };
};

Canvas.prototype.rect = function(l, t, w, h) {
    this.ctx.beginPath();
    var x = l - (w / 2);
    var y = t - (h / 2);
    this.ctx.rect(x, y, w * this.scale, h * this.scale);
    this.ctx.closePath();
    this.ctx.fill();
};

Canvas.prototype.cir = function(x, y, rad) {
    this.ctx.beginPath();
    this.ctx.arc(x, y, rad * this.scale, 0, 2 * Math.PI, false);
    this.ctx.closePath();
    this.ctx.fill();
};

Canvas.prototype.cirImg = function(x, y, rad, img) {
    this.ctx.fillStyle = "#ffffff";
    this.cir(x, y, rad);
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.arc(x, y, rad * this.scale, 0, Math.PI * 2, true);
    this.ctx.clip();
    var w = 1;
    if(img.width > img.height) {
        w = img.width / img.height;
        this.ctx.drawImage(img, x - (rad * w * this.scale), y - (rad * this.scale), (rad * w * this.scale) * 2, (rad * this.scale) * 2);
    } else {
        w = img.height / img.width;
        this.ctx.drawImage(img, x - (rad * this.scale), y - (rad * w * this.scale), (rad * this.scale) * 2, (rad * w * this.scale) * 2);
    }
    this.ctx.restore();
    this.ctx.beginPath();
    this.ctx.arc(x, y, rad * this.scale, 0, Math.PI * 2, true);
    this.ctx.strokeStyle = "#eeeeee";
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
    this.ctx.closePath();
};

Canvas.prototype.cirLogo = function(x, y, rad, img) {
    this.ctx.fillStyle = "#ffffff";
    this.cir(x, y, rad);
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.arc(x, y, rad * this.scale, 0, Math.PI * 2, true);
    this.ctx.clip();
    var w = 1;
    if(img.width < img.height) {
        w = img.width / img.height;
        this.ctx.drawImage(img, x - (rad * w * this.scale), y - (rad * this.scale), (rad * w * this.scale) * 2, (rad * this.scale) * 2);
    } else {
        w = img.height / img.width;
        this.ctx.drawImage(img, x - (rad * this.scale), y - (rad * w * this.scale), (rad * this.scale) * 2, (rad * w * this.scale) * 2);
    }
    this.ctx.restore();
    this.ctx.beginPath();
    this.ctx.arc(x, y, rad * this.scale, 0, Math.PI * 2, true);
    this.ctx.strokeStyle = "#eeeeee";
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
    this.ctx.closePath();
};