function Trade(imgSrc, vector, traders) {
    this.img = null;
    this.imgSrc = imgSrc;
    this.savedPos = vector;
    this.actualPos = null;
    this.traders = traders;
    this.percentage = 0;
    this.open = false;
    this.animationPos = 0;
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
    var angle = 180 / (this.traders.length + 1);
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
        c.cirLogo(this.actualPos.x, this.actualPos.y, this.rad, this.img);
        var overall = 0;
        for(var i = 0; i < this.traders.length; i++) {
            var t = this.traders[i];
            overall += t.totalPercentage * t.percentage * t.difference;
            t.draw(c);
        }
        var text = Math.floor(overall * c.startingBudget * 100) / 100;
        var onePromille = c.startingBudget / 1000;
        if(text < -onePromille) {
            c.ctx.fillStyle = "#E74C3C";
        } else if(text > onePromille) {
            c.ctx.fillStyle = "#36B5DB";
        } else {
            c.ctx.fillStyle = "#2C3E50";
        }
        if(text < 0) {
            text = "- € " + Math.abs(text);
        } else {
            text = "€ " + text;
        }
        var size = 12 * c.scale;
        if(size >= 8) {
            c.ctx.font = size + "pt SourceSansPro";
            var txtSize = c.ctx.measureText(text).width;
            c.ctx.beginPath();
            c.ctx.rect(this.actualPos.x - (txtSize / 2) - (10 * c.scale), this.actualPos.y + ((this.rad * c.scale) / 2) - (size / 2) - (10 * c.scale), txtSize + (20 * c.scale), size + (20 * c.scale));
            c.ctx.closePath();
            c.ctx.fill();
            c.ctx.fillStyle = "#ffffff";
            c.ctx.fillText(text, this.actualPos.x - (txtSize / 2), this.actualPos.y + ((this.rad * c.scale) / 2) + (size / 2));
        } else {
            c.cir(this.actualPos.x, this.actualPos.y + ((this.rad * c.scale) / 2), (this.rad * c.scale * Math.abs(overall) * 10) + (this.rad * c.scale * 0.1));
        }
    }
};