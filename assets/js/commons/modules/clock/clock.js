(function(app, $, $dom, _){

    app.define("commons.clock");

    var g;
    var f = app.commons.EventEmitterMicro;
    var a = new Date().getTime();

    function h() {
        f.call(this);
        this.lastFrameTime = null;
        this._animationFrame = null;
        this._active = false;
        this._startTime = null;
        this._boundOnAnimationFrame = this._onAnimationFrame.bind(this);
        this._getTime = Date.now || function() {
            return new Date().getTime()
        }
    }
    g = h.prototype = new f(null);
    g.start = function() {
        if (this._active) {
            return
        }
        this._tick()
    };
    g.stop = function() {
        if (this._active) {
            window.cancelAnimationFrame(this._animationFrame)
        }
        this._animationFrame = null;
        this.lastFrameTime = null;
        this._active = false
    };
    g.destroy = function() {
        this.stop();
        this.off();
        var j;
        for (j in this) {
            if (this.hasOwnProperty(j)) {
                this[j] = null
            }
        }
    };
    g.isRunning = function() {
        return this._active
    };
    g._tick = function() {
        if (!this._active) {
            this._active = true
        }
        this._animationFrame = window.requestAnimationFrame(this._boundOnAnimationFrame)
    };
    g._onAnimationFrame = function(k) {
        if (this.lastFrameTime === null) {
            this.lastFrameTime = k
        }
        var l = k - this.lastFrameTime;
        var j = 0;
        if (l >= 1000) {
            l = 0
        }
        if (l !== 0) {
            j = 1000 / l
        }
        if (this._firstFrame === true) {
            l = 0;
            this._firstFrame = false
        }
        if (j === 0) {
            this._firstFrame = true
        } else {
            var i = {
                time: k,
                delta: l,
                fps: j,
                naturalFps: j,
                timeNow: this._getTime()
            };
            this.trigger("update", i);
            this.trigger("draw", i)
        }
        this._animationFrame = null;
        this.lastFrameTime = k;
        if (this._active !== false) {
            this._tick()
        } else {
            this.lastFrameTime = null
        }
    };

    app.commons.clock = h;

})(app, $, app.$dom, app.utils);
