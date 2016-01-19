var Trade = function(id, stockPrice, traders, pos) {
    this.id = id;
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
    this.lineColor = "#B3B369";
    this.open = false;

    this.drawable.textSize = 10;
    this.drawable.radius = Math.floor((Math.random() * 35) + 35);
    this.drawable.imgFill = false;
    if(pos === null) {
        var x = Math.floor(Math.random() * window.innerWidth - (window.innerWidth / 2));
        var y = Math.floor(Math.random() * (window.innerHeight - 50) - ((window.innerHeight - 50) / 2));
        while(new Vector2D(x, y).length() < (100 + this.drawable.radius) || new Vector2D(x, y).length() > (new Vector2D(window.innerWidth, window.innerHeight - 50).div(2).length() - this.drawable.radius)) {
            x = Math.floor(Math.random() * window.innerWidth - (window.innerWidth / 2));
            y = Math.floor(Math.random() * (window.innerHeight - 50) - ((window.innerHeight - 50) / 2));
        }
        this.drawable.animateVector("pos", new Vector2D(x, y), 1000, "easeInOut", null);
    }
    else {
        this.drawable.animateVector("pos", pos, 1000, "easeInOut", null);
    }
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

    this.setStockPrice = function(stockPrice) {
        this.stockPrice = stockPrice;
        this.difference = 0;
        for(var i = 0, l = this.traders.length; i < l; i++) {
            this.traders[i].changeStockPrice(this.stockPrice);
            this.difference += this.traders[i].difference;
        }
        this.difference = Math.floor(this.difference * 100) / 100;
        if(!this.open) {
            this.drawable.setText(this.difference.toLocaleString('be-NL', { style: 'currency', currency: 'EUR'}));
            if(this.difference >= 0) {
                this.drawable.textBackground = "#36B5DB";
                this.drawable.textReplaceColor = "#36B5DB";
            } else {
                this.drawable.textBackground = "#E74C3C";
                this.drawable.textReplaceColor = "#E74C3C";
            }
        } else {
            if(this.difference >= 0) {
                this.drawable.textReplaceColor = "#36B5DB";
            } else {
                this.drawable.textReplaceColor = "#E74C3C";
            }
            this.drawable.textBackground = "#2C3E50";
            this.drawable.setText(this.stockPrice.toLocaleString('be-NL', { style: 'currency', currency: 'EUR'}));
        }
        this.drawable.requestRedraw = true;
    };

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
        for(var i = 0, l = this.traders.length; i < l; i++) {
            var o = this.traders[i].interaction(relPos, scale);
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

    this.calcTraders = function() {
        var angle = 180 / (this.traders.length + 1);
        for(var i = 0, l = this.traders.length; i < l; i++) {
            var alpha = (angle * (i + 1 - ((this.traders.length + 1) / 2))) - 90;
            this.traders[i].drawable.animate("rotation", alpha, 300, "easeInOut", null);
        }
    };
    this.calcTraders();

    this.preDraw = function(ctx, scale) {
        if(this.drawable.show) {
            ctx.save();
            ctx.globalAlpha *= this.drawable.opacity;
            ctx.strokeStyle = this.lineColor;
            ctx.lineWidth = 0.5;
            var newTrader = false;
            for(var i = 0, l = this.traders.length; i < l; i++) {
                if(this.traders[i].new) {
                    newTrader = true;
                }
            }
            if(newTrader) {
                this.lineColor = "#B3B369";
            } else {
                this.lineColor = "#2C3E50";
            }
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(this.drawable.pos.x, this.drawable.pos.y);
            ctx.closePath();
            ctx.stroke();
            ctx.restore();
        }
    };

    this.draw = function(ctx, scale) {
        if(this.drawable.show) {
            ctx.save();
            ctx.translate(this.drawable.pos.x, this.drawable.pos.y);
            ctx.globalAlpha *= this.drawable.opacity;
            var newTrader = false;
            for(var i = 0, l = this.traders.length; i < l; i++) {
                this.traders[i].draw(ctx, scale);
                if(this.traders[i].new) {
                    newTrader = true;
                }
            }
            if(newTrader) {
                this.drawable.borderColor = "#B3B369";
            } else {
                this.drawable.borderColor = "#eeeeee";
            }
            this.drawable.drawCircle(ctx);
            this.drawable.drawImageInCircle(ctx);
            this.drawable.drawBorderForCircle(ctx, scale);
            this.drawable.drawText(ctx, scale);
            ctx.restore();
        }
    };

    this.delete = function(trades) {
        var index = trades.indexOf(this);
        for(var i = 0, l = this.traders.length; i < l; i++) {
            this.traders[0].delete(trades, index);
        }
    };

    this.animateDelete = function(trades, index) {
        this.drawable.animate("textSize", 0, 300, "easeInOut", null);
        this.drawable.animate("textReplace", 0, 300, "easeInOut", null);
        this.drawable.animateVector("textPadding", new Vector2D(0, 0), 300, "easeInOut", null);
        this.drawable.animate("opacity", 0, 300, "easeInOut", null);
        this.drawable.animate("radius", 0, 300, "easeInOut", function() {
            trades.splice(index, 1);
        });
    };

    this.postDraw = function(ctx, scale) {
        if(this.drawable.show) {
            ctx.save();
            ctx.globalAlpha *= this.drawable.opacity;
            ctx.translate(this.drawable.pos.x, this.drawable.pos.y);
            for(var i = 0, l = this.traders.length; i < l; i++) {
                this.traders[i].postDraw(ctx, scale);
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
            this.drawable.animate("textReplace", 0, 150, "easeIn", function(done, drawable) {
                drawable.animate("textReplace", 15, 150, "easeOut", null);
            });
            this.drawable.animate("textSize", 0, 150, "easeIn", function(done, drawable) {
                drawable.textBackground = "#2C3E50";
                drawable.setText(me.stockPrice.toLocaleString('be-NL', { style: 'currency', currency: 'EUR'}));
                me.open = true;
                drawable.animate("textSize", 10, 150, "easeOut", null);
            });
        } else {
            var f = function(done, drawable) {
                drawable.show = false;
            };
            for(l = this.traders.length; i < l; i++) {
                t = this.traders[i];
                if(t.open) {
                    t.clicked();
                }
                t.drawable.animateVector("pos", new Vector2D(0, 0), 300, "easeInOut", f);
            }
            this.drawable.animateVector("textPadding", new Vector2D(0, 0), 150, "easeIn", function(done, drawable) {
                drawable.animateVector("textPadding", new Vector2D(10, 10), 150, "easeOut", null);
            });
            this.drawable.animate("textReplace", 0, 150, "easeIn", function(done, drawable) {
                drawable.animate("textReplace", 15, 150, "easeOut", null);
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
};