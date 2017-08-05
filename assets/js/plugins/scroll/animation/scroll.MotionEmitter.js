(function(app, $, $dom, _){

    app.define("plugins.scroll.MotionEmitter");

    var m = app.commons.EventEmitterMicro,
        l = app.commons.clock;

    function q(a) {
        m.call(this);
        this.options = a || {};
        this.min = this.options.min || 0;
        this.max = this.options.max || 1;
        this._boundHandleClockUpdate = this._handleClockUpdate.bind(this);
        this._boundHandleClockDraw = this._handleClockDraw.bind(this);
        if (this.options.easingFunction) {
            this.easingFunction = this.options.easingFunction
        }
        this.clock = this.options.clock || new l();
        this.usesSharedClock = (this.clock === l);
        this._isRunning = false;
        this.specificity = this.options.specificity || 4;
        this.friction = this.options.friction || 10;
        this._targetValue = null;
        this._currentValue = null;
        this._shouldUpdate = false;
        this._shouldEmitChange = false
    }
    var n = q.prototype = Object.create(m.prototype);
    n.destroy = function() {
        this.trigger("destroy");
        this.stop();
        this.off();
        if (!this.usesSharedClock) {
            this.clock.destroy()
        }
        var a;
        for (a in this) {
            if (this.hasOwnProperty(a)) {
                this[a] = null
            }
        }
        this._isRunning = false
    };
    n.start = function() {
        if (!this.clock || this._isRunning) {
            return
        }
        this._bindEvents();
        this._isRunning = true;
        this.clock.start()
    };
    n.stop = function() {
        if (!this.clock || !this._isRunning) {
            return
        }
        this._unbindEvents();
        this._isRunning = false;
        if (!this.usesSharedClock) {
            this.clock.stop()
        }
    };
    n.isRunning = function() {
        return this._isRunning
    };
    n.setProgress = function(a) {
        if (this._targetValue === a) {
            return
        }
        this._targetValue = a;
        this._shouldUpdate = true
    };
    n.updateValue = function(d) {
        if (this._currentValue === null) {
            this._currentValue = this._targetValue
        }
        var f = 1;
        if (this.easingFunction) {
            var w = this.max - this.min,
                v = this.max - (this.max - this._targetValue) / w,
                c = this.max - (this.max - this._currentValue) / w,
                u = 1 - Math.abs(v - c),
                b = this.easingFunction(u, 0, 1, 1);
            f = 1 + (b - u)
        }
        var a = 1;
        if (d && d.naturalFps !== d.fps) {
            a = d.naturalFps / d.fps
        }
        var i = this._targetValue - this._currentValue,
            h = i * f * a * (1 / this.friction),
            g = parseFloat((this._currentValue + h).toFixed(this.specificity));
        if (g === this._currentValue) {
            this._currentValue = this._targetValue
        } else {
            this._currentValue = g
        }
        this._shouldEmitChange = true
    };
    n._bindEvents = function() {
        this.clock.on("update", this._boundHandleClockUpdate);
        this.clock.on("draw", this._boundHandleClockDraw)
    };
    n._unbindEvents = function() {
        this.clock.off("update", this._boundHandleClockUpdate);
        this.clock.off("draw", this._boundHandleClockDraw)
    };
    n._handleClockUpdate = function(a) {
        if (this._shouldUpdate) {
            this.updateValue(a)
        }
        if (!this._shouldEmitChange) {
            return
        }
        a.progress = this._currentValue;
        this.trigger("update", a)
    };
    n._handleClockDraw = function(a) {
        if (!this._shouldEmitChange) {
            return
        }
        a.progress = this._currentValue;
        this.trigger("draw", a);
        if (this._targetValue === this._currentValue) {
            this._shouldUpdate = false;
            this._shouldEmitChange = false;
            return
        }
        this._shouldUpdate = true
    };

    app.plugins.scroll.MotionEmitter = q;

})(app, $, app.$dom, app.utils);
