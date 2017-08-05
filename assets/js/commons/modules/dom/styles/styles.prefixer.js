(function(app, $, $dom, _){

    app.define("dom.styles.prefixer");

    var r = {
        transitionend: {
            onwebkittransitionend: "webkitTransitionEnd",
            onmstransitionend: "MSTransitionEnd"
        },
        animationstart: {
            onwebkitanimationstart: "webkitAnimationStart",
            onmsanimationstart: "MSAnimationStart"
        },
        animationend: {
            onwebkitanimationend: "webkitAnimationEnd",
            onmsanimationend: "MSAnimationEnd"
        },
        animationiteration: {
            onwebkitanimationiteration: "webkitAnimationIteration",
            onmsanimationiteration: "MSAnimationIteration"
        },
        fullscreenchange: {
            onmsfullscreenchange: "MSFullscreenChange"
        },
        fullscreenerror: {
            onmsfullscreenerror: "MSFullscreenError"
        }
    };
    var o = /(\([^\)]+\))/gi;
    var u = /([^ ,;\(]+(\([^\)]+\))?)/gi;
    var s = /(-webkit-|-moz-|-ms-)|^(webkit|moz|ms)/gi;
    var A = /^(webkit|moz|ms)/gi;
    var w = ["-webkit-", "-moz-", "-ms-"];
    var q = ["Webkit", "Moz", "ms"];
    var p = ["webkit", "moz", "ms"];

    function y() {
        this._supportsAvailable = ("CSS" in window && "supports" in window.CSS);
        this._cssPrefixes = w;
        this._domPrefixes = q;
        this._evtPrefixes = p;
        this._styleProperties = {};
        this._styleValues = {};
        this._eventTypes = {}
    }
    var t = y.prototype;
    t.getEventType = function(b) {
        var a;
        var c;
        b = b.toLowerCase();
        if (b in this._eventTypes) {
            return this._eventTypes[b]
        }
        if (this._checkEventType("on" + b)) {
            return this._eventTypes[b] = b
        }
        if (r[b]) {
            for (a in r[b]) {
                if (this._checkEventType(a)) {
                    return this._eventTypes[b] = r[b][a]
                }
            }
        }
        for (c = 0; c < this._evtPrefixes.length; c++) {
            if (this._checkEventType("on" + this._evtPrefixes[c] + b)) {
                this._eventTypes[b] = this._evtPrefixes[c] + b;
                this._reduceAvailablePrefixes(c);
                return this._eventTypes[b]
            }
        }
        return this._eventTypes[b] = b
    };
    t._checkEventType = function(a) {
        return (a in window || a in document)
    };
    t.getStyleProperty = function(a) {
        var b;
        var d;
        var c;
        a += "";
        if (a in this._styleProperties) {
            return this._styleProperties[a].dom
        }
        a = this._toDOM(a);
        this._prepareTestElement();
        d = a.charAt(0).toUpperCase() + a.substr(1);
        if (a === "filter") {
            b = ["WebkitFilter", "filter"]
        } else {
            b = (a + " " + this._domPrefixes.join(d + " ") + d).split(" ")
        }
        for (c = 0; c < b.length; c++) {
            if (this._el.style[b[c]] !== undefined) {
                if (c !== 0) {
                    this._reduceAvailablePrefixes(c - 1)
                }
                this._memoizeStyleProperty(a, b[c]);
                return b[c]
            }
        }
        this._memoizeStyleProperty(a, false);
        return false
    };
    t._memoizeStyleProperty = function(a, d) {
        var c = this._toCSS(a);
        var b = (d === false) ? false : this._toCSS(d);
        this._styleProperties[a] = this._styleProperties[d] = this._styleProperties[c] = this._styleProperties[b] = {
            dom: d,
            css: b
        }
    };
    t.getStyleCSS = function(a, b) {
        var c;
        a = this.getStyleProperty(a);
        if (!a) {
            return false
        }
        c = this._styleProperties[a].css;
        if (typeof b !== "undefined") {
            b = this.getStyleValue(a, b);
            if (b === false) {
                return false
            }
            c += ":" + b + ";"
        }
        return c
    };
    t.getStyleValue = function(a, b) {
        var c;
        b += "";
        a = this.getStyleProperty(a);
        if (!a) {
            return false
        }
        if (this._testStyleValue(a, b)) {
            return b
        }
        c = this._styleProperties[a].css;
        b = b.replace(u, function(h) {
            var i;
            var d;
            var f;
            var g;
            if (h[0] === "#" || !isNaN(h[0])) {
                return h
            }
            d = h.replace(o, "");
            f = c + ":" + d;
            if (f in this._styleValues) {
                if (this._styleValues[f] === false) {
                    return ""
                }
                return h.replace(d, this._styleValues[f])
            }
            i = this._cssPrefixes.map(function(j) {
                return j + h
            });
            i = [h].concat(i);
            for (g = 0; g < i.length; g++) {
                if (this._testStyleValue(a, i[g])) {
                    if (g !== 0) {
                        this._reduceAvailablePrefixes(g - 1)
                    }
                    this._styleValues[f] = i[g].replace(o, "");
                    return i[g]
                }
            }
            this._styleValues[f] = false;
            return ""
        }.bind(this));
        b = b.trim();
        return (b === "") ? false : b
    };
    t._testStyleValue = function(b, c) {
        var d;
        if (this._supportsAvailable) {
            b = this._styleProperties[b].css;
            return CSS.supports(b, c)
        }
        this._prepareTestElement();
        d = this._el.style[b];
        try {
            this._el.style[b] = c
        } catch (a) {
            return false
        }
        return (this._el.style[b] && this._el.style[b] !== d)
    };
    t.stripPrefixes = function(a) {
        a = String.prototype.replace.call(a, s, "");
        return a.charAt(0).toLowerCase() + a.slice(1)
    };
    t._reduceAvailablePrefixes = function(a) {
        if (this._cssPrefixes.length !== 1) {
            this._cssPrefixes = [this._cssPrefixes[a]];
            this._domPrefixes = [this._domPrefixes[a]];
            this._evtPrefixes = [this._evtPrefixes[a]]
        }
    };
    t._toDOM = function(a) {
        var b;
        if (a.toLowerCase() === "float") {
            return "cssFloat"
        }
        a = a.replace(/-([a-z])/g, function(c, d) {
            return d.toUpperCase()
        });
        if (a.substr(0, 2) === "Ms") {
            a = "ms" + a.substr(2)
        }
        return a
    };
    t._toCSS = function(a) {
        var b;
        if (a.toLowerCase() === "cssfloat") {
            return "float"
        }
        if (A.test(a)) {
            a = "-" + a
        }
        return a.replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2").replace(/([a-z\d])([A-Z])/g, "$1-$2").toLowerCase()
    };
    t._prepareTestElement = function() {
        if (!this._el) {
            this._el = document.createElement("_")
        } else {
            this._el.style.cssText = "";
            this._el.removeAttribute("style")
        }
    };

    app.dom.styles.prefixer = new y();

})(app, $, app.$dom, app.utils);
