(function(dom, _){

    app.define("commons.ViewportEmitter");

    var sizes = app.sizes;
    var l = app.commons.EventEmitterMicro;
    var c = "viewport-emitter";
    var j = "::before";
    var d = "only screen and (-webkit-min-device-pixel-ratio: 1.5), screen and (min-resolution: 1.5dppx), screen and (min-resolution: 144dpi)";

    function k(m) {
        l.call(this);
        this._initializeElement(m);
        if (this._isMediaQueriesAvailable()) {
            this._updateViewport = this._updateViewport.bind(this);
            window.addEventListener("resize", this._updateViewport);
            window.addEventListener("orientationchange", this._updateViewport);
            this._retinaQuery = window.matchMedia(d);
            this._updateRetina();
            if (this._retinaQuery.addListener) {
                this._updateRetina = this._updateRetina.bind(this);
                this._retinaQuery.addListener(this._updateRetina)
            }
        }
        this._updateViewport()
    }
    var g = k.prototype = Object.create(l.prototype);
    g.viewport = false;
    g.retina = false;
    g._initializeElement = function(n) {
        var m;
        n = n || c;
        m = document.getElementById(n);
        if (!m) {
            m = document.createElement("div");
            m.id = n;
            m = document.body.appendChild(m)
        }
        this._el = m
    };
    g._getElementContent = function() {
        var m;
        if ("currentStyle" in this._el) {
            m = this._el.currentStyle["x-content"]
        } else {
            this._invalidateStyles();
            m = window.getComputedStyle(this._el, j).content
        }
        if (m) {
            m = m.replace(/["']/g, "")
        }
        if (m) {
            return m
        }
        return false
    };
    g._updateViewport = function() {
        var m = this.viewport;
        var n;
        var o;
        this.viewport = this._getElementContent();
        if (this.viewport) {
            this.viewport = this.viewport.split(":").pop()
        }
        if (m && this.viewport !== m) {
            o = {
                from: m,
                to: this.viewport
            };
            this.trigger("change", o);
            this.trigger("from:" + m, o);
            this.trigger("to:" + this.viewport, o)
        }
        sizes.viewport = this.viewport;
    };
    g._updateRetina = function(m) {
        var n = this.retina;
        this.retina = this._retinaQuery.matches;
        if (n !== this.retina) {
            this.trigger("retinachange", {
                from: n,
                to: this.retina
            })
        }
    };
    g._invalidateStyles = function() {
        document.documentElement.clientWidth;
        this._el.innerHTML = (this._el.innerHTML === " ") ? "Â " : " ";
        document.documentElement.clientWidth
    };
    g._isMediaQueriesAvailable = function() {
        var h = window.matchMedia("only all");
        return !!(h && h.matches)
    };

    app.commons.ViewportEmitter = k;

})(app.dom, app.utils);
