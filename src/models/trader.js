function Trader(imgSrc, totalPercentage) {
    this.img = null;
    this.imgSrc = imgSrc;
    this.totalPercentage = totalPercentage;
    this.percentage = 0;
    this.actualPos = null;
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
    }
};