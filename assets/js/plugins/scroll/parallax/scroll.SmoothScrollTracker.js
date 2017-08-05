(function(app, $, $dom, _){

    app.define("plugins.scroll.SmoothScrollTracker");

    var n = app.plugins.scroll.PooledScrollTracker;
    var l = 100;

    function k(a) {
        n.call(this, a);
        this._sampleTime = this._options.sampleTime
    }
    var m = k.prototype = Object.create(n.prototype);
    m.defaults.sampleTime = l;
    m.smoothing = false;
    m._updateScrollData = function(a) {
        a = n.prototype._updateScrollData.call(this, a);
        this.smoothing = (a.position !== a.target.position);
        return this._position
    };
    m._pushPoolData = function(a) {
        var h = this._sampleTime;
        var b = 0;
        var f = 0;
        var g = 0;
        var c;
        var d;
        n.prototype._pushPoolData.call(this, a);
        if (!a.positionDelta) {
            return
        }
        g = a.delta;
        for (d = this._pool.length - 2; d >= 0; d--) {
            c = this._pool[d];
            if (g > h) {
                g = h
            }
            b += c.position * g;
            h -= g;
            g = c.delta;
            if (h === 0) {
                break
            }
        }
        if (h > 0) {
            b += c.position * h;
            h = 0
        }
        b += a.position * (this._sampleTime / 3);
        b /= (this._sampleTime * 4 / 3);
        if (Math.abs(Math.round(b) - Math.round(a.lastPosition)) < 2) {
            if (a.position > a.lastPosition) {
                b = Math.min(a.position, b + 1)
            } else {
                b = Math.max(a.position, b - 1)
            }
        }
        a.position = b;
        a.positionDelta = a.position - a.lastPosition;
        this._position = a.position
    };
    m._onUpdate = function(a) {
        if (this.smoothing) {
            this._scrollChanged = true
        }
        n.prototype._onUpdate.call(this, a)
    };

    app.plugins.scroll.SmoothScrollTracker = k;

})(app, $, app.$dom, app.utils);
