(function(app, $, $dom, _){

    app.define("commons.clip");

    var q = app.easing.createPredefined;
    var E = app.commons.clock;
    var s = app.easing.Ease;
    var r = app.commons.EventEmitter;
    var u = "ease";
    var w = "complete";
    var y = "pause";
    var D = "play";

    function v(c, d, a, f) {
        f = f || {};
        this._options = f;
        this._target = c;
        this._duration = d * 1000;
        this._delay = (f.delay || 0) * 1000;
        this._remainingDelay = this._delay;
        this._progress = 0;
        this._clock = f.clock || new E();
        this._playing = false;
        this._getTime = Date.now || function() {
            return new Date().getTime()
        };
        this._isYoyo = f.yoyo;
        this._direction = 1;
        this._loop = f.loop || 0;
        this._loopCount = 0;
        this._propsTo = a;
        this._propsFrom = f.propsFrom || {};
        this._storeTarget = _.clone(this._target);
        this._storePropsTo = this._propsTo;
        this._storePropsFrom = this._propsFrom;
        this._onStart = f.onStart || null;
        this._onUpdate = f.onUpdate || null;
        this._onDraw = f.onDraw || null;
        this._onComplete = f.onComplete || null;
        var b = f.ease || u;
        this._ease = (typeof b === "function") ? new s(b) : q(b);
        this._start = this._start.bind(this);
        this._update = this._update.bind(this);
        this._draw = this._draw.bind(this)
    }
    var z = v.prototype = Object.create(r.prototype);
    z.play = function() {
        if (!this._playing) {
            this._playing = true;
            if (this._delay === 0 || this._remainingDelay === 0) {
                this._start()
            } else {
                this._startTimeout = setTimeout(this._start, this._remainingDelay);
                this._delayStart = this._getTime()
            }
        }
        return this
    };
    z.pause = function() {
        if (this._playing) {
            if (this._startTimeout) {
                this._remainingDelay = this._getTime() - this._delayStart;
                clearTimeout(this._startTimeout)
            }
            this._stop();
            this.trigger(y, this._getDetails())
        }
        return this
    };
    z.reset = function() {
        this._stop();
        var a;
        for (a in this._storeTarget) {
            this._target[a] = this._storeTarget[a]
        }
        this._direction = 1;
        this._loop = this._options.loop || 0;
        this._loopCount = 0;
        this.setProgress(0);
        return this
    };
    z.isPlaying = function() {
        return this._playing
    };
    z.getTarget = function() {
        return this._target
    };
    z.setCurrentTime = function(a) {
        this.setProgress(a * 1000 / this._duration);
        return this.getCurrentTime()
    };
    z.getCurrentTime = function() {
        return (this.getProgress() * this._duration) / 1000
    };
    z.setProgress = function(a) {
        this._progress = Math.min(1, Math.max(0, a));
        this._setStartTime();
        if (!this._playing) {
            this._setDiff()
        }
        if (this._playing && a === 1) {
            this._completeProps();
            if (this._onUpdate) {
                this._onUpdate.call(this, this._getDetails())
            }
            if (this._onDraw) {
                this._onDraw.call(this, this._getDetails())
            }
            this._complete()
        } else {
            this._updateProps();
            if (this._onUpdate) {
                this._onUpdate.call(this, this._getDetails())
            }
            if (this._onDraw) {
                this._onDraw.call(this, this._getDetails())
            }
        }
        return this.getProgress()
    };
    z.getProgress = function() {
        return this._progress
    };
    z._setStartTime = function() {
        this._startTime = this._getTime() - (this.getProgress() * this._duration)
    };
    z._setDiff = function() {
        this._propsDiff = {};
        var a = function(b, c, f, g) {
            var d;
            for (d in b) {
                if (typeof b[d] === "object") {
                    c[d] = c[d] || {};
                    g[d] = g[d] || {};
                    a(b[d], c[d], f[d], g[d])
                } else {
                    if (typeof f[d] === "number") {
                        if (c[d] !== undefined) {
                            f[d] = c[d]
                        } else {
                            c[d] = f[d]
                        }
                        g[d] = b[d] - f[d]
                    } else {
                        delete b[d]
                    }
                }
            }
        };
        a(this._propsTo, this._propsFrom, this._target, this._propsDiff)
    };
    z._getDetails = function() {
        return {
            target: this._target,
            progress: this.getProgress(),
            clip: this
        }
    };
    z._start = function() {
        this._startTimeout = null;
        this._remainingDelay = 0;
        this._setStartTime();
        this._clock.on("update", this._update);
        this._clock.on("draw", this._draw);
        if (!this._clock.isRunning()) {
            this._clock.start()
        }
        this._setDiff();
        this._playing = true;
        this._running = true;
        if (this._onStart) {
            this._onStart.call(this, this._getDetails())
        }
        this.trigger(D, this._getDetails())
    };
    z._stop = function() {
        this._playing = false;
        this._running = false;
        this._clock.off("update", this._update);
        this._clock.off("draw", this._draw)
    };
    z._updateProps = function() {
        var b = this._ease.getValue(this._progress);
        var a = function(c, d, g, h) {
            var f;
            for (f in c) {
                if (typeof c[f] !== "number") {
                    a(c[f], d[f], g[f], h[f])
                } else {
                    g[f] = d[f] + (h[f] * b)
                }
            }
        };
        a(this._propsTo, this._propsFrom, this._target, this._propsDiff)
    };
    z._completeProps = function() {
        var a = function(b, d) {
            var c;
            for (c in b) {
                if (typeof b[c] !== "number") {
                    a(b[c], d[c])
                } else {
                    d[c] = b[c]
                }
            }
        };
        a(this._propsTo, this._target)
    };
    z._complete = function() {
        if (this._isYoyo && ((this._loop > 0 && this._loopCount <= this._loop) || (this._loop === 0 && this._loopCount === 0))) {
            this._propsFrom = (this._direction === 1) ? this._storePropsTo : this._storePropsFrom;
            this._propsTo = (this._direction === 1) ? this._storePropsFrom : this._storePropsTo;
            this.setProgress(0);
            this._direction *= -1;
            if (this._direction === -1) {
                ++this._loopCount
            }
            this._start()
        } else {
            if (this._loopCount < this._loop) {
                ++this._loopCount;
                this.target = this._storeTarget;
                this.setProgress(0);
                this._start()
            } else {
                if (this._onComplete) {
                    this._onComplete.call(this, this._getDetails())
                }
                this.trigger(w, this._getDetails())
            }
        }
    };
    z._update = function(a) {
        if (this._running) {
            this._progress = (a.timeNow - this._startTime) / this._duration;
            if (this._progress >= 1) {
                this._progress = 1;
                this._running = false;
                this._completeProps()
            } else {
                this._updateProps()
            }
            if (this._onUpdate) {
                this._onUpdate.call(this, this._getDetails())
            }
        }
    };
    z._draw = function(a) {
        if (this._onDraw) {
            this._onDraw.call(this, this._getDetails())
        }
        if (!this._running) {
            this._stop();
            if (this._progress === 1) {
                this._complete()
            }
        }
    };

    app.commons.clip = v;

})(app, $, app.$dom, app.utils);
