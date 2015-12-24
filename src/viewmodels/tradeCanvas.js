var trades = [];
var traders = [];
var logos = ["logo0.svg", "logo1.svg", "logo2.svg", "logo3.svg", "logo4.svg"];
var people = [["Crazy Heffe", "trader0.jpg"], ["Marino Hostino", "trader1.jpg"], ["Nicolsh Lavanda", "trader2.jpg"], ["xXrobke69Xx", "trader3.jpg"]];

(function() {
    for(var j = 0; j < 4; j++) {
        var totalPercentage = (Math.random() * 0.15) + 0.1;
        var percentage = (Math.random() * 0.4) + 0.1;
        var inAt = Math.random() * 200;
        var type = Math.floor(Math.random() * (1 + 1));
        var trader = [totalPercentage, percentage, inAt, type];
        traders.push(trader);
    }
    for(var i = 0; i < 5; i++) {
        var x = Math.floor(Math.random() * window.innerWidth - (window.innerWidth / 2));
        var y = Math.floor(Math.random() * (window.innerHeight - 50) - ((window.innerHeight - 50) / 2));
        var r = Math.ceil(Math.random() * 4);
        var ppl = [];
        var stockPrice = Math.floor((Math.random() * 200) * 100) / 100;
        for(var k = 0; k < r; k++) {
            var t = new Trader(people[k][0], traders[k][0], traders[k][2], traders[k][1], "This looks good!\nI can even put a second line\n\nAnd even more", traders[k][3]);
            t.drawable.setImage("dist/images/" + people[k][1], function() {
                canvas.draw();
            });
            t.percentage = (Math.random() * 0.4) + 0.1;
            ppl.push(t);
        }
        var trade = new Trade(stockPrice, ppl);
        trade.drawable.pos = new Vector2D(x, y);
        trade.drawable.radius = Math.floor((Math.random() * 50) + 50);
        trade.drawable.color = "#ffffff";
        trade.drawable.borderWidth = 2;
        trade.drawable.borderColor = "#eeeeee";
        trade.drawable.borderScaling = false;
        trade.drawable.setImage("dist/images/" + logos[i], function() {
            canvas.draw();
        });
        trade.drawable.setText(stockPrice + "");
        trade.drawable.textColor = "#ffffff";
        trade.drawable.textFont = "SourceSansPro";
        trade.drawable.textAnchor = new Vector2D(0.5, 0.5);
        trade.drawable.textPos = new Vector2D(0, 0.5);
        trade.drawable.textBackground = "#36B5DB";
        trade.drawable.textPadding = new Vector2D(10, 10);
        trades.push(trade);
    }
    var canvas = new Canvas(0, 50, window.innerWidth, window.innerHeight - 50, "trades", trades);
    canvas.draw();
    document.getElementById("trades").addEventListener("mousedown", function(e) {
        canvas.interactionStart(e, function(object, mousePos) {
            if(object instanceof Trade) {
                var index = canvas.objects.indexOf(object);
                canvas.objects.push(canvas.objects.splice(index, 1)[0]);
            }
            canvas.selected = object;
            canvas.mousePos = mousePos;
        });
    });
    document.getElementById("trades").addEventListener("mousemove", function(e) {
        canvas.interactionMove(e, function(object, mousePos) {
            if(object instanceof Trade) {
                object.drawable.pos = mousePos;
                canvas.draw();
            }
        });
    });
    document.getElementById("trades").addEventListener("mouseup", function() {
        canvas.interactionStop(function(object) {
            if(object !== null) {
                if (object instanceof Trade) {
                    for (var i = 0, l = canvas.objects.length; i < l; i++) {
                        if (canvas.objects[i].open && canvas.objects[i] !== object) {
                            canvas.objects[i].clicked();
                        }
                    }
                }
                if (typeof object.clicked === 'function') {
                    object.clicked();
                }
            }
        });
    });
    document.getElementById("resetOffset").addEventListener("click", function() {
        canvas.moveToCenter();
    });
    document.getElementById("scaleCanvas").addEventListener("mousemove", function() {
        canvas.scale = this.value;
        canvas.draw();
    })
})();