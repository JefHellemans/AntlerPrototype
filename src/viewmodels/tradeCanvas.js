var trades = [];
var traders = [];
var profile = new Drawable();
var trash = new Drawable();
var logos = ["logo0.svg", "logo1.svg", "logo2.svg", "logo3.svg", "logo4.svg"];
var people = [["Crazy Heffe", "trader0.jpg"], ["Marino Hostino", "trader1.jpg"], ["Nicolsh Lavanda", "trader2.jpg"], ["xXrobke69Xx", "trader3.jpg"]];

(function() {
    profile.setImage("dist/images/profiles/profile.jpg");
    profile.radius = 100;
    profile.color = "#ffffff";
    profile.borderColor = "#eeeeee";
    profile.borderScaling = false;
    profile.borderWidth = 2;
    profile.textSize = 12;
    profile.textColor = "#ffffff";
    profile.textFont = "SourceSansPro";
    profile.textAnchor = new Vector2D(0.5, 0.5);
    profile.textPos = new Vector2D(0, 0.5);
    profile.textPadding = new Vector2D(10, 10);
    profile.textReplace = 15;
    trades.push(profile);

    trash.setImage("dist/images/misc/trash.svg");
    trash.radius = 50;
    trash.color = "#eeeeee";
    trash.borderColor = "#eeeeee";
    trash.borderScaling = false;
    trash.borderWidth = 2;
    trash.pos = new Vector2D(window.innerWidth - 100, window.innerHeight - 150);

    for(var j = 0; j < 4; j++) {
        var amount = Math.floor(Math.random() * 50);
        var inAt = Math.floor((Math.random() * 20000)) / 100;
        var type = Math.floor(Math.random() * 2);
        var trader = [amount, inAt, type];
        traders.push(trader);
    }
    var diff = 0;
    for(var i = 0; i < 5; i++) {
        var r = Math.ceil(Math.random() * 4);
        var ppl = [];
        var stockPrice = Math.floor((Math.random() * 200) * 100) / 100;
        for(var k = 0; k < r; k++) {
            var t = new Trader(people[k][0], traders[k][0], traders[k][1], traders[k][2], "This looks good!\nI can even put a second line\n\nAnd even more");
            t.drawable.setImage("dist/images/profiles/" + people[k][1], function() {
                canvas.draw();
            });
            t.percentage = (Math.random() * 0.4) + 0.1;
            ppl.push(t);
        }
        var trade = new Trade(stockPrice, ppl, null);
        diff += trade.difference;
        trade.drawable.setImage("dist/images/logos/" + logos[i], function() {
            canvas.draw();
        });
        trades.push(trade);
    }
    trades.push(trash);
    if(diff >= 0) {
        profile.textBackground = "#36B5DB";
        profile.textReplaceColor = "#36B5DB";
    } else {
        profile.textBackground = "#E74C3C";
        profile.textReplaceColor = "#E74C3C";
    }
    profile.setText((Math.floor(diff * 100) / 100).toLocaleString('be-NL', {style: 'currency', currency: 'EUR'}));
    var canvas = new Canvas(0, 50, window.innerWidth, window.innerHeight - 50, "trades", trades);
    canvas.drawCallback = function() {
        var diff = 0;
        for(var i = 0, l = canvas.objects.length; i < l; i++) {
            if(typeof canvas.objects[i].difference !== 'undefined') {
                diff += canvas.objects[i].difference;
            }
        }
        if(diff >= 0) {
            profile.textBackground = "#36B5DB";
            profile.textReplaceColor = "#36B5DB";
        } else {
            profile.textBackground = "#E74C3C";
            profile.textReplaceColor = "#E74C3C";
        }
        profile.setText((Math.floor(diff * 100) / 100).toLocaleString('be-NL', {style: 'currency', currency: 'EUR'}));
    };
    profile.draw = function(ctx, scale) {
        this.drawCircle(ctx);
        this.drawImageInCircle(ctx);
        this.drawBorderForCircle(ctx, scale);
        this.drawText(ctx, scale);
    };
    trash.interaction = function(mousePos) {
        var mouseDifference = mousePos.subVector(canvas.margin).subVector(this.pos);
        var difference = this.radius * canvas.scale;
        return (mouseDifference.length() <= difference && this.show);
    };
    trash.draw = function(ctx, scale) {
        var p = this.pos.subVector(canvas.offset).subVector(canvas.center).mul(1 / canvas.scale);
        ctx.save();
        ctx.translate(p.x, p.y);
        this.drawCircle(ctx);
        this.drawImageInCircle(ctx);
        this.drawBorderForCircle(ctx, scale);
        ctx.restore();
    };
    canvas.draw();
    document.getElementById("trades").addEventListener("mousedown", function(e) {
        interactionStart(e);
    });
    document.getElementById("trades").addEventListener("touchstart", function(e) {
        var touch = e.touches[0];
        interactionStart(touch);
    });
    var interactionStart = function(e) {
        canvas.interactionStart(e, function(object, mousePos) {
            var index;
            if(object instanceof Trade) {
                index = canvas.objects.indexOf(object);
                canvas.objects.push(canvas.objects.splice(index, 1)[0]);
            }
            if(object instanceof Trader) {
                object.drawable.returnPos = object.drawable.pos;
            }
            if(object === "self") {
                index = canvas.objects.indexOf(trash);
                canvas.objects.splice(index, 1);
                canvas.objects.push(trash);
                canvas.draw();
            }
            canvas.selected = object;
            canvas.mousePos = mousePos;
        });
    };
    document.getElementById("trades").addEventListener("mousemove", function(e) {
        interactionMove(e);
    });
    document.getElementById("trades").addEventListener("touchmove", function(e) {
        var touch = e.touches[0];
        interactionMove(touch);
    });
    var interactionMove = function(e) {
        canvas.interactionMove(e, function(object, mousePos, difference) {
            if(object instanceof Trade) {
                object.drawable.opacity = 0.5;
                object.drawable.pos = mousePos;
            }
            if(object instanceof Trader) {
                object.drawable.opacity = 0.5;
                object.drawable.pos = object.drawable.pos.addVector(difference.rotate(-object.drawable.rotation).mul(1 / canvas.scale));
            }
            if(trash.interaction(new Vector2D(e.pageX, e.pageY))) {
                trash.color = "#E74C3C";
            } else {
                trash.color = "#eeeeee";
            }
            canvas.draw();
        });
    };
    document.getElementById("trades").addEventListener("mouseup", function(e) {
        interactionStop(e);
    });
    document.getElementById("trades").addEventListener("touchend", function(e) {
        var touch = e.touches[0];
        interactionStop(touch);
    });
    document.body.addEventListener('touchstart', function(e) {
        e.preventDefault();
    });
    var interactionStop = function(e) {
        canvas.interactionStop(function(click, object) {
            var i, l;
            if(click) {
                if(object instanceof Trade) {
                    object.drawable.opacity = 1;
                    for (i = 0, l = canvas.objects.length; i < l; i++) {
                        if (canvas.objects[i].open && canvas.objects[i] !== object) {
                            canvas.objects[i].clicked();
                        }
                    }
                }
                if(object instanceof Trader) {
                    object.drawable.opacity = 1;
                }
                if(object === "self") {
                    for (i = 0, l = canvas.objects.length; i < l; i++) {
                        if (canvas.objects[i].open) {
                            canvas.objects[i].clicked();
                        }
                    }
                }
                if(typeof object.clicked === 'function') {
                    object.clicked();
                }
            } else {
                if(object instanceof Trade) {
                    object.drawable.opacity = 1;
                    if(trash.interaction(new Vector2D(e.pageX, e.pageY))) {
                        object.delete(canvas.objects);
                    }
                }
                if(object instanceof Trader) {
                    object.drawable.opacity = 1;
                    if(object.drawable.returnPos.length() !== object.drawable.pos.length() && object.drawable.returnPos.x !== object.drawable.pos.x) {
                        object.drawable.animateVector("pos", object.drawable.returnPos, 500, "easeInOut", null);
                    }
                    if(trash.interaction(new Vector2D(e.pageX, e.pageY))) {
                        object.delete(canvas.objects);
                    }
                }
            }
            trash.color = "#eeeeee";
        });
        canvas.draw();
    };
    document.getElementById("trades").addEventListener("wheel", function(e) {
        var scale = canvas.scale + (e.wheelDelta / 300);
        e.preventDefault();
        if(scale > 1.8) {
            scale = 1.8;
        }
        if(scale < 0.4) {
            scale = 0.4;
        }
        scale = Math.floor(scale * 100) / 100;
        canvas.scale = scale;
        trash.radius = 50 / canvas.scale;
        document.getElementById("scaleCanvas").value = canvas.scale;
        canvas.draw();
    });
    document.getElementById("resetOffset").addEventListener("click", function() {
        canvas.moveToCenter();
    });
    document.getElementById("scaleCanvas").addEventListener("mousemove", function() {
        canvas.scale = parseFloat(this.value);
        trash.radius = 50 / canvas.scale;
        canvas.draw();
    });
})();