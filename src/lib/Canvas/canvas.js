var Canvas = function(x, y, width, height, elementId, objects) {
    this.width = width;
    this.height = height;
    this.margin = new Vector2D(x, y);
    this.ctx = document.getElementById(elementId).getContext("2d");
    this.ctx.canvas.width = width;
    this.ctx.canvas.height = height;

    this.center = new Vector2D(width / 2, height / 2);
    this.offset = new Vector2D(0, 0);
    this.scale = 1;

    this.objects = objects;
    this.selected = null;

    this.startPos = new Vector2D(0, 0);
    this.mousePos = new Vector2D(0, 0);
    this.focus = null;

    this.movingCanvas = null;

    this.drawCallback = null;
    this.partialCallback = null;

    var me = this;
    setInterval(function() {
        var redraw = false;
        me.ctx.save();
        me.ctx.textBaseline = "hanging";
        var c = me.center.addVector(me.offset);
        me.ctx.setTransform(me.scale, 0, 0, me.scale, c.x, c.y);
        for(var i = 0, l = me.objects.length; i < l; i++) {
            if(typeof me.objects[i].requestRedraw === 'function') {
                if(me.objects[i].requestRedraw()) {
                    redraw = true;
                } else if(typeof me.objects[i].requestPartial === 'function') {
                    if(me.objects[i].requestPartial()) {
                        me.objects[i].partial(me.ctx, me.scale);
                        me.partialCallback();
                    }
                }
            } else {
                if(me.objects[i].requestRedraw) {
                    redraw = true;
                    me.objects[i].requestRedraw = false;
                }
            }
        }
        me.ctx.restore();
        if(redraw) {
            me.draw();
        }
    }, 10);
};

Canvas.prototype.clear = function() {
    this.ctx.clearRect(0, 0, this.width, this.height);
};

Canvas.prototype.draw = function(cb) {
    this.clear();
    this.ctx.save();
    this.ctx.textBaseline = "hanging";
    var c = this.center.addVector(this.offset);
    this.ctx.setTransform(this.scale, 0, 0, this.scale, c.x, c.y);
    var i, l;
    for(i = 0, l = this.objects.length; i < l; i++) {
        if(typeof this.objects[i].preDraw === 'function') {
            this.objects[i].preDraw(this.ctx, this.scale);
        }
    }
    for(i = 0, l = this.objects.length; i < l; i++) {
        this.objects[i].draw(this.ctx, this.scale);
    }
    for(i = 0, l = this.objects.length; i < l; i++) {
        if(typeof this.objects[i].postDraw === 'function') {
            this.objects[i].postDraw(this.ctx, this.scale);
        }
    }
    this.ctx.restore();
    if(typeof cb === 'function') {
        cb();
    }
    if(typeof this.drawCallback === 'function') {
        this.drawCallback();
    }
};

Canvas.prototype.findObjectOnCanvas = function(cb) {
    var found = false;
    for(var i = this.objects.length - 1; i >= 0; i--) {
        var o = this.objects[i].interaction(this.mousePos, this.scale);
        if(o !== false) {
            cb(o);
            found = true;
            break;
        }
    }
    if(!found) {
        cb(null);
    }
};

Canvas.prototype.moveToCenter = function(cb) {
    if(this.movingCanvas === null) {
        var me = this;
        this.movingCanvas = setInterval(function() {
            if(me.offset.x === 0 && me.offset.y === 0) {
                clearInterval(me.movingCanvas);
                me.movingCanvas = null;
            }
            var d = me.offset;
            d = d.div(30);
            me.offset = me.offset.subVector(d);
            if(Math.abs(me.offset.x) <= 1) {
                me.offset.x = 0;
            }
            if(Math.abs(me.offset.y) <= 1) {
                me.offset.y = 0;
            }
            if(typeof cb === 'function') {
                cb();
            }
            me.draw();
        }, 10);
    }
};

Canvas.prototype.interactionStart = function(e, cb) {
    clearInterval(this.movingCanvas);
    this.movingCanvas = null;
    this.mousePos = new Vector2D(e.pageX, e.pageY);
    this.mousePos = this.mousePos.subVector(this.margin);
    this.mousePos = this.mousePos.subVector(this.center);
    this.mousePos = this.mousePos.subVector(this.offset);
    var mousePos = this.mousePos;
    var offset = this.offset;
    this.findObjectOnCanvas(function(found) {
        var selected = found;
        if(selected === null) {
            selected = "self";
            mousePos = mousePos.addVector(offset);
        }
        if(typeof cb === 'function') {
            cb(selected, mousePos);
        }
    });
};

Canvas.prototype.interactionMove = function(e, cb) {
    var newPos = new Vector2D(e.pageX, e.pageY);
    newPos = newPos.subVector(this.margin);
    newPos = newPos.subVector(this.center);
    var difference = newPos.subVector(this.mousePos);
    this.mousePos = newPos;
    if(this.selected === "self") {
        this.startPos = this.startPos.addVector(difference);
        this.offset = this.offset.addVector(difference);
        this.draw();
    } else if(this.selected !== null) {
        this.startPos = this.startPos.addVector(difference);
        this.mousePos = this.mousePos.subVector(this.offset);
        cb(this.selected, this.mousePos.mul(1 / this.scale));
    }
};

Canvas.prototype.interactionStop = function(cb) {
    if(this.startPos.length() <= 10) {
        cb(this.selected);
    } else {
        cb(null);
    }
    this.startPos = new Vector2D(0, 0);
    this.selected = null;
    this.mousePos = new Vector2D(0, 0);
};