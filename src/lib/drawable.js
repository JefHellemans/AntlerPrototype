var Drawable = function() {
    this.color = "#000000";
    this.img = null;
    this.imgFill = true;

    this.borderColor = "#000000";
    this.borderWidth = 0;
    this.borderScaling = true;

    this.text = [];
    this.textItalic = false;
    this.textBold = false;
    this.textSize = 0;
    this.textFont = "Arial";
    this.textAlign = "left";
    this.textColor = "#000000";
    this.textPos = new Vector2D(0, 0);
    this.textAnchor = new Vector2D(0, 0);
    this.textBackground = null;
    this.textSpacing = 1.2;
    this.textPadding = new Vector2D(0, 0);
    this.textScaling = true;

    this.pos = new Vector2D(0, 0);
    this.radius = 0;
    this.size = new Vector2D(0, 0);

    this.show = true;
    this.requestRedraw = false;
    this.animations = [];

    this.drawRectangle = function(ctx) {
        ctx.fillStyle = this.color;
        var p = new Vector2D(0, 0).subVector(this.size.div(2));
        ctx.fillRect(p.x, p.y, this.size.x, this.size.y);
    };
    this.drawImage = function(ctx) {
        if(this.img !== null) {
            var div = 0;
            if(this.imgFill) {
                if(this.img.width > this.img.height) {
                    div = this.img.height;
                } else {
                    div = this.img.width;
                }
            } else {
                if(this.img.width > this.img.height) {
                    div = this.img.width;
                } else {
                    div = this.img.height;
                }
            }
            var clip = new Vector2D(this.img.width, this.img.height).div(div).mulVector(this.size).subVector(this.size).mul(-.5);
            var p = new Vector2D(0, 0).subVector(this.size.div(2));
            ctx.drawImage(this.img, clip.x, clip.y, this.size.x, this.size.y, p.x, p.y, this.size.x, this.size.y);
        } else {
            console.log("[DRAWABLE][drawImage]: Could not draw image for", this, "since this.img is null");
        }
    };
    this.drawBorder = function(ctx, scale) {
        ctx.strokeStyle = this.borderColor;
        var brdw = this.borderWidth;
        if(!this.borderScaling) {
            brdw *= 1 / scale;
        }
        ctx.lineWidth = brdw;
        var p = new Vector2D(0, 0).subVector(this.size.div(2));
        ctx.strokeRect(p.x, p.y, this.size.x, this.size.y);
    };

    this.drawCircle = function(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, 2 * Math.PI, false);
        ctx.closePath();
        ctx.fill();
    };
    this.drawImageInCircle = function(ctx) {
        if(this.img !== null) {
            ctx.save();
            ctx.beginPath();
            ctx.arc(0, 0, this.radius, 0, Math.PI * 2, true);
            ctx.clip();
            var div = 1;
            var p = new Vector2D(0, 0).sub(this.radius);
            var s = new Vector2D(this.radius, this.radius).mul(2);
            var clip = new Vector2D(0, 0);
            if(this.imgFill) {
                if(this.img.width > this.img.height) {
                    div = this.img.height;
                } else {
                    div = this.img.width;
                }
                clip = new Vector2D(this.img.width, this.img.height).div(div).sub(1).mul(div).div(2);
            } else {
                if(this.img.width > this.img.height) {
                    div = this.img.width;
                } else {
                    div = this.img.height;
                }
                var ratio = new Vector2D(this.img.width, this.img.height).div(div).sub(1).mul(-1);
                if(ratio.x !== 0) {
                    ratio.x = 1;
                }
                if(ratio.y !== 0) {
                    ratio.y = 1;
                }
                s = new Vector2D(this.img.width, this.img.height).div(div).mulVector(s);
                p = p.subVector(ratio.mulVector(s).div(2));
                p = p.addVector(ratio.mul(this.radius));
            }
            ctx.drawImage(this.img, clip.x, clip.y, this.img.width - clip.x, this.img.height - clip.y, p.x, p.y, s.x, s.y);
            ctx.closePath();
            ctx.restore();
        } else {
            console.log("[DRAWABLE][drawImageInCircle]: Could not draw image for", this, "since this.img is null");
        }
    };
    this.drawBorderForCircle = function(ctx, scale) {
        ctx.beginPath();
        ctx.strokeStyle = this.borderColor;
        var brdw = this.borderWidth;
        if(!this.borderScaling) {
            brdw *= 1 / scale;
        }
        ctx.lineWidth = brdw;
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2, true);
        ctx.stroke();
        ctx.closePath();
    };

    this.drawText = function(ctx, scale) {
        if(this.text !== null) {
            var w = 0;
            var h = 0;
            var i = 0;
            var l = 0;
            var paragraphPos = new Vector2D(0, 0);
            for(l = this.text.length; i < l; i++) {
                var paragraphSize = this.text[i].measure(ctx, scale, this.textItalic, this.textBold, this.textSize, this.textFont, this.textScaling);
                if(paragraphSize.x > w) {
                    w = paragraphSize.x;
                }
                h += paragraphSize.y;
                if(l - i > 1) {
                    var spacing = this.textSpacing * this.textSize;
                    if (!this.textScaling) {
                        spacing *= 1 / scale;
                    }
                    h += spacing;
                }
            }
            if (this.textBackground !== null) {
                ctx.fillStyle = this.textBackground;
                var padding = this.textPadding;
                if(!this.textScaling) {
                    padding = padding.mul(1 / scale);
                }
                var blockSize = padding.mul(2).addVector(new Vector2D(w, h));
                var txtPos = this.textPos;
                if(this.radius !== 0) {
                    txtPos = txtPos.mul(this.radius);
                }
                if(this.size.length() !== 0) {
                    txtPos = txtPos.mulVector(this.size);
                }
                var blockPos = txtPos.subVector(blockSize.mulVector(this.textAnchor));
                ctx.fillRect(blockPos.x, blockPos.y, blockSize.x, blockSize.y);
                paragraphPos = blockPos.addVector(padding);
            }
            for (i = 0, l = this.text.length; i < l; i++) {
                ctx.fillStyle = this.textColor;
                var height = this.text[i].measure(ctx, scale, this.textItalic, this.textBold, this.textSize, this.textFont, this.textScaling).y;
                var space = this.textSpacing * this.textSize;
                if(!this.textScaling) {
                    space *= 1 / scale;
                }
                height += space;
                this.text[i].draw(ctx, scale, this.textItalic, this.textBold, this.textSize, this.textFont, this.textAlign, this.textColor, this.textScaling, paragraphPos, w);
                paragraphPos = paragraphPos.addVector(new Vector2D(0, height));
            }
        } else {
            console.log("[DRAWABLE][drawText]: Could not draw text for", this, "since this.text is null");
        }
    };

    this.animate = function(property, result, time, easing, cb) {
        var animation = new Animation(this, this[property], result, time, easing, cb);
        this.animations.push(animation);
        var me = this;
        animation.start(function(val) {
            me[property] = val;
            me.requestRedraw = true;
        });
        return animation;
    };
    this.animateVector = function(property, result, time, easing, cb) {
        var me = this;
        var animX = new Animation(this, this[property].x, result.x, time, easing, cb);
        var animY = new Animation(this, this[property].y, result.y, time, easing, cb);
        this.animations.push(animX);
        this.animations.push(animY);
        animX.start(function(val) {
            me[property].x = val;
            me.requestRedraw = true;
        });
        animY.start(function(val) {
            me[property].y = val;
            me.requestRedraw = true;
        });
    };
    this.stopAnimation = function(animation) {
        animation.stop();
        var index = this.animations.indexOf(animation);
        if(index > -1) {
            this.animations.splice(index, 1);
        }
    };
    this.stopAnimating = function() {
        for (var i = this.animations.length - 1; i >= 0; i--) {
            this.animations[i].stop();
        }
        this.animations = [];
    };
};

Drawable.prototype.setImage = function(imgSrc, cb) {
    this.img = new Image();
    this.img.src = imgSrc;
    if(typeof cb === 'function' && this.show) {
        this.img.onload = cb;
    }
};
Drawable.prototype.setText = function(text) {
    this.txt = text;
    var txt = text.split('\n');
    for (var i = 0, l = txt.length; i < l; i++) {
        this.text.push(new Paragraph(txt[i]));
    }
};

Drawable.prototype.interaction = function(mousePos, scale) {
    var mouseDifference = mousePos.subVector(this.pos.mul(scale));
    var difference = 0;
    if(this.radius !== 0) {
        difference = this.radius * scale;
    }
    if(this.size.length() !== 0) {
        difference = this.size.length() * scale;
    }
    if (mouseDifference.length() <= difference && this.show) {
        return this;
    } else {
        return false;
    }
};