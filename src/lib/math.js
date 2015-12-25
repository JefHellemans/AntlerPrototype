Math.square = function(x) {
    return x * x;
};

Math.toRadians = function(x) {
    return (x * Math.PI) / 180;
};

Math.toDegrees = function(x) {
    return (x * 180) / Math.PI;
};

var Vector2D = function(x, y) {
    this.x = x;
    this.y = y;
};

Vector2D.prototype = {
    length: function() {
        return Math.sqrt(Math.square(this.x) + Math.square(this.y));
    },
    dot: function(v2) {
        return (this.x * v2.x) + (this.y * v2.y);
    },
    normalize: function() {
        var l = this.length();
        this.x /= l;
        this.y /= l;
    },
    add: function(z) {
        return new Vector2D(this.x + z, this.y + z);
    },
    addVector: function(v2) {
        return new Vector2D(this.x + v2.x, this.y + v2.y);
    },
    sub: function(z) {
        return new Vector2D(this.x - z, this.y - z);
    },
    subVector: function(v2) {
        return new Vector2D(this.x - v2.x, this.y - v2.y);
    },
    mul: function(z) {
        return new Vector2D(this.x * z, this.y * z);
    },
    mulVector: function(v2) {
        return new Vector2D(this.x * v2.x, this.y * v2.y);
    },
    div: function(z) {
        return new Vector2D(this.x / z, this.y / z);
    },
    divVector: function(v2) {
        return new Vector2D(this.x / v2.x, this.y / v2.y);
    },
    rotate: function(angle) {
        var r = Math.toRadians(angle);
        var cos = Math.cos(r);
        var sin = Math.sin(r);
        return new Vector2D((this.x * cos) - (this.y * sin), (this.x * sin) + (this.y * cos));
    }
};