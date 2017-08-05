(function(app, $, $dom, _){

    app.define("plugins.scroll.ScrollTracker");

    var l = app.commons.EventEmitter;
    var r = app.commons.clock;

    function u(a) {
        l.call(this);
        this._options = _.extend(this.defaults, a || {});
        this._clock = new this._options.clock();
        this._target = this._options.target;
        this.setRange(this._options.start, this._options.end);
        this.setDirection(this._options.direction);
        this._emitter = this._target;
        this._scrollChanged = true;
        this._position = null;
        this._progress = 0;
        this._emitter.on("scroll update", this._onScroll.bind(this));
        this._clock.on("update", this._onUpdate.bind(this), this);
        this._clock.on("draw", this._onDraw.bind(this), this);
        this._clock.start()
    }
    var o = u.prototype = Object.create(l.prototype);
    o.defaults = {
        start: 0,
        end: 0,
        direction: "Y",
        clock: r,
        target: $dom.window
    };
    o.getRangeStart = function() {
        return this._rangeStart
    };
    o.setRangeStart = function(a) {
        this._rangeStart = a;
        this._updateProgress()
    };
    o.getRangeEnd = function() {
        return this._rangeEnd
    };
    o.setRangeEnd = function(a) {
        this._rangeEnd = a;
        this._updateProgress()
    };
    o.setRange = function(a, b) {
        this._rangeStart = a;
        this._rangeEnd = b;
        this._updateProgress()
    };
    o.getDirection = function() {
        return this._direction
    };
    o.setDirection = function(a) {
        this._direction = a.toUpperCase();
        this._direction = (this._direction === "X" ? "X" : "Y");
        this._scrollChanged = true
    };
    o.getPosition = function() {
        return this._position
    };
    o.getProgress = function() {
        return this._progress
    };
    o._updateProgress = function() {
        if (this._rangeStart === this._rangeEnd) {
            this._progress = 0
        } else {
            this._progress = (this._position - this._rangeStart) / (this._rangeEnd - this._rangeStart)
        }
    };
    o._boundByRange = function(a) {
        if (!this._rangeStart && !this._rangeEnd) {
            return a
        }
        return Math.min(Math.max(a, this._rangeStart), this._rangeEnd)
    };
    o._targetScrollPosition = function() {
        var a;
        if (this._target[0].getPosition) {
            a = this._target[0].getPosition()
        } else {
            if (this._direction === "X") {
                a = this._target[0].scrollX || this._target[0].scrollTop
            } else {
                a = this._target[0].scrollY || this._target[0].scrollTop
            }
            if (typeof a === "function") {
                a = a()
            }
        }
        if (!a) a = 0;
        return a
    };
    o._updateScrollData = function(a) {
        var c = this._lastTime || 0;
        var b;
        a = _.clone(a);
        a.delta = a.time - c;

        a.position = this._boundByRange(this._targetScrollPosition());
        b = (this._position === null ? a.position : this._position);

        a.positionDelta = a.position - b;
        a.lastPosition = b;
        this._position = a.position;
        this._lastTime = a.time;
        return this._eventData = a
    };
    o._onScroll = function(a) {
        this._scrollChanged = true
    };
    o._onUpdate = function(a) {
        var b = (this._position === null);
        if (!this._scrollChanged) {
            return
        }
        this._updateScrollData(a);
        if (!b && !this._eventData.positionDelta) {
            this._scrollChanged = false;
            return
        }
        this._updateProgress();
        this._eventData.progress = this._progress;
        this.trigger("update", this._eventData)
    };
    o._onDraw = function(a) {
        if (!this._scrollChanged) {
            return
        }
        this._scrollChanged = false;
        this.trigger("draw", this._eventData);
        this._eventData = null
    };

    app.plugins.scroll.ScrollTracker = u;

})(app, $, app.$dom, app.utils);
