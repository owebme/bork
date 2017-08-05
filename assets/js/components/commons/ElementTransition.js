(function(app, $, $dom, _){

    var w = app.components.ElementEngaged;

    var selectors = {
        WILL_ENGAGE: "will-engage",
        DID_ENGAGE: "did-engage",
        TRANSITION_COMPLETE: "transition-complete"
    };

    var s = function() {
        function a(b, d) {
            for (var f = 0; f < d.length; f++) {
                var c = d[f];
                c.enumerable = c.enumerable || false;
                c.configurable = true;
                if ("value" in c) {
                    c.writable = true
                }
                Object.defineProperty(b, c.key, c)
            }
        }
        return function(b, d, c) {
            if (d) {
                a(b.prototype, d)
            }
            if (c) {
                a(b, c)
            }
            return b
        }
    }();
    var p = function u(g, c, d) {
        if (g === null) {
            g = Function.prototype
        }
        var b = Object.getOwnPropertyDescriptor(g, c);
        if (b === undefined) {
            var f = Object.getPrototypeOf(g);
            if (f === null) {
                return undefined
            } else {
                return u(f, c, d)
            }
        } else {
            if ("value" in b) {
                return b.value
            } else {
                var a = b.get;
                if (a === undefined) {
                    return undefined
                }
                return a.call(d)
            }
        }
    };

    function q(a, b) {
        if (!(a instanceof b)) {
            throw new TypeError("Cannot call a class as a function")
        }
    }

    function n(a, b) {
        if (!a) {
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
        }
        return b && (typeof b === "object" || typeof b === "function") ? b : a
    }

    function m(b, a) {
        if (typeof a !== "function" && a !== null) {
            throw new TypeError("Super expression must either be null or a function, not " + typeof a)
        }
        b.prototype = Object.create(a && a.prototype, {
            constructor: {
                value: b,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
        if (a) {
            Object.setPrototypeOf ? Object.setPrototypeOf(b, a) : b.__proto__ = a
        }
    }

    app.define("components.ElementTransition");

    app.components.ElementTransition = function(f){
        m(b, f);

        function b() {
            q(this, b);
            var j = n(this, (b.__proto__ || Object.getPrototypeOf(b)).apply(this, arguments));
            j.willEngageClass = selectors.WILL_ENGAGE;
            j.didEngageClass = selectors.DID_ENGAGE;
            j.transitionCompleteClass = selectors.TRANSITION_COMPLETE;
            j.transitionEndTimeout = null;
            j.didTrigger = false;
            j.willEngage = false;
            j.didEngage = false;
            j.transitionComplete = false;
            j.timeoutDuration = 1000;
            j.onTransitionEnd = j.onTransitionEnd.bind(j);
            j.onTransitionEndTimeout = j.onTransitionEndTimeout.bind(j);
            j.trackedElement.element.addEventListener("transitionend", j.onTransitionEnd);
            return j
        }
        s(b, [{
            key: "onTransitionEnd",
            value: function h() {
                if (this.transitionEndTimeout) {
                    clearTimeout(this.transitionEndTimeout)
                }
                this.transitionEndTimeout = setTimeout(this.onTransitionEndTimeout, this.timeoutDuration)
            }
        }, {
            key: "onTransitionEndTimeout",
            value: function d() {
                this.transitionComplete = true;
                this.requestDOMChange()
            }
        }, {
            key: "onScroll",
            value: function i() {
                if (this.trackedElement.pixelsInView > 10) {
                    this.triggerAnimation()
                }
            }
        }, {
            key: "triggerAnimation",
            value: function c() {
                if (!this.didTrigger) {
                    this.didTrigger = true;
                    p(b.prototype.__proto__ || Object.getPrototypeOf(b.prototype), "_onElementEngaged", this).apply(this, arguments);
                    this.willEngage = true;
                    this.requestDOMChange()
                }
            }
        }, {
            key: "onDOMWrite",
            value: function g() {
                p(b.prototype.__proto__ || Object.getPrototypeOf(b.prototype), "onDOMWrite", this).apply(this, arguments);
                if (this.willEngage) {
                    if (this.willEngageClass){
                        this.trackedElement.element.classList.add(this.willEngageClass);
                    }
                    this.willEngage = false;
                    this.didEngage = true;
                    this.requestDOMChange()
                }
                if (this.didEngage && this.didEngageClass) {
                    this.trackedElement.element.classList.add(this.didEngageClass)
                }
                if (this.transitionComplete && this.transitionCompleteClass) {
                    this.trackedElement.element.classList.add(this.transitionCompleteClass)
                }
            }
        }, {
            key: "_onElementEngaged",
            value: function a() {
                this.triggerAnimation()
            }
        }]);
        return b
    }(w);

})(app, $, app.$dom, app.utils);
