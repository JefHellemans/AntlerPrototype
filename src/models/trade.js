var Trade = function(stockPrice, traders) {
    this.stockPrice = stockPrice;
    this.traders = traders;
    this.drawable = new Drawable();

    this.difference = 0;
    for(var i = 0, l = this.traders.length; i < l; i++) {
        this.traders[i].changeStockPrice(this.stockPrice);
        this.difference += this.traders[i].difference;
    }
    this.difference = Math.floor(this.difference * 100) / 100;
    this.drawable.setText(this.difference.toLocaleString('be-NL', { style: 'currency', currency: 'EUR'}));
    if(this.difference >= 0) {
        this.drawable.textBackground = "#36B5DB";
        this.drawable.textReplaceColor = "#36B5DB";
    } else {
        this.drawable.textBackground = "#E74C3C";
        this.drawable.textReplaceColor = "#E74C3C";
    }
    this.reqPartial = false;
    this.new = true;
    this.lineColor = "#B3B369";
    this.open = false;

    this.drawable.textSize = 10;
    this.drawable.imgFill = false;
    var x = Math.floor(Math.random() * window.innerWidth - (window.innerWidth / 2));
    var y = Math.floor(Math.random() * (window.innerHeight - 50) - ((window.innerHeight - 50) / 2));
    this.drawable.pos = new Vector2D(x, y);
    this.drawable.radius = Math.floor((Math.random() * 35) + 35);
    this.drawable.color = "#ffffff";
    this.drawable.borderWidth = 2;
    this.drawable.borderColor = "#B3B369";
    this.drawable.borderScaling = false;
    this.drawable.textColor = "#ffffff";
    this.drawable.textFont = "SourceSansPro";
    this.drawable.textAnchor = new Vector2D(0.5, 0.5);
    this.drawable.textPos = new Vector2D(0, 0.5);
    this.drawable.textPadding = new Vector2D(10, 10);
    this.drawable.textReplace = 15;

    var me = this;
    setInterval(function() {
        var d = Math.random() / 10;
        var pOm = Math.floor(Math.random() * 2);
        if(pOm === 1) {
            d = -d;
        }
        me.stockPrice = Math.floor((me.stockPrice + d) * 100) / 100;
        me.difference = 0;
        for(var i = 0, l = me.traders.length; i < l; i++) {
            me.traders[i].changeStockPrice(me.stockPrice);
            me.difference += me.traders[i].difference;
        }
        me.difference = Math.floor(me.difference * 100) / 100;
        if(!me.open) {
            me.drawable.setText(me.difference.toLocaleString('be-NL', { style: 'currency', currency: 'EUR'}));
            if(me.difference >= 0) {
                me.drawable.textBackground = "#36B5DB";
                me.drawable.textReplaceColor = "#36B5DB";
            } else {
                me.drawable.textBackground = "#E74C3C";
                me.drawable.textReplaceColor = "#E74C3C";
            }
        } else {
            if(me.difference >= 0) {
                me.drawable.textReplaceColor = "#36B5DB";
            } else {
                me.drawable.textReplaceColor = "#E74C3C";
            }
            me.drawable.textBackground = "#2C3E50";
            me.drawable.setText(me.stockPrice.toLocaleString('be-NL', { style: 'currency', currency: 'EUR'}));
        }
        me.reqPartial = true;
    }, 2000);

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
            if(this.new) {
                this.new = false;
                this.drawable.borderColor = "#eeeeee";
                this.lineColor = "#2C3E50";
            }
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

    this.preDraw = function(ctx, scale) {
        if(this.drawable.show) {
            ctx.strokeStyle = this.lineColor;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(this.drawable.pos.x, this.drawable.pos.y);
            ctx.closePath();
            ctx.stroke();
        }
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
            this.drawable.drawBorderForCircle(ctx, scale);
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

    this.partial = function(ctx, scale) {
        if(this.drawable.show) {
            ctx.save();
            ctx.translate(this.drawable.pos.x, this.drawable.pos.y);
            var angle = 180 / (this.traders.length + 1);
            for(var i = 0, l = this.traders.length; i < l; i++) {
                var alpha = angle * (i + 1 - ((this.traders.length + 1) / 2));
                this.traders[i].postDraw(ctx, scale, alpha);
            }
            if((this.drawable.textSize * scale) >= this.drawable.textMinSize) {
                this.drawable.drawText(ctx, scale);
            }
            ctx.restore();
        }
    };

    this.clicked = function() {
        var i = 0, l = 0, t = null, me = this;
        if(!this.open) {
            for(l = this.traders.length; i < l; i++) {
                t = this.traders[i];
                t.drawable.show = true;
                t.drawable.animateVector("pos", new Vector2D(0, this.drawable.radius + t.drawable.radius + 15), 300, "easeInOut", null);
            }
            this.drawable.animateVector("textPadding", new Vector2D(0, 0), 150, "easeIn", function(done, drawable) {
                drawable.animateVector("textPadding", new Vector2D(10, 10), 150, "easeOut", null);
            });
            this.drawable.animate("textSize", 0, 150, "easeIn", function(done, drawable) {
                drawable.textBackground = "#2C3E50";
                drawable.setText(me.stockPrice.toLocaleString('be-NL', { style: 'currency', currency: 'EUR'}));
                me.open = true;
                drawable.animate("textSize", 10, 150, "easeOut", null);
            });
        } else {
            for(l = this.traders.length; i < l; i++) {
                t = this.traders[i];
                if(t.open) {
                    t.clicked();
                }
                t.drawable.animateVector("pos", new Vector2D(0, 0), 300, "easeInOut", null);
            }
            this.drawable.animateVector("textPadding", new Vector2D(0, 0), 150, "easeIn", function(done, drawable) {
                drawable.animateVector("textPadding", new Vector2D(10, 10), 150, "easeOut", null);
            });
            this.drawable.animate("textSize", 0, 150, "easeIn", function(done, drawable) {
                drawable.setText(me.difference.toLocaleString('be-NL', { style: 'currency', currency: 'EUR'}));
                if(me.difference >= 0) {
                    drawable.textBackground = "#36B5DB";
                } else {
                    drawable.textBackground = "#E74C3C";
                }
                me.open = false;
                drawable.animate("textSize", 10, 150, "easeOut", null);
            });
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

    this.requestPartial = function() {
        for(var i = 0, l = this.traders.length; i < l; i++) {
            if(this.traders[i].requestPartial) {
                return true;
            }
        }
        return this.reqPartial;
    }
};