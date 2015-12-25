var Animation = function(element, from, goal, time, easing, cb) {
    this.element = element;
    this.from = from;
    this.difference = goal - from;

    this.easing = easing;
    this.cb = cb;

    this.pos = 0;
    this.end = time / 10;
    this.timer = null;
};

Animation.prototype.start = function(cb) {
    var me = this;
    this.timer = setInterval(function() {
        me.pos++;
        var val = 0;
        switch(me.easing) {
            case "linear":
                val = me.linear(me.difference, me.pos, me.end, me.from);
                break;
            case "easeIn":
                val = me.easeIn(me.difference, me.pos, me.end, me.from);
                break;
            case "easeOut":
                val = me.easeOut(me.difference, me.pos, me.end, me.from);
                break;
            case "easeInOut":
                val = me.easeInOut(me.difference, me.pos, me.end, me.from);
                break;
        }
        cb(val);
        if(me.pos >= me.end) {
            clearInterval(me.timer);
            me.timer = null;
            me.pos = 0;
            if(typeof me.cb === 'function') {
                me.cb(true, me.element);
            }
        }
    }, 10);
};

Animation.prototype.stop = function() {
    clearInterval(this.timer);
    this.timer = null;
    if(typeof this.cb === 'function') {
        this.cb(false, this.element);
    }
};

Animation.prototype.linear = function(c, t, d, b) {
    return (c * t / d + b);
};

Animation.prototype.easeIn = function(c, t, d, b) {
    t /= d;
    return (c * t * t + b);
};

Animation.prototype.easeOut = function(c, t, d, b) {
    t /= d;
    return (-c * t * (t-2) + b);
};

Animation.prototype.easeInOut = function(c, t, d, b) {
    t /= d / 2;
    if (t < 1) {
        return (c/2*t*t + b);
    }
    t--;
    return (-c / 2 * (t * (t - 2) - 1) + b);
};