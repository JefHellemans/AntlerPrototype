function Trader(name, amount, inAt, isShort, comment) {
    this.name = name;
    this.amount = amount;
    this.inAt = inAt;
    this.comment = comment;
    this.isShort = isShort;
    this.difference = 0;

    console.log(this.amount, this.inAt);
    this.drawable = new Drawable();

    this.drawable.color = "#ffffff";

    this.drawable.borderColor = "#B3B369";
    this.drawable.borderWidth = 2;
    this.drawable.borderScaling = false;
    this.drawable.textFont = "SourceSansPro";
    this.drawable.textAnchor = new Vector2D(0, 1);
    this.drawable.textBackground = "#ffffff";
    this.drawable.textPadding = new Vector2D(0, 0);
    this.drawable.textScaling = false;
    this.drawable.textPos = new Vector2D(1, -1);
    this.drawable.textColor = "#2C3E50";

    this.drawable.pos = new Vector2D(0, 0);

    this.drawable.radius = 25;

    this.drawable.show = false;

    this.new = true;
    this.open = false;

    this.changeStockPrice = function(stockPrice) {
        var preset = "[b]" + this.name + "[/b][align=right][color=";
        var diff = Math.floor((stockPrice - this.inAt) * this.amount * 100) / 100;
        var pos = "#36B5DB";
        var neg = "#E74C3C";
        if(!this.isShort) {
            this.difference = diff;
        } else {
            this.difference = -diff;
        }
        if(this.difference >= 0) {
            preset += pos + "]";
        } else {
            preset += neg + "]";
        }
        preset += this.difference.toLocaleString('be-NL', {style: 'currency', currency: 'EUR'}) + "[/color][/align]\n[i][color=";
        if(!this.isShort) {
            preset += pos + "]";
        } else {
            preset += neg + "]";
        }
        preset += amount;
        if(!this.isShort) {
            preset += " long at ";
        } else {
            preset += " short at ";
        }
        preset += inAt.toLocaleString('be-NL', {style: 'currency', currency: 'EUR'}) + "[/color][/i]\n";
        this.drawable.setText(preset + this.comment);
    };

    this.draw = function(ctx, scale) {
        if(this.drawable.show) {
            var p = this.drawable.pos.rotate(this.drawable.rotation);
            ctx.save();
            ctx.globalAlpha *= this.drawable.opacity;
            ctx.translate(p.x, p.y);
            this.drawable.drawCircle(ctx);
            this.drawable.drawImageInCircle(ctx);
            this.drawable.drawBorderForCircle(ctx, scale);
            ctx.restore();
        }
    };

    this.postDraw = function(ctx, scale) {
        if(this.drawable.show) {
            var p = this.drawable.pos.rotate(this.drawable.rotation);
            ctx.save();
            ctx.globalAlpha *= this.drawable.opacity;
            ctx.translate(p.x, p.y);
            this.drawable.drawText(ctx, scale);
            ctx.restore();
        }
    };

    this.clicked = function() {
        var me = this;
        if(!this.open) {
            this.drawable.animate("textSize", 12, 200, "easeInOut", null);
            this.drawable.animateVector("textPadding", new Vector2D(10, 10), 200, "easeInOut", function(finished, element) {
                if(finished) {
                    me.open = true;
                }
            });
        } else {
            this.drawable.animate("textSize", 0, 200, "easeInOut", null);
            this.drawable.animateVector("textPadding", new Vector2D(0, 0), 200, "easeInOut", function(finished, element) {
                if(finished) {
                    me.open = false;
                }
            });
        }
    };

    this.delete = function(trades, index) {
        var i = 0;
        if(typeof index !== 'undefined') {
            i = index;
        }
        for(var l = trades.length; i < l; i++) {
            if(typeof trades[i].traders !== 'undefined') {
                var ind = trades[i].traders.indexOf(this);
                if (ind > -1) {
                    trades[i].traders.splice(ind, 1);
                    trades[i].calcTraders();
                    if(trades[i].traders.length === 0) {
                        trades[i].animateDelete(trades, i);
                    }
                    break;
                }

            }
        }
    };

    this.interaction = function(mousePos, scale) {
        var mouseDifference = mousePos.subVector(this.drawable.pos.rotate(this.drawable.rotation).mul(scale));
        var difference = 0;
        if (this.drawable.radius !== 0) {
            difference = this.drawable.radius * scale;
        }
        if (this.drawable.size.length() !== 0) {
            difference = this.drawable.size.length() * scale;
        }
        if (mouseDifference.length() <= difference && this.drawable.show) {
            if(this.new) {
                this.new = false;
                this.drawable.borderColor = "#eeeeee";
            }
            return this;
        } else {
            return false;
        }
    };
}