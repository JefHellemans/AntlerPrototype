var Paragraph = function(text) {
    this.parts = [];

    if(!this.checkForStyle(text, "[i]", "[/i]", "italic")) {
        if(!this.checkForStyle(text, "[b]", "[/b]", "bold")) {
            if(!this.checkForStyle(text, "[size=", "[/size]", "size")) {
                if(!this.checkForStyle(text, "[font=", "[/font]", "font")) {
                    if(!this.checkForStyle(text, "[align=", "[/align]", "align")) {
                        if(!this.checkForStyle(text, "[color=", "[/color]", "color")) {
                            this.parts = [text];
                        }
                    }
                }
            }
        }
    }
};

Paragraph.prototype.getFont = function(italic, bold, size, font) {
    if(typeof this.italic !== 'undefined') {
        italic = this.italic;
    }
    if(typeof this.bold !== 'undefined') {
        bold = this.bold;
    }
    if(typeof this.size !== 'undefined') {
        size = this.size;
    }
    if(typeof this.font !== 'undefined') {
        font = this.font;
    }
    return [italic, bold, size, font];
};

Paragraph.prototype.fontToText = function(italic, bold, size, font) {
    var t = "";
    if(italic) {
        t += "italic ";
    }
    if(bold) {
        t += "bold ";
    }
    t += size + "pt " + font;
    return t;
};

Paragraph.prototype.draw = function(ctx, scale, italic, bold, size, font, align, color, scaling, pos, width) {
    var f = this.getFont(italic, bold, size, font);
    var x = pos.x;
    if(typeof this.align !== 'undefined') {
        align = this.align;
    }
    if(typeof this.color !== 'undefined') {
        color = this.color;
    }
    if(this.parts.length === 1 && !(this.parts[0] instanceof Paragraph)) {
        if(!scaling) {
            f[2] *= 1 / scale;
        }
        if(align === "center") {
            pos = pos.addVector(new Vector2D(width, 0).mul(.5));
        }
        if(align === "right") {
            pos = pos.addVector(new Vector2D(width, 0));
        }
        ctx.font = this.fontToText(f[0], f[1], f[2], f[3]);
        ctx.textAlign = align;
        ctx.fillStyle = color;
        ctx.fillText(this.parts[0], pos.x, pos.y);
    } else {
        for (var i = 0, l = this.parts.length; i < l; i++) {
            if(typeof this.parts[i].draw === 'function') {
                this.parts[i].draw(ctx, scale, f[0], f[1], f[2], f[3], align, color, scaling, pos, width);
            }
            if(this.parts[i].length === 1) {
                if(typeof this.parts[i].measure === 'function') {
                    var s = this.parts[i].measure(ctx, scale, f[0], f[1], f[2], f[3], scaling);
                    pos.x += s.x;
                }
            }
        }
        pos.x = x;
    }
};

Paragraph.prototype.measure = function(ctx, scale, italic, bold, size, font, scaling) {
    var s = new Vector2D(0, 0);
    var f = this.getFont(italic, bold, size, font);
    if(this.parts.length === 1) {
        if(!scaling) {
            f[2] *= 1 / scale;
        }
        ctx.font = this.fontToText(f[0], f[1], f[2], f[3]);
        s.y = f[2];
        s.x = ctx.measureText(this.parts[0]).width;
    } else {
        for (var i = 0, l = this.parts.length; i < l; i++) {
            if(typeof this.parts[i].measure === 'function') {
                var partSize = this.parts[i].measure(ctx, scale, f[0], f[1], f[2], f[3], scaling);
                if(partSize.y > s.y) {
                    s.y = partSize.y;
                }
                s.x += partSize.x;
            }
        }
    }
    return s;
};

Paragraph.prototype.checkForStyle = function(text, opening, closing, style) {
    var temp = text.split(opening);
    if(temp.length >= 2) {
        var t = temp.shift();
        if(t.length > 0 && !(t instanceof Paragraph)) {
            this.parts.push(new Paragraph(t));
        } else if(t instanceof Paragraph) {
            this.parts.push(t);
        }
        for(var i = 0, l = temp.length; i < l; i++) {
            var p = temp[i].split(closing);
            if(opening.indexOf("=") > -1) {
                p[0] = p[0].split("]");
                var v = p[0].shift();
                var split = "";
                for(var j = 0, m = p[0].length; j < m; j++) {
                    split += p[0][j];
                    if(j < m - 1) {
                        split += "]";
                    }
                }
                p[0] = split;
            }
            var styled = new Paragraph(p[0]);

            if(p[1].length === 0 && !(p[1] instanceof Paragraph)) {
                this.parts.push(styled);
            } else if(p[1] instanceof Paragraph) {
                this.parts.push(styled);
                this.parts.push(p[1]);
            } else {
                this.parts.push(styled);
                this.parts.push(new Paragraph(p[1]));
            }
            switch(style) {
                case "italic":
                    styled.italic = true;
                    break;
                case "bold":
                    styled.bold = true;
                    break;
                case "size":
                    styled.size = v;
                    break;
                case "font":
                    styled.font = v;
                    break;
                case "align":
                    styled.align = v;
                    break;
                case "color":
                    styled.color = v;
                    break;
            }
        }
        return true;
    } else {
        return false;
    }
};