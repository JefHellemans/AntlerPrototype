var trades = [];
var traders = [];
var logos = ["logo0.svg", "logo1.svg", "logo2.svg", "logo3.svg", "logo4.svg"];
var people = [["Crazy Heffe", "trader0.jpg"], ["Marino Hostino", "trader1.jpg"], ["Nicolsh Lavanda", "trader2.jpg"], ["xXrobke69Xx", "trader3.jpg"]];

(function() {
    for(var j = 0; j < 4; j++) {
        var totalPercentage = (Math.random() * 0.15) + 0.1;
        var d = Math.random() - 0.5;
        var type = Math.floor(Math.random() * (1 + 1));
        traders.push(new Trader(people[j][0], "dist/images/" + people[j][1], totalPercentage, d, "This just looks good!\nI can even put a second line here\n\nMultiline spaces are supported", type));
    }
    for(var i = 0; i < 5; i++) {
        var x = Math.floor(Math.random() * window.innerWidth - (window.innerWidth / 2));
        var y = Math.floor(Math.random() * (window.innerHeight - 50) - ((window.innerHeight - 50) / 2));
        var r = Math.ceil(Math.random() * 4);
        var ppl = [];
        for(var k = 0; k < r; k++) {
            var t = new Trader(traders[k].name, traders[k].imgSrc, traders[k].totalPercentage, traders[k].difference, traders[k].comment, traders[k].type);
            t.percentage = (Math.random() * 0.4) + 0.1;
            ppl.push(t);
        }
        trades.push(new Trade("dist/images/" + logos[i], new Vector2D(x, y), ppl));
    }
    var canvas = new Canvas(window.innerWidth, window.innerHeight - 50, "trades", "#eeeeee", trades);
    for(var l = 0; l < canvas.objs.length; l++) {
        canvas.objs[l].calculate(canvas);
    }
    canvas.drawCanvas();
})();