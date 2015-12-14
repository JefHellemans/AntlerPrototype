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

/*var Matrix = function(m) {
    this.m = m;
};

Matrix.prototype = {
    set: function(x, y, val) {
        this.m[x][y] = val;
    },
    initIdentity : function() {
        this.m[0][0] = 1;   this.m[0][1] = 0;   this.m[0][2] = 0;   this.m[0][3] = 0;
        this.m[1][0] = 0;   this.m[1][1] = 1;   this.m[1][2] = 0;   this.m[1][3] = 0;
        this.m[2][0] = 0;   this.m[2][1] = 0;   this.m[2][2] = 1;   this.m[2][3] = 0;
        this.m[3][0] = 0;   this.m[3][1] = 0;   this.m[3][2] = 0;   this.m[3][3] = 1;
    },
    mul: function(m2) {
        var r = new Matrix();
        for(var i = 0; i < 4; i++) {
            for(var j = 0; j < 4; j++) {
                r.set(i, j, this.m[i][0] * r.m[0][j] +
                            this.m[i][1] * r.m[1][j] +
                            this.m[i][2] * r.m[2][j] +
                            this.m[i][3] * r.m[3][j]);
            }
        }
        return r;
    }
};*/