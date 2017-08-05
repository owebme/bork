(function(app, $, $dom, _){

    app.define("plugins.scroll.ElementScrollTracker");

    var w = app.plugins.scroll.ScrollTracker;
    var p = app.plugins.scroll.SmoothScrollTracker;
    var m = app.commons.EventEmitter;
    var o = $dom.window;
    var u = app.dom;

    function n(b, a) {
        m.call(this);
        this.el = _.isElement(b) ? b : b[0];
        this._options = _.extend(this.defaults, a || {});
        if (this._options.tracker) {
            this.tracker = this._options.tracker
        } else {
            if (this._options.smooth) {
                this.tracker = new p(_.pick(a, 'target', 'start', 'end', 'direction'))
            } else {
                this.tracker = new w(_.pick(a, 'target', 'start', 'end', 'direction'))
            }
        }
        this.updateRange();
        this.tracker.on("update", this._onUpdate.bind(this), this);
        this.tracker.on("draw", this._onDraw.bind(this), this);
        o.on("resize orientationchange", this.updateRange.bind(this))
    }
    var q = n.prototype = Object.create(m.prototype);
    q.defaults = {
        startThreshold: 0,
        endThreshold: 0,
        startOffset: 0,
        endOffset: 0,
        smooth: false
    };
    q.updateRange = function(f) {
        var h = u.getPagePosition(this.el);
        var a;
        var c;
        var d;
        var b;
        var g;
        this._options = _.extend(this._options, f || {});
        this._startThreshold = this._options.startThreshold;
        this._endThreshold = this._options.endThreshold;
        this._startOffset = this._options.startOffset;
        this._endOffset = this._options.endOffset;
        if (this.tracker.getDirection() === "X") {
            a = o.width();
            c = h.left;
            d = h.right
        } else {
            a = o.height();
            c = h.top;
            d = h.bottom
        }
        b = c - this._startThreshold * a + this._startOffset;
        g = d - this._endThreshold * a + this._endOffset;
        if (g > b) {
            this.tracker.setRange(b, g)
        } else {
            this.tracker.setRange(g, b)
        }
    };
    q.getRangeStart = function() {
        return this.tracker.getRangeStart()
    };
    q.getRangeEnd = function() {
        return this.tracker.getRangeEnd()
    };
    q.getDirection = function() {
        this.tracker.getDirection()
    };
    q.setDirection = function(a) {
        this.tracker.setDirection(a)
    };
    q.getProgress = function() {
        return this.tracker.getProgress()
    };
    q.getPosition = function() {
        return this.tracker.getPosition()
    };
    q._onUpdate = function(a) {
        this.trigger("update", a)
    };
    q._onDraw = function(a) {
        this.trigger("draw", a)
    };

    app.plugins.scroll.ElementScrollTracker = n;

})(app, $, app.$dom, app.utils);
