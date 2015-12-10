function Trade(logo, x, y, scX, scY, rad) {
    this.img = null;
    this.logo = logo;
    this.x = x;
    this.y = y;
    this.scX = scX;
    this.scY = scY;
    this.rad = rad;
    var me = this;
    var thumbImg = new Image();
    thumbImg.src = this.logo;
    thumbImg.onload = function() {
        me.img = thumbImg;
        me.logo = null;
    };
}

Trade.prototype.draw = function() {
    if(this.logo === null) {
        ctx.fillStyle = "#ffffff";
        cir(this.scX + (xOff * scale), this.scY + (yOff * scale), this.rad);
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.scX + (xOff * scale), this.scY + (yOff * scale), this.rad * scale, 0, Math.PI * 2, true);
        ctx.clip();
        ctx.drawImage(this.img, this.scX - (this.rad * scale) + (xOff * scale), this.scY - (this.rad * scale) + (yOff * scale), (this.rad * scale) * 2, (this.rad * scale) * 2);
        ctx.restore();
        ctx.beginPath();
        ctx.arc(this.scX + (xOff * scale), this.scY + (yOff * scale), this.rad * scale, 0, Math.PI * 2, true);
        ctx.strokeStyle = "#eeeeee";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.closePath();
    }
};