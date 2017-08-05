(function(dom, _){

    app.define("commons.RAF.Throttled");

    var m;
    var k = app.commons.RAF.Emitter;
    var n = app.commons.EventEmitterMicro;

    function j(a, b) {
        n.call(this);
        b = b || {};
        this._fps = a || 0;
        this._delta = 0;
        this._currentFps = 0;
        this._rafEmitter = b.rafEmitter || new k();
        this._lastThrottledTime = 0;
        this._didEmitFrameData = false;
        this._rafEmitterEvent = null;
        this._shouldDraw = false;
        this._boundOnRAFEmitterUpdate = this._onRAFEmitterUpdate.bind(this);
        this._boundOnRAFEmitterDraw = this._onRAFEmitterDraw.bind(this);
        this._boundOnRAFEmitterStop = this._onRAFEmitterStop.bind(this);
        this._rafEmitter.on("update", this._boundOnRAFEmitterUpdate);
        this._rafEmitter.on("draw", this._boundOnRAFEmitterDraw);
        this._rafEmitter.on("stop", this._boundOnRAFEmitterStop)
    }
    m = j.prototype = Object.create(n.prototype);
    m.setFps = function(a) {
        if (a === this._fps) {
            return false
        }
        this._fps = a;
        return true
    };
    m.getFps = function() {
        return this._fps
    };
    m.run = function() {
        return this._rafEmitter.run()
    };
    m.cancel = function() {
        return this._rafEmitter.cancel()
    };
    m.willRun = function() {
        return this._rafEmitter.willRun()
    };
    m.isRunning = function() {
        return this._rafEmitter.isRunning()
    };
    m.destroy = function() {
        var a = this._rafEmitter.destroy();
        n.prototype.destroy.call(this);
        this._rafEmitter = null;
        this._boundOnRAFEmitterUpdate = null;
        this._boundOnRAFEmitterDraw = null;
        this._boundOnRAFEmitterStop = null;
        this._rafEmitterEvent = null;
        return a
    };
    m._onRAFEmitterUpdate = function(a) {
        if (this._lastThrottledTime === 0) {
            this._lastThrottledTime = this._rafEmitter.executor.lastFrameTime
        }
        this._delta = a.time - this._lastThrottledTime;
        if (!this._fps) {
            throw new TypeError("FPS is not defined.")
        }
        this._currentFps = 1000 / this._delta;
        if (this._currentFps > this._fps) {
            this._rafEmitter.run();
            return
        }
        this._rafEmitterEvent = _.clone(a);
        this._rafEmitterEvent.delta = this._delta;
        this._rafEmitterEvent.fps = this._currentFps;
        this._lastThrottledTime = this._rafEmitterEvent.time;
        this._shouldDraw = true;
        if (!this._didEmitFrameData) {
            this.trigger("start", this._rafEmitterEvent);
            this._didEmitFrameData = true
        }
        this.trigger("update", this._rafEmitterEvent)
    };
    m._onRAFEmitterDraw = function() {
        if (this._shouldDraw) {
            this._shouldDraw = false;
            this.trigger("draw", this._rafEmitterEvent)
        }
    };
    m._onRAFEmitterStop = function() {
        this._lastThrottledTime = 0;
        this._didEmitFrameData = false;
        this.trigger("stop", this._rafEmitterEvent)
    };

    app.commons.RAF.Throttled = j;

})(app.dom, app.utils);
