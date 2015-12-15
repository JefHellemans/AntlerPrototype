function Trader(imgSrc, totalPercentage, difference, comment) {
    this.img = null;
    this.imgSrc = imgSrc;
    this.totalPercentage = totalPercentage;
    this.percentage = 0;
    this.difference = difference;
    this.actualPos = null;
    this.comment = comment;
    var me = this;
    var thumbImg = new Image();
    thumbImg.src = this.imgSrc;
    thumbImg.onload = function() {
        me.img = thumbImg;
    };
}

Trader.prototype.calculate = function(scale, rad, alpha, from) {
    var pos = new Vector2D(0, 30);
    pos = pos.addVector(new Vector2D(0, rad));
    pos = pos.mul(scale);
    pos = pos.rotate(alpha - 90);
    pos = pos.addVector(from);
    this.actualPos = pos;
};

Trader.prototype.draw = function(c) {
    if(this.img !== null) {
        c.cirImg(this.actualPos.x, this.actualPos.y, 25, this.img);
        if(this.difference < -0.1) {
            c.ctx.fillStyle = "#E74C3C";
        } else if(this.difference > 0.1) {
            c.ctx.fillStyle = "#36B5DB";
        } else {
            c.ctx.fillStyle = "#2C3E50";
        }
        c.ctx.fillStyle =
        c.cir(this.actualPos.x, this.actualPos.y, (Math.abs(this.difference) * 20) + 5);
    }
};

Trader.prototype.postDraw = function(c, tick) {
    var size = 12 * tick;
    c.ctx.font = size + "pt SourceSansPro";
    var txtSize = c.ctx.measureText(this.comment).width;
    c.ctx.fillStyle = "#ffffff";
    c.ctx.beginPath();
    c.ctx.rect(this.actualPos.x + (25 * c.scale), this.actualPos.y - size - (25 * c.scale) - 20, txtSize + 20, size + 20);
    c.ctx.closePath();
    c.ctx.fill();
    c.ctx.fillStyle = "#2C3E50";
    c.ctx.fillText(this.comment, this.actualPos.x + (25 * c.scale) + 10, this.actualPos.y - size - (25 * c.scale));
};