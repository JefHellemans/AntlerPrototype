function Trader(name, amount, inAt, type, comment) {
    this.name = name;
    this.amount = amount;
    this.inAt = inAt;
    this.comment = comment;
    this.type = type;
    this.difference = 0;
    this.drawable = new Drawable();

    this.drawable.color = "#ffffff";

    this.drawable.borderColor = "#eeeeee";
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

    this.open = false;
    this.requestPartial = false;

    this.changeStockPrice = function(stockPrice) {
        var preset = "[b]" + this.name + "[/b][align=right][color=";
        var diff = Math.floor((stockPrice - this.inAt) * this.amount * 100) / 100;
        var pos = "#36B5DB";
        var neg = "#E74C3C";
        if(this.type === 0) {
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
        if(this.type === 0) {
            preset += pos + "]";
        } else {
            preset += neg + "]";
        }
        preset += amount;
        if(this.type === 0) {
            preset += " long at ";
        } else {
            preset += " short at ";
        }
        preset += inAt.toLocaleString('be-NL', {style: 'currency', currency: 'EUR'}) + "[/color][/i]\n";
        this.drawable.setText(preset + this.comment);
    };

    this.draw = function(ctx, scale, alpha) {
        if(this.drawable.show) {
            var p = this.drawable.pos;
            this.drawable.pos = this.drawable.pos.rotate(alpha - 90);
            ctx.save();
            ctx.translate(this.drawable.pos.x, this.drawable.pos.y);
            this.drawable.drawCircle(ctx);
            this.drawable.drawImageInCircle(ctx);
            this.drawable.drawBorderForCircle(ctx, scale);
            ctx.restore();
            this.drawable.pos = p;
        }
    };

    this.postDraw = function(ctx, scale, alpha) {
        if(this.drawable.show) {
            var p = this.drawable.pos;
            this.drawable.pos = this.drawable.pos.rotate(alpha - 90);
            ctx.save();
            ctx.translate(this.drawable.pos.x, this.drawable.pos.y);
            this.drawable.drawText(ctx, scale);
            ctx.restore();
            this.drawable.pos = p;
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

    this.interaction = function(mousePos, scale, alpha) {
        var mouseDifference = mousePos.subVector(this.drawable.pos.rotate(alpha - 90).mul(scale));
        var difference = 0;
        if (this.drawable.radius !== 0) {
            difference = this.drawable.radius * scale;
        }
        if (this.drawable.size.length() !== 0) {
            difference = this.drawable.size.length() * scale;
        }
        if (mouseDifference.length() <= difference && this.drawable.show) {
            return this;
        } else {
            return false;
        }
    };
}