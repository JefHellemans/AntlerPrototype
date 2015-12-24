var Trade = function(stockPrice, traders) {
    this.stockPrice = stockPrice;
    this.roi = 0;
    this.traders = traders;
    this.drawable = new Drawable();
    this.percentage = 0;
    for(var i = 0, l = this.traders.length; i < l; i++) {
        var t = this.traders[i];
        this.percentage += t.totalPercentage * t.percentage;
        t.pos = new Vector2D(0, 0);
    }

    this.open = false;
    this.drawable.textSize = 12;
    this.drawable.imgFill = false;

    this.interaction = function(mousePos, scale) {
        var mouseDifference = mousePos.subVector(this.drawable.pos.mul(scale));
        var difference = 0;
        if(this.drawable.radius !== 0) {
            difference = this.drawable.radius * scale;
        }
        if(this.drawable.size.length() !== 0) {
            difference = this.drawable.size.length() * scale;
        }
        if (mouseDifference.length() <= difference) {
            return this;
        }
        var relPos = mousePos.subVector(this.drawable.pos.mul(scale));
        var angle = 180 / (this.traders.length + 1);
        for(var i = 0, l = this.traders.length; i < l; i++) {
            var alpha = angle * (i + 1 - ((this.traders.length + 1) / 2));
            var o = this.traders[i].interaction(relPos, scale, alpha);
            if(o !== false) {
                for(var j = 0, m = this.traders.length; j < m; j++) {
                    t = this.traders[j];
                    if (t.open) {
                        t.clicked();
                    }
                }
                return o;
            }
        }
        return false;
    };

    this.draw = function(ctx, scale) {
        if(this.drawable.show) {
            ctx.save();
            ctx.translate(this.drawable.pos.x, this.drawable.pos.y);
            var angle = 180 / (this.traders.length + 1);
            for(var i = 0, l = this.traders.length; i < l; i++) {
                var alpha = angle * (i + 1 - ((this.traders.length + 1) / 2));
                this.traders[i].draw(ctx, scale, alpha);
            }
            this.drawable.drawCircle(ctx);
            this.drawable.drawImageInCircle(ctx);
            this.drawable.drawBorderForCircle(ctx);
            this.drawable.drawText(ctx, scale);
            ctx.restore();
        }
    };

    this.postDraw = function(ctx, scale) {
        if(this.drawable.show) {
            ctx.save();
            ctx.translate(this.drawable.pos.x, this.drawable.pos.y);
            var angle = 180 / (this.traders.length + 1);
            for(var i = 0, l = this.traders.length; i < l; i++) {
                var alpha = angle * (i + 1 - ((this.traders.length + 1) / 2));
                this.traders[i].postDraw(ctx, scale, alpha);
            }
            ctx.restore();
        }
    };

    this.clicked = function() {
        var i = 0, l = 0, t = null;
        if(!this.open) {
            for(l = this.traders.length; i < l; i++) {
                t = this.traders[i];
                t.drawable.show = true;
                t.drawable.animateVector("pos", new Vector2D(0, this.drawable.radius + t.drawable.radius + 15), 300, "easeInOut", null);
            }
            this.open = true;
        } else {
            for(l = this.traders.length; i < l; i++) {
                t = this.traders[i];
                if(t.open) {
                    t.clicked();
                }
                t.drawable.animateVector("pos", new Vector2D(0, 0), 300, "easeInOut", null);
            }
            this.open = false;
        }
    };

    this.requestRedraw = function() {
        for(var i = 0, l = this.traders.length; i < l; i++) {
            if(this.traders[i].drawable.requestRedraw) {
                this.drawable.requestRedraw = true;
                this.traders[i].drawable.requestRedraw = false;
            }
        }
        if(this.drawable.requestRedraw) {
            this.drawable.requestRedraw = false;
            return true;
        }
        return false;
    };
};