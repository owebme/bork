(function(app, $, $dom, _){

    app.define("plugins.scroll.ParallaxController");

    var o = $dom.window;
    var r = app.plugins.scroll.ParallaxElement;
    var x = 0.65;

    var s = function(options) {
        this.options = options || {};
        if (app.device.isMobile) {
            return
        }
        this.els = [];
        this._multiplierEls = [];
        this.container = !this.options.container ? document : this.options.container && _.isElement(this.options.container) ? this.options.container : this.options.container[0];
        this.options.items.forEach(this._initializeElement.bind(this));
        this._translateMultiplier = 1;
        this._updateTranslateMultiplier();
        this.scroll = this.options.scroll || $dom.window;
        o.on("resize orientationchange", this._updateTranslateMultiplier.bind(this))
    };
    var t = s.prototype;
    t._updateTranslateMultiplier = function() {
        var a = (o.width() <= 1068) ? x : 1;
        var b;
        if (o.width() <= 735) {
            this.reset();
            return
        }
        if (!this._translateMultiplier || this._translateMultiplier !== a) {
            this._translateMultiplier = a;
            for (b = this._multiplierEls.length - 1; b >= 0; b--) {
                this._multiplierEls[b].setTranslateMultiplier(a)
            }
        }
    };
    t._initializeElement = function(f) {
        var d;
        var c;
        var b;
        var a;
        if (!f.selector && !f.elem) {
            return
        }
        if (f.selector){
            d = this.container.querySelector(f.selector);
        }
        else if (f.elem){
            d = _.isElement(f.elem) ? f.elem : f.elem[0];
        }
        if (!d) {
            return
        }
        c = f.clipOptions || {};
        b = f.scrollOptions || f.clockOptions || {};
        if (!c.propsTo && "to" in f) {
            c.propsTo = {
                translateY: f.to
            };
            c.propsFrom = {
                translateY: f.from || 0
            };
            c.propsOff = {
                translateY: f.off || 0
            };
            c.units = {
                translateY: "px"
            };
            if (f.hasOwnProperty("z")) {
                c.z = f.z
            }
        }
        if (f.scrollTracker) {
            c.scrollTracker = f.scrollTracker
        }
        if (this.options.scroll && !b.target) {
            b.target = this.options.scroll
        }
        (function(_this){
            setTimeout(function(){
                a = new r(d, c.propsTo, c.propsOff, c, b);
                _this.els.push(a);
                if (f.useMediumMultiplier !== false) {
                    _this._multiplierEls.push(a)
                }
            }, 0);
        })(this);
    };
    t.start = function() {
        if (app.device.isMobile) {
            return
        }        
        var a;
        for (a = 0; a < this.els.length; a++) {
            this.els[a].start()
        }
    };
    t.stop = function() {
        var a;
        for (a = 0; a < this.els.length; a++) {
            this.els[a].stop()
        }
    };
    t.reset = function() {
        var a;
        for (a = 0; a < this.els.length; a++) {
            this.els[a].reset()
        }
    };
    t.destroy = function() {
        this.stop()
    };

    app.plugins.scroll.ParallaxController = s;

})(app, $, app.$dom, app.utils);
