(function(app, $, $dom, _){

    app.define("plugins.scroll.ScrollMotionEmitter");

    var q = app.plugins.scroll.MotionEmitter;

    function m(a) {
        a = a || {};
        if (typeof a.min !== "number" || typeof a.max !== "number") {
            return null
        }
        q.call(this, a);
        this.scroll = this.options.scroll || $dom.window;
        this.smooth = this.options.smooth || false;
        if (this.options.overrideScroll) {
            this._bindScrollEvents()
        }
    }
    var n = m.prototype = Object.create(q.prototype);
    n.updateValue = function(a) {
        if (this.smooth) {
            return q.prototype.updateValue.call(this, a)
        }
        if (this._currentValue === this._targetValue) {
            this._shouldEmitChange = false;
            return
        }
        this._currentValue = this._targetValue;
        this._shouldEmitChange = true
    };
    n.handleScroll = function(a) {
        if (typeof a !== "number") {
            //var _a = a;
            a = window.pageYOffset || (document.documentElement || document.body).scrollTop;
            //if (!a){
            //     a = _a.target && _a.target.scrollTop;
            //     if (!a) return;
            // }
        }
        var b;
        if (a < this.min) {
            b = this.min
        } else {
            if (a > this.max) {
                b = this.max
            } else {
                b = a
            }
        }
        b = (b - this.min) / (this.max - this.min);
        var self = this;
        this._animationFrame = _.raf(function(){
            self.setProgress(b);
        });
    };
    n.destroy = function() {
        if (this._boundHandleScroll) {
            this.scroll.off("scroll", this._boundHandleScroll);
            _.caf(this._animationFrame);
        }
        return q.prototype.destroy.call(this)
    };
    n._bindScrollEvents = function() {
        this._boundHandleScroll = this.handleScroll.bind(this);
        this.scroll.on("scroll", this._boundHandleScroll)
    };

    app.plugins.scroll.ScrollMotionEmitter = m;

})(app, $, app.$dom, app.utils);
