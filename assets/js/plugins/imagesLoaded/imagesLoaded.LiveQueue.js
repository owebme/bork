(function(app, $, $dom, _){

    app.define("plugins.imagesLoaded.LiveQueue");

    var l = app.plugins.imagesLoaded.Queue;
    var k = app.plugins.imagesLoaded.QueueItem;

    function m(a) {
        this._queue = new l();
        this._maxProcesses = a || 1;
        this._availableSlots = this._maxProcesses;
        this._rafId = 0;
        this._isRunning = false;
        this._boundFunctions = {
            _run: this._run.bind(this),
            _releaseSlot: this._releaseSlot.bind(this)
        }
    }
    var n = m.prototype;
    n.start = function() {
        if (this._isRunning) {
            cancelAnimationFrame(this._rafId)
        }
        this._rafId = requestAnimationFrame(this._boundFunctions._run);
        this._isRunning = true
    };
    n.pause = function() {
        if (this._isRunning) {
            cancelAnimationFrame(this._rafId);
            this._rafId = 0
        }
        this._isRunning = false
    };
    n.stop = function() {
        this.pause();
        this.clear()
    };
    n.enqueue = function(c, b) {
        if (typeof c !== "function") {
            throw new Error("LiveQueue can only enqueue functions")
        }
        if (b === undefined) {
            b = l.PRIORITY_DEFAULT
        }
        var a = new k(c, b);
        return this.enqueueQueueItem(a)
    };
    n.enqueueQueueItem = function(a) {
        this._queue.enqueueQueueItem(a);
        if (this._isRunning && this._rafId === 0) {
            this.start()
        }
        return a
    };
    n.dequeueQueueItem = function(a) {
        return this._queue.dequeueQueueItem(a)
    };
    n.clear = function() {
        this._queue = new l()
    };
    n.destroy = function() {
        this.pause();
        this._isRunning = false;
        this._queue = null;
        this._boundFunctions = null
    };
    n.count = function() {
        return this._queue.count() + this.pending()
    };
    n.pending = function() {
        return this._maxProcesses - this._availableSlots
    };
    n.isEmpty = function() {
        return this.count() === 0
    };
    n._run = function() {
        if (!this._isRunning) {
            return
        }
        this._rafId = requestAnimationFrame(this._boundFunctions._run);
        if (this._queue.isEmpty() || this._availableSlots === 0) {
            return
        }
        var a = this._queue.dequeue();
        var b = a.data();
        if (this._isPromise(b)) {
            this._retainSlot();
            b.then(this._boundFunctions._releaseSlot, this._boundFunctions._releaseSlot)
        }
        this._stopRunningIfDone()
    };
    n._retainSlot = function() {
        this._availableSlots--
    };
    n._releaseSlot = function() {
        this._availableSlots++;
        this._stopRunningIfDone()
    };
    n._stopRunningIfDone = function() {
        if (this._rafId != 0 && this._queue.count() === 0 && this._availableSlots == this._maxProcesses) {
            cancelAnimationFrame(this._rafId);
            this._rafId = 0
        }
    };
    n._isPromise = function(a) {
        return !!(a && typeof a.then === "function")
    };

    app.plugins.imagesLoaded.LiveQueue = m;

})(app, $, app.$dom, app.utils);
