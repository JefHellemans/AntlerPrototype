function Trade(imgSrc, vector, traders) {
    this.img = null;
    this.imgSrc = imgSrc;
    this.savedPos = vector;
    this.actualPos = null;
    this.traders = traders;
    this.percentage = 0;
    for(var i = 0; i < this.traders.length; i++) {
        this.percentage += this.traders[i].totalPercentage * this.traders[i].percentage;
    }
    this.rad = 50 + (this.percentage * 100);
    var me = this;
    var thumbImg = new Image();
    thumbImg.src = this.imgSrc;
    thumbImg.onload = function() {
        me.img = thumbImg;
    };
}

Trade.prototype.reverse = function(c) {
    var pos = this.actualPos;
    pos = pos.subVector(c.offset);
    pos = pos.subVector(c.center);
    pos = pos.div(c.scale);
    this.savedPos = pos;
    var angle = 160 / (this.traders.length + 1);
    for(var i = 0; i < this.traders.length; i++) {
        var alpha = angle * (i + 1 - ((this.traders.length + 1) / 2));
        this.traders[i].calculate(c.scale, this.rad, alpha, this.actualPos);
    }
};

Trade.prototype.calculate = function(c) {
    var pos = this.savedPos;
    pos = pos.mul(c.scale);
    pos = pos.addVector(c.center);
    pos = pos.addVector(c.offset);
    this.actualPos = pos;
    var angle = 180 / (this.traders.length + 1);
    for(var i = 0; i < this.traders.length; i++) {
        var alpha = angle * (i + 1 - ((this.traders.length + 1) / 2));
        this.traders[i].calculate(c.scale, this.rad, alpha, pos);
    }
};

Trade.prototype.preDraw = function(c) {
    if(this.img !== null) {
        c.ctx.strokeStyle = "#2c3e50";
        c.ctx.lineWidth = 0.5 * c.scale;
        c.ctx.beginPath();
        var center = c.center.addVector(c.offset);
        c.ctx.moveTo(center.x, center.y);
        c.ctx.lineTo(this.actualPos.x, this.actualPos.y);
        c.ctx.stroke();
        c.ctx.closePath();
    }
};

Trade.prototype.draw = function(c) {
    if(this.img !== null) {
        c.cirImg(this.actualPos.x, this.actualPos.y, this.rad, this.img);
        for(var i = 0; i < this.traders.length; i++) {
            this.traders[i].draw(c);
        }
    }
};