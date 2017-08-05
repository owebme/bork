(function(dom, _){

    app.define("commons.ElementTracker");

    var j = app.commons.TrackedElement;
    var f = {
        autoStart: false,
        useRenderedPosition: false
    };

    app.commons.ElementTracker = function(o, n) {
        this.options = _.clone(f);
        this.options = typeof n === "object" ? _.extend(this.options, n) : this.options;
        this._scrollY = this._getScrollY();
        this._windowHeight = this._getWindowHeight();
        this.tracking = false;
        this.elements = [];
        if (o && (Array.isArray(o) || _.isNodeList(o) || _.isElement(o))) {
            this.addElements(o)
        }
        this.refreshAllElementStates = this.refreshAllElementStates.bind(this);
        this.refreshAllElementMetrics = this.refreshAllElementMetrics.bind(this);
        if (this.options.autoStart) {
            this.start()
        }
    };

    app.commons.ElementTracker.prototype = {
        destroy: function() {
            var o, n;
            this.stop();
            for (o = 0, n = this.elements.length; o < n; o++) {
                this.elements[o].destroy()
            }
            this.elements = null;
            this.options = null
        },
        _registerElements: function(n) {
            n = [].concat(n);
            n.forEach(function(p) {
                if (this._elementInDOM(p)) {
                    var o = new j(p, this.options.useRenderedPosition);
                    o.offsetTop = o.element.offsetTop;
                    this.elements.push(o)
                }
            }, this)
        },
        _registerTrackedElements: function(n) {
            var o = [].concat(n);
            o.forEach(function(p) {
                if (this._elementInDOM(p.element)) {
                    p.offsetTop = p.element.offsetTop;
                    this.elements.push(p)
                }
            }, this)
        },
        _elementInDOM: function(p) {
            var o = false;
            var n = document.getElementsByTagName("body")[0];
            if (_.isElement(p) && n.contains(p)) {
                o = true
            }
            return o
        },
        _elementPercentInView: function(n) {
            return n.pixelsInView / n.height
        },
        _elementPixelsInView: function(o) {
            var n = o.top - this._scrollY;
            var p = o.bottom - this._scrollY;
            if (n > this._windowHeight || p < 0) {
                return 0
            }
            return Math.min(p, this._windowHeight) - Math.max(n, 0)
        },
        _ifInView: function(n, o) {
            if (!o) {
                n.trigger("enterview", n)
            }
        },
        _ifAlreadyInView: function(n) {
            if (!n.inView) {
                n.trigger("exitview", n)
            }
        },
        addElements: function(q, p) {
            if (typeof p === "undefined") {
                p = this.options.useRenderedPosition
            }
            q = _.isNodeList(q) ? _.toArray(q) : [].concat(q);
            for (var o = 0, n = q.length; o < n; o++) {
                this.addElement(q[o], p)
            }
        },
        addElement: function(o, p) {
            var n = null;
            if (typeof p === "undefined") {
                p = this.options.useRenderedPosition
            }
            if (_.isElement(o)) {
                n = new j(o, p);
                this._registerTrackedElements(n);
                this.refreshElementMetrics(n);
                this.refreshElementState(n)
            } else {
                throw new TypeError("ElementTracker: " + o + " is not a valid DOM element")
            }
            return n
        },
        removeElement: function(p) {
            var o = [];
            var n;
            this.elements.forEach(function(r, q) {
                if (r === p || r.element === p) {
                    o.push(q)
                }
            });
            n = this.elements.filter(function(r, q) {
                return o.indexOf(q) < 0
            });
            this.elements = n
        },
        start: function() {
            if (this.tracking === false) {
                this.tracking = true;
                window.addEventListener("resize", this.refreshAllElementMetrics);
                window.addEventListener("orientationchange", this.refreshAllElementMetrics);
                window.addEventListener("scroll", this.refreshAllElementStates);
                this.refreshAllElementMetrics()
            }
        },
        stop: function() {
            if (this.tracking === true) {
                this.tracking = false;
                window.removeEventListener("resize", this.refreshAllElementMetrics);
                window.removeEventListener("orientationchange", this.refreshAllElementMetrics);
                window.removeEventListener("scroll", this.refreshAllElementStates)
            }
        },
        refreshAllElementMetrics: function(n, o) {
            if (typeof n !== "number") {
                n = this._getScrollY()
            }
            if (typeof o !== "number") {
                o = this._getWindowHeight()
            }
            this._scrollY = n;
            this._windowHeight = o;
            this.elements.forEach(this.refreshElementMetrics, this)
        },
        refreshElementMetrics: function(o) {
            var p = dom.getDimensions(o.element, o.useRenderedPosition);
            var n = dom.getPagePosition(o.element, o.useRenderedPosition);
            o = _.extend(o, p, n);
            return this.refreshElementState(o)
        },
        refreshAllElementStates: function(n) {
            if (typeof n !== "number") {
                n = this._getScrollY()
            }
            this._scrollY = n;
            this.elements.forEach(this.refreshElementState, this)
        },
        refreshElementState: function(n) {
            var o = n.inView;
            n.pixelsInView = this._elementPixelsInView(n);
            n.percentInView = this._elementPercentInView(n);
            n.inView = n.pixelsInView > 0;
            if (n.inView) {
                this._ifInView(n, o)
            }
            if (o) {
                this._ifAlreadyInView(n)
            }
            return n
        },
        _getWindowHeight: function() {
            return document.documentElement.clientHeight || window.innerHeight
        },
        _getScrollY: function() {
            return dom.getScrollY()
        }
    };

})(app.dom, app.utils);
