var trades = [];
var traders = [];
var logos = ["logo0.png", "logo1.jpg", "logo2.jpg", "logo3.png", "logo4.png"];
var people = ["trader0.jpg", "trader1.jpg", "trader2.jpg", "trader3.jpg"];

(function() {
    for(var j = 0; j < 4; j++) {
        var totalPercentage = (Math.random() * 0.15) + 0.10;
        traders.push(new Trader("dist/images/" + people[j], totalPercentage));
    }
    for(var i = 0; i < 5; i++) {
        var x = Math.floor(Math.random() * window.innerWidth - (window.innerWidth / 2));
        var y = Math.floor(Math.random() * (window.innerHeight - 100) - ((window.innerHeight - 100) / 2));
        var r = Math.floor((Math.random() * 4) + 1);
        var ppl = [];
        for(var k = 0; k < r; k++) {
            var t = new Trader(traders[k].imgSrc, traders[k].totalPercentage);
            t.percentage = (Math.random() * 0.4) + 0.1;
            ppl.push(t);
        }
        trades.push(new Trade("dist/images/" + logos[i], new Vector2D(x, y), ppl));
    }
    var canvas = new Canvas(window.innerWidth, window.innerHeight - 100, "trades", "#eeeeee", trades);
    for(var l = 0; l < canvas.objs.length; l++) {
        canvas.objs[l].calculate(canvas);
    }
    canvas.drawCanvas();
})();