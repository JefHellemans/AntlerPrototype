function Trader(name, totalPercentage, inAt, percentage, comment, type) {
    this.name = name;
    this.totalPercentage = totalPercentage;
    this.percentage = percentage;
    this.inAt = inAt;
    this.comment = comment;
    this.type = type;
    this.drawable = new Drawable();

    this.drawable.color = "#ffffff";

    this.drawable.borderColor = "#eeeeee";
    this.drawable.borderWidth = 2;
    this.drawable.borderScaling = false;

    this.drawable.setText("[b]" + this.name + "[/b][i][align=right][color=#E74C3C]Test[/color][/align][/i]\n" + comment);
    this.drawable.textFont = "SourceSansPro";
    this.drawable.textAnchor = new Vector2D(0, 1);
    this.drawable.textBackground = "#ffffff";
    this.drawable.textPadding = new Vector2D(0, 0);
    this.drawable.textScaling = false;
    this.drawable.textPos = new Vector2D(1, -1);
    this.drawable.textColor = "#36B5DB";

    this.drawable.pos = new Vector2D(0, 0);

    this.drawable.radius = 25;

    this.drawable.show = false;

    this.open = false;

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