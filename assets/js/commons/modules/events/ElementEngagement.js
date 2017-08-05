(function(dom, _){

    app.define("commons.ElementEngagement");

    var g;
    var k = app.commons.EventEmitterMicro;
    var h = app.commons.ElementTracker;
    var j = {
        timeToEngage: 500,
        inViewThreshold: 0.75,
        stopOnEngaged: true
    };
    var i = {
        thresholdEnterTime: 0,
        thresholdExitTime: 0,
        inThreshold: false,
        engaged: false,
        tracking: true
    };
    var a = function(l) {
        h.call(this, null, l);
        k.call(this);
        this._thresholdEnter = this._thresholdEnter.bind(this);
        this._thresholdExit = this._thresholdExit.bind(this);
        this._enterView = this._enterView.bind(this);
        this._exitView = this._exitView.bind(this)
    };
    g = a.prototype = _.create(h.prototype);
    g = _.extend(g, k.prototype);
    g._decorateTrackedElement = function(m, l) {
        var n;
        n = _.defaults(j, l || {});
        _.extend(m, n);
        _.extend(m, i)
    };
    g._attachElementListeners = function(l) {
        l.on("thresholdenter", this._thresholdEnter, this);
        l.on("thresholdexit", this._thresholdExit, this);
        l.on("enterview", this._enterView, this);
        l.on("exitview", this._exitView, this)
    };
    g._removeElementListeners = function(l) {
        l.off("thresholdenter", this._thresholdEnter);
        l.off("thresholdexit", this._thresholdExit);
        l.off("enterview", this._enterView);
        l.off("exitview", this._exitView)
    };
    g._attachAllElementListeners = function() {
        this.elements.forEach(function(l) {
            if (!l.stopOnEngaged) {
                this._attachElementListeners(l)
            } else {
                if (!l.engaged) {
                    this._attachElementListeners(l)
                }
            }
        }, this)
    };
    g._removeAllElementListeners = function() {
        this.elements.forEach(function(l) {
            this._removeElementListeners(l)
        }, this)
    };
    g._elementInViewPastThreshold = function(n) {
        var l = document.documentElement.clientHeight || window.innerHeight;
        var m = false;
        if (n.pixelsInView === l) {
            m = true
        } else {
            m = (n.percentInView > n.inViewThreshold)
        }
        return m
    };
    g._ifInView = function(l, n) {
        var m = l.inThreshold;
        h.prototype._ifInView.apply(this, arguments);
        if (!m && this._elementInViewPastThreshold(l)) {
            l.inThreshold = true;
            l.trigger("thresholdenter", l);
            if (typeof l.timeToEngage === "number" && l.timeToEngage >= 0) {
                l.engagedTimeout = window.setTimeout(this._engaged.bind(this, l), l.timeToEngage)
            }
        }
    };
    g._ifAlreadyInView = function(l) {
        var m = l.inThreshold;
        h.prototype._ifAlreadyInView.apply(this, arguments);
        if (m && !this._elementInViewPastThreshold(l)) {
            l.inThreshold = false;
            l.trigger("thresholdexit", l);
            if (l.engagedTimeout) {
                window.clearTimeout(l.engagedTimeout);
                l.engagedTimeout = null
            }
        }
    };
    g._engaged = function(l) {
        l.engagedTimeout = null;
        this._elementEngaged(l);
        l.trigger("engaged", l);
        this.trigger("engaged", l)
    };
    g._thresholdEnter = function(l) {
        l.thresholdEnterTime = Date.now();
        l.thresholdExitTime = 0;
        this.trigger("thresholdenter", l)
    };
    g._thresholdExit = function(l) {
        l.thresholdExitTime = Date.now();
        this.trigger("thresholdexit", l)
    };
    g._enterView = function(l) {
        this.trigger("enterview", l)
    };
    g._exitView = function(l) {
        this.trigger("exitview", l)
    };
    g._elementEngaged = function(l) {
        l.engaged = true;
        if (l.stopOnEngaged) {
            this.stop(l)
        }
    };
    g.stop = function(l) {
        if (this.tracking && !l) {
            this._removeAllElementListeners();
            h.prototype.stop.call(this)
        }
        if (l && l.tracking) {
            l.tracking = false;
            this._removeElementListeners(l)
        }
    };
    g.start = function(l) {
        if (!l) {
            this._attachAllElementListeners()
        }
        if (l && !l.tracking) {
            if (!l.stopOnEngaged) {
                l.tracking = true;
                this._attachElementListeners(l)
            } else {
                if (!l.engaged) {
                    l.tracking = true;
                    this._attachElementListeners(l)
                }
            }
        }
        if (!this.tracking) {
            h.prototype.start.call(this)
        } else {
            this.refreshAllElementMetrics();
            this.refreshAllElementStates()
        }
    };
    g.addElement = function(n, l) {
        l = l || {};
        var m = h.prototype.addElement.call(this, n, l.useRenderedPosition);
        this._decorateTrackedElement(m, l);
        return m
    };
    g.addElements = function(m, l) {
        [].forEach.call(m, function(n) {
            this.addElement(n, l)
        }, this)
    };

    app.commons.ElementEngagement = a;

})(app.dom, app.utils);
