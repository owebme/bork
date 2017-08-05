(function(dom, _){

    app.define("commons.RAF.Emitter");

    var l;
    var m = app.commons.EventEmitterMicro;
    var q = app.commons.RAF.ExecutorShared.getInstance();
    var j = app.commons.RAF.EmitterIDGenerator;

    function k(a) {
        a = a || {};
        m.call(this);
        this.id = j.getNewID();
        this.executor = a.executor || q;
        this._reset();
        this._willRun = false;
        this._didDestroy = false
    }
    l = k.prototype = Object.create(m.prototype);
    l.run = function() {
        if (!this._willRun) {
            this._willRun = true;
            this.executor.subscribe(this);
            return true
        }
        return false
    };
    l.cancel = function() {
        var a = false;
        if (this._willRun) {
            this.executor.unsubscribe(this);
            this._willRun = false;
            a = true
        }
        this._reset();
        return a
    };
    l.destroy = function() {
        var a = this.cancel();
        this.executor.unsubscribe(this);
        this.executor = null;
        m.prototype.destroy.call(this);
        this._didDestroy = true;
        return a
    };
    l.willRun = function() {
        return this._willRun
    };
    l.isRunning = function() {
        return this._isRunning
    };
    l._onAnimationFrameStart = function(a) {
        this._isRunning = true;
        this._willRun = false;
        if (!this._didEmitFrameData) {
            this._didEmitFrameData = true;
            this.trigger("start", a)
        }
    };
    l._onAnimationFrameEnd = function(a) {
        if (!this._willRun) {
            this.trigger("stop", a);
            this._reset()
        }
    };
    l._reset = function() {
        this._didEmitFrameData = false;
        this._isRunning = false
    };

    app.commons.RAF.Emitter = k;

})(app.dom, app.utils);
