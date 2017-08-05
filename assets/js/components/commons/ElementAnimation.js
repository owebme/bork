(function(app, $, $dom, _){

    var prefixed = app.prefixed;
    var RAF = app.commons.RAF.Controller("draw");
    var r = 0.0174532925;
    var attributes = {
        ENGAGEMENT: "data-engaged",
        ANIMATION: "data-animation"
    };
    var transition = {
        TRANSFORM: "cubic-bezier(0.165, 0.840, 0.440, 1.000)",
        OPACITY: "cubic-bezier(0.42,0,0.58,1)"
    };

    app.component.register("ElementAnimation", {
        init: function(){
            this.timeToEngage = 100;
            this.inViewThreshold = 0.5;
            var g = Array.prototype.slice.call(this.element.querySelectorAll("[" + attributes.ANIMATION + "]"));
            if (this.element.hasAttribute(attributes.ANIMATION)) {
                g.push(this.element)
            }
            this.elementAnimationItems = [];
            g.forEach(function(k) {
                var l = new ElementAnimationItem(k);
                this.elementAnimationItems.push(l)
            }.bind(this));
            if (this.element.hasAttribute(attributes.ENGAGEMENT)) {
                try {
                    this._overwriteElementEngagementProps()
                } catch (i) {
                    console.error("ScrollElementAnimation::_overwriteElementEngagementProps bad JSON in data-attribute!", i)
                }
            }
            this.trackedElement = this.section.elementEngagement.addElement(this.element, {
                timeToEngage: this.timeToEngage,
                inViewThreshold: this.inViewThreshold
            })
        },
        setupEvents: function() {
            this._onElementEngaged = this._onElementEngaged.bind(this);
            this.trackedElement.once("engaged", this._onElementEngaged)
        },
        _overwriteElementEngagementProps: function() {
            var a = this.element.getAttribute(attributes.ENGAGEMENT);
            var a = a.replace(/'/gi, '"');
            var b = JSON.parse(a);
            this.timeToEngage = b.timeToEngage === undefined ? this.timeToEngage : parseFloat(b.timeToEngage);
            this.inViewThreshold = b.inViewThreshold === undefined ? this.inViewThreshold : parseFloat(b.inViewThreshold)
        },
        _onElementEngaged: function(a) {
            this.elementAnimationItems.forEach(function(b) {
                b._animateIn()
            })
        }
    });

    function ElementAnimationItem(b) {
        this.element = b;
        this.delay = 0;
        this.tDuration = -1;
        this.oDuration = -1;
        this.offsetY = 0;
        this.offsetX = 0;
        this._shouldFadeIn = true;
        this._shouldTranslateIn = false;
        try {
            this._overwriteAnimationProps()
        } catch (a) {
            console.error("ElementAnimationItem::_overwriteAnimationProps bad JSON in data-attribute!", a)
        }
        this._onTransitionComplete = this._onTransitionComplete.bind(this);
        RAF(this._createInitialElementStyles.bind(this))
    }
    ElementAnimationItem.prototype = {
        _overwriteAnimationProps: function() {
            var c = this.element.getAttribute(attributes.ANIMATION);
            var c = c.replace(/'/gi, '"');
            var d = JSON.parse(c);
            this.tDuration = d.tDuration === undefined ? this.tDuration : parseFloat(d.tDuration);
            this.oDuration = d.oDuration === undefined ? this.oDuration : parseFloat(d.oDuration);
            this.delay = d.delay === undefined ? this.delay : parseFloat(d.delay);
            this._shouldFadeIn = this.oDuration !== -1;
            var b = d.angle === undefined ? 0 : parseFloat(d.angle) * r;
            var a = d.distance === undefined ? 0 : parseFloat(d.distance);
            this._shouldTranslateIn = b !== 0 || a !== 0;
            if (a !== 0) {
                this.offsetX = Math.round(Math.cos(b) * a);
                this.offsetY = Math.round(Math.sin(b) * a);
            }
        },
        _createInitialElementStyles: function() {
            if (this._shouldTranslateIn) {
                this.element.style[prefixed.transform] = "translate(" + this.offsetX + "px, " + this.offsetY + "px)"
            }
            if (!this._shouldFadeIn) {
                this.element.style.opacity = 1
            }
            var a = "";
            if (this._shouldTranslateIn) {
                var b = prefixed.transform + " " + this.tDuration + "s " + this.delay + "s " + transition.TRANSFORM;
                a += b
            }
            if (this._shouldFadeIn) {
                a = a === "" ? a : a + ", ";
                a += "opacity " + this.oDuration + "s " + this.delay + "s " + transition.OPACITY
            }
            RAF(function() {
                var c = this.element;
                c.style[prefixed.transition] = a
            }.bind(this))
        },
        _animateIn: function() {
            RAF(function() {
                this.element.addEventListener("transitionend", this._onTransitionComplete);
                this.element.style.willChange = "transform, opacity";
                RAF(function() {
                    this.element.style[prefixed.transform] = "none";
                    this.element.style.opacity = 1
                }.bind(this))
            }.bind(this))
        },
        _onTransitionComplete: function(a) {
            if (a.target !== this.element) {
                return
            }
            if (!app.device.isIE) {
                this.element.removeEventListener("transitionend", this._onTransitionComplete)
            }
            RAF(function() {
                this.element.style.willChange = ""
            }.bind(this))
        }
    };

})(app, $, app.$dom, app.utils);
