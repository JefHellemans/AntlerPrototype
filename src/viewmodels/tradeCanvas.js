var trades = [];
var traders = [];
var profile = new Drawable();
var logos = ["logo0.svg", "logo1.svg", "logo2.svg", "logo3.svg", "logo4.svg"];
var people = [["Crazy Heffe", "trader0.jpg"], ["Marino Hostino", "trader1.jpg"], ["Nicolsh Lavanda", "trader2.jpg"], ["xXrobke69Xx", "trader3.jpg"]];

(function() {
    profile.setImage("dist/images/profile.jpg");
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
            t.drawable.setImage("dist/images/" + people[k][1], function() {
                canvas.draw();
            });
            t.percentage = (Math.random() * 0.4) + 0.1;
            ppl.push(t);
        }
        var trade = new Trade(stockPrice, ppl);
        diff += trade.difference;
        trade.drawable.setImage("dist/images/" + logos[i], function() {
            canvas.draw();
        });
        trades.push(trade);
    }
    if(diff >= 0) {
        profile.textBackground = "#36B5DB";
        profile.textReplaceColor = "#36B5DB";
    } else {
        profile.textBackground = "#E74C3C";
        profile.textReplaceColor = "#E74C3C";
    }
    profile.setText((Math.floor(diff * 100) / 100).toLocaleString('be-NL', {style: 'currency', currency: 'EUR'}));
    var canvas = new Canvas(0, 50, window.innerWidth, window.innerHeight - 50, "trades", trades);
    canvas.partialCallback = function() {
        var diff = 0;
        for(var i = 1, l = canvas.objects.length; i < l; i++) {
            diff += canvas.objects[i].difference;
        }
        if(diff >= 0) {
            canvas.objects[0].textBackground = "#36B5DB";
            canvas.objects[0].textReplaceColor = "#36B5DB";
        } else {
            canvas.objects[0].textBackground = "#E74C3C";
            canvas.objects[0].textReplaceColor = "#E74C3C";
        }
        canvas.objects[0].setText((Math.floor(diff * 100) / 100).toLocaleString('be-NL', {style: 'currency', currency: 'EUR'}));
        canvas.objects[0].drawText(canvas.ctx, canvas.scale);
    };
    profile.draw = function(ctx, scale) {
        this.drawCircle(ctx);
        this.drawImageInCircle(ctx);
        this.drawBorderForCircle(ctx, scale);
        this.drawText(ctx, scale);
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
            if(object instanceof Trade) {
                var index = canvas.objects.indexOf(object);
                canvas.objects.push(canvas.objects.splice(index, 1)[0]);
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
        canvas.interactionMove(e, function(object, mousePos) {
            if(object instanceof Trade) {
                object.drawable.pos = mousePos;
                canvas.draw();
            }
        });
    };
    document.getElementById("trades").addEventListener("mouseup", function() {
        interactionStop();
    });
    document.getElementById("trades").addEventListener("touchend", function() {
        interactionStop();
    });
    document.body.addEventListener('touchstart', function(e) {
        e.preventDefault();
    });
    var interactionStop = function() {
        canvas.interactionStop(function(object) {
            if(object !== null) {
                var i, l;
                if(object instanceof Trade) {
                    for (i = 0, l = canvas.objects.length; i < l; i++) {
                        if (canvas.objects[i].open && canvas.objects[i] !== object) {
                            canvas.objects[i].clicked();
                        }
                    }
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
            }
        });
    };
    document.getElementById("resetOffset").addEventListener("click", function() {
        canvas.moveToCenter();
    });
    document.getElementById("scaleCanvas").addEventListener("mousemove", function() {
        canvas.scale = this.value;
        canvas.draw();
    })
})();