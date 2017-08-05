(function(app, $, $dom, _){

    app.define("plugins.scroll.AnimationStarter");

    var q = app.plugins.scroll.Animation;
    var s = app.math;
    var w = function(a, b) {
        this.hasAnimated = false;
        if (!b.stagger) {
            b.stagger = 0
        }
        q.apply(this, arguments)
    };
    var p = w.prototype = Object.create(q.prototype);
    p._update = function(a) {
        if (isNaN(a.progress) || this.hasAnimated) {
            return
        }
        if (a.progress > this._progress || !this._progress) {
            this._progress = a.progress
        }
        if (this._progress >= 1) {
            this.hasAnimated = true
        }
        this._setElementTransform();
        this._setElementOpacity()
    };
    p._setElementOpacity = function() {
        if (!this.hasFade) {
            return
        }
        var a = s.map(this._progress, 0, 1, -this.options.stagger, 40);
        a /= 40;
        a = Math.max(0, a);
        this.opacity = s.lerp(a, this.options.fadeFrom, this.options.fadeTo);
        this.el.style.opacity = this.opacity
    };
    p.destroy = function() {
        q.prototype.destroy.call(this)
    }

    app.plugins.scroll.AnimationStarter = w;

})(app, $, app.$dom, app.utils);
