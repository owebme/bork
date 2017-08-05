(function(dom, _){

    app.define("commons.RAF.Executor");

    var i;

    function k(a) {
        a = a || {};
        this._reset();
        this._willRun = false;
        this._boundOnAnimationFrame = this._onAnimationFrame.bind(this);
        this._boundOnExternalAnimationFrame = this._onExternalAnimationFrame.bind(this)
    }
    i = k.prototype;
    i.subscribe = function(a) {
        if (this._nextFrameSubscribers[a.id]) {
            return false
        }
        this._nextFrameSubscribers[a.id] = a;
        this._nextFrameSubscriberCount++;
        this._run();
        return true
    };
    i.unsubscribe = function(a) {
        if (!this._nextFrameSubscribers[a.id]) {
            return false
        }
        this._nextFrameSubscribers[a.id] = null;
        this._nextFrameSubscriberCount--;
        if (this._nextFrameSubscriberCount === 0) {
            this._cancel()
        }
        return true
    };
    i.trigger = function(a, b) {
        var c;
        for (c in this._subscribers) {
            if (this._subscribers.hasOwnProperty(c) && this._subscribers[c] !== null && this._subscribers[c]._didDestroy === false) {
                this._subscribers[c].trigger(a, b)
            }
        }
    };
    i.destroy = function() {
        var a = this._cancel();
        this._subscribers = null;
        this._nextFrameSubscribers = null;
        this._rafData = null;
        this._boundOnAnimationFrame = null;
        this._onExternalAnimationFrame = null;
        return a
    };
    i.useExternalAnimationFrame = function(b) {
        if (typeof b !== "boolean") {
            return
        }
        var a = this._isUsingExternalAnimationFrame;
        if (b && this._animationFrame) {
            cancelAnimationFrame(this._animationFrame);
            this._animationFrame = null
        }
        if (this._willRun && !b && !this._animationFrame) {
            this._animationFrame = window.requestAnimationFrame(this._boundOnAnimationFrame)
        }
        this._isUsingExternalAnimationFrame = b;
        if (b) {
            return this._boundOnExternalAnimationFrame
        }
        return a || false
    };
    i._run = function() {
        if (!this._willRun) {
            this._willRun = true;
            if (this.lastFrameTime === 0) {
                this.lastFrameTime = performance.now()
            }
            this._animationFrameActive = true;
            if (!this._isUsingExternalAnimationFrame) {
                this._animationFrame = requestAnimationFrame(this._boundOnAnimationFrame)
            }
            return true
        }
    };
    i._cancel = function() {
        var a = false;
        if (this._animationFrameActive) {
            if (this._animationFrame) {
                cancelAnimationFrame(this._animationFrame);
                this._animationFrame = null
            }
            this._animationFrameActive = false;
            this._willRun = false;
            a = true
        }
        if (!this._isRunning) {
            this._reset()
        }
        return a
    };
    i._onSubscribersAnimationFrameStart = function(a) {
        var b;
        for (b in this._subscribers) {
            if (this._subscribers.hasOwnProperty(b) && this._subscribers[b] !== null && this._subscribers[b]._didDestroy === false) {
                this._subscribers[b]._onAnimationFrameStart(a)
            }
        }
    };
    i._onSubscribersAnimationFrameEnd = function(a) {
        var b;
        for (b in this._subscribers) {
            if (this._subscribers.hasOwnProperty(b) && this._subscribers[b] !== null && this._subscribers[b]._didDestroy === false) {
                this._subscribers[b]._onAnimationFrameEnd(a)
            }
        }
    };
    i._onAnimationFrame = function(a) {
        this._subscribers = this._nextFrameSubscribers;
        this._nextFrameSubscribers = {};
        this._nextFrameSubscriberCount = 0;
        this._isRunning = true;
        this._willRun = false;
        this._didRequestNextRAF = false;
        this._rafData.delta = a - this.lastFrameTime;
        this.lastFrameTime = a;
        this._rafData.fps = 0;
        if (this._rafData.delta >= 1000) {
            this._rafData.delta = 0
        }
        if (this._rafData.delta !== 0) {
            this._rafData.fps = 1000 / this._rafData.delta
        }
        this._rafData.time = a;
        this._rafData.naturalFps = this._rafData.fps;
        this._rafData.timeNow = Date.now();
        this._onSubscribersAnimationFrameStart(this._rafData);
        this.trigger("update", this._rafData);
        this.trigger("draw", this._rafData);
        this._onSubscribersAnimationFrameEnd(this._rafData);
        if (!this._willRun) {
            this._reset()
        }
    };
    i._onExternalAnimationFrame = function(a) {
        if (!this._isUsingExternalAnimationFrame) {
            return
        }
        this._onAnimationFrame(a)
    };
    i._reset = function() {
        this._rafData = {
            time: 0,
            delta: 0,
            fps: 0,
            naturalFps: 0,
            timeNow: 0
        };
        this._subscribers = {};
        this._nextFrameSubscribers = {};
        this._nextFrameSubscriberCount = 0;
        this._didEmitFrameData = false;
        this._animationFrame = null;
        this._animationFrameActive = false;
        this._isRunning = false;
        this._shouldReset = false;
        this.lastFrameTime = 0
    };

    app.commons.RAF.Executor = k;

})(app.dom, app.utils);
