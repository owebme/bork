(function(app, $, $dom, _){

    app.define("plugins.scroll.ParallaxElement");

    var q = app.dom.styles;
    var r = app.commons.clip;
    var n = app.plugins.scroll.ElementScrollTracker;
    var s = app.device.isChrome;

    var t = function(h, a, b, g, c) {
        var d;
        var f;
        g = _.extend(this.defaultClipOptions, g);
        c = _.extend(this.defaultScrollOptions, c);
        this.el = h;
        this._translateMultiplier = 1;
        if (c.el) {
            d = c.el;
            c.el = null
        } else {
            d = this.el
        }
        this._scrollTracker = g.scrollTracker || new n(d, c);
        f = _.clone(g.propsFrom);
        g.clock = this._scrollTracker;
        g.onDraw = this._draw.bind(this);
        this._units = g.units;
        this._target = f;
        this._propsTo = a;
        this._propsOff = b;
        this._clipOptions = g;
        this._clip = new r(f, 1, a, g);
        this.start();
    };
    var u = t.prototype;
    u.defaultClipOptions = {
        ease: "linear",
        units: {}
    };
    u.defaultScrollOptions = {
        smooth: true,
        startThreshold: 1
    };
    u.start = function() {
        this._clip = new r(this._target, 1, this._propsTo, this._clipOptions);
        this._scrollTracker.on("update", this._update.bind(this), this);
        this._update()
    };
    u.stop = function() {
        this._scrollTracker.off("update", this._update.bind(this), this)
    };
    u.reset = function() {
        this.stop();
        this._clip = new r(this._target, 1, this._propsOff, this._clipOptions);
        this._clip.setProgress(1)
    };
    u._update = function(a) {
        var b = a ? a.progress : this._scrollTracker.getProgress();
        this._clip.setCurrentTime(b)
    };
    u._draw = function(b) {
        var c = _.clone(b.target);
        var a;
        this._lastDrawData = b;
        if (c.translateY) {
            c.translateY = c.translateY * this._translateMultiplier
        }
        if (c.translateX) {
            c.translateX = c.translateX * this._translateMultiplier
        }
        for (a in this._units) {
            if (a in c) {
                c[a] += this._units[a]
            }
        }
        c.translateZ = c.translateZ || 0;
        if (s && this._clipOptions.hasOwnProperty("z") && this._clipOptions.z === false) {
            c.translateZ = null
        }
        q.setStyle(this.el, c);
    };
    u.setTranslateMultiplier = function(a) {
        this._translateMultiplier = a || 1;
        if (this._lastDrawData) {
            this._draw(this._lastDrawData)
        }
    };

    app.plugins.scroll.ParallaxElement = t;

})(app, $, app.$dom, app.utils);
