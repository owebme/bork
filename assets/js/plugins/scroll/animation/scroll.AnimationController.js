(function(app, $, $dom, _){

    app.define("plugins.scroll.AnimationController");

    var sizes = app.sizes;
    var G = app.dom.getPagePosition;
    var H = app.dom.getDimensions;
    var C = document.querySelectorAll;
    var P = document.querySelector;
    var D = app.plugins.scroll.Animation;
    var L = app.plugins.scroll.ScrollMotionEmitter;
    var E = app.plugins.scroll.AnimationStarter;
    var A = app.plugins.scroll.BaseComponent;
    var O = app.commons.clockShared.getInstance();
    var B = A.prototype;

    function I(options) {
        var options = options || {};
        this.element = !options.container ? $dom.body[0] : options.container && _.isElement(options.container) ? options.container : options.container[0];
        this.scroll = options.scroll || $dom.window;
        A.call(this);
        var d = sizes.viewport;
        this.currentBreakpoint = d;
        this.animations = {};
        this.animateEls = $("[data-animate], [data-scrollin], [data-scrollin-icon]", this.element);
        this.windowHeight = sizes.height;
        this.scrollY = this.scroll.scrollTop();
        this.friction = options.friction || 9;
        this.getOptions();
        this.rafWhenVisible = true
    }
    var F = I.prototype = Object.create(A.prototype);
    I.prototype.constructor = I;
    F.getOptions = function() {
        this.options = this.element.getAttribute("data-sa-options");
        if (this.options) {
            this.options = JSON.parse(this.options)
        } else {
            this.options = {}
        }
    };
    F.determineStartandDuration = function() {
        var b = G(this.element).top;
        var a = H(this.element).height;
        this.scrollStart = Math.max(b - this.windowHeight, 0);
        this.duration = (b + a) - this.scrollStart + (this.options.durationOffset || 0)
    };
    F.start = function() {
        var d;
        var b;
        var c;
        var a;
        this.determineStartandDuration();
        for (d = 0, b = this.animateEls.length; d < b; d++) {
            c = this.animateEls[d];
            if (c.style.display == "none") {
                return
            }
            a = c.getAttribute("ID") || d;
            // if (c.hasAttribute("data-keyboardsnap")) {
            //     this.animations[a] = this.createKeyboardSnapAnimation(c)
            // } else {
            //     if (c.hasAttribute("data-flexibleimage")) {
            //         this.animations[a] = this.createFlexibleImageAnimation(c)
            //     } else {
                    if (c.hasAttribute("data-scrollin") || c.hasAttribute("data-scrollin-icon")) {
                        if (!this.isAboveFold(c)) {
                            this.animations[a] = this.createExperienceScrollAnimation(c)
                        } else {
                            c.style.transform = "none";
                            c.style.opacity = 1
                        }
                    } else {
                        this.animations[a] = this.createScrollAnimation(c)
                    }
            //     }
            // }
        }

        var self = this,
            onResize = _.debounce(this.onResize, 300);

        $dom.window.on("orientationchange", function(){
            onResize.call(self);
        });
        this.scroll.on("resize", function(){
            onResize.call(self);
        });
    };
    F.isAboveFold = function(a) {
        if (this.scrollY > G(a).top - this.windowHeight) {
            return true
        }
        return false
    };
    F.grabTranslatesForBreakpoint = function(a) {
        var b = this.currentBreakpoint.replace("x", "").split("")[0];
        return a[b]
    };
    F.grabFadeForBreakpoint = function(a) {
        if (typeof a === "number") {
            return a
        }
        var b = this.currentBreakpoint.replace("x", "").split("")[0];
        if (!a.l) {
            return 1
        }
        if (!a.m) {
            a.m = a.l
        }
        if (!a.s) {
            a.s = a.m
        }
        return a[b]
    };
    F._getEmitterInstance = function(b) {
        var a = this.element.getAttribute("ID");
        if (!this.emitters) {
            this.emitters = {}
        }
        if (this.emitters[a]) {
            return this.emitters[a]
        } else {
            this.emitters[a] = this._createEmitterInstance(b);
            return this.emitters[a]
        }
    };
    F._createEmitterInstance = function(b) {
        var a = new L({
            scroll: this.scroll,
            smooth: true,
            overrideScroll: true,
            min: b.scrollStart,
            max: b.scrollStart + b.duration,
            friction: this.friction,
            clock: O
        });
        a.start();
        return a
    };
    F.createScrollAnimation = function(a) {
        var b = JSON.parse(a.getAttribute("data-animate"));
        b = this.configureOptions(b);
        b.scrollMotionEmitter = this._getEmitterInstance(b);
        return new D(a, b)
    };
    F.createExperienceScrollAnimation = function(i) {
        var c;
        var g;
        var b;
        var d;
        var h;
        var a;
        if (i.hasAttribute("data-scrollin-icon")) {
            var f = $(i).closest(".headline-icons")[0];
            c = G(f).top;
            g = i.getAttribute("data-scrollin-icon");
            b = true
        } else {
            c = G(i).top;
            g = i.getAttribute("data-scrollin");
            b = false
        }
        if (g) {
            g = g.replace(/'/gi, '"');
            d = JSON.parse(g)
        }
        a = {};
        a.fadeFrom = 0.1;
        a.translateFrom = {
            l: [0, 40],
            m: [0, 40],
            s: [0, 30]
        };
        a.duration = 240;
        a.stagger = 0;
        if (this.currentBreakpoint == "small") {
            a.duration = 140
        }
        if (b) {
            a.translateFrom = {
                l: [0, 30],
                m: [0, 25],
                s: [0, 25]
            };
            a.duration = 110
        }
        if (d && d.stagger) {
            a.stagger = d.stagger * 0.4
        }
        a = this.configureOptions(a);
        h = 1;
        a.duration = a.duration * h;
        a.translateFrom[1] = a.translateFrom[1] + a.stagger * h;
        a.scrollStart = c - this.windowHeight + a.translateFrom[1];
        a.scroll = this.scroll;
        return new E(i, a)
    };
    F.createKeyboardSnapAnimation = function(a) {
        var b = JSON.parse(a.getAttribute("data-animate"));
        b = this.configureOptions(b);
        b.duration = H(this.element).height + 100;
        return new J(a, b)
    };
    F.createFlexibleImageAnimation = function(a) {
        var b = JSON.parse(a.getAttribute("data-animate"));
        b = this.configureOptions(b);
        return new N(a, b)
    };
    F.configureOptions = function(a) {
        a.overrideScroll = true;
        if (!a.duration) {
            a.duration = this.duration
        }
        if (!a.scrollStart) {
            a.scrollStart = this.scrollStart
        }
        if (a.translateTo) {
            a.translateTo = this.grabTranslatesForBreakpoint(a.translateTo)
        }
        if (a.translateFrom) {
            a.translateFrom = this.grabTranslatesForBreakpoint(a.translateFrom)
        }
        if (a.fadeTo) {
            a.fadeTo = this.grabFadeForBreakpoint(a.fadeTo)
        }
        if (a.fadeFrom) {
            a.fadeFrom = this.grabFadeForBreakpoint(a.fadeFrom)
        }
        if (!a.friction) {
            a.friction = this.friction
        }
        return a
    };
    F.destroy = function() {
        for (var a in this.animations) {
            this.animations[a].el.setAttribute("style", "");
            this.animations[a].destroy();
        }
        this.scroll.off();
        $dom.window.off("orientationchange");
    };
    F.onSectionWillAppear = function(b, a) {
        B.onSectionWillAppear.call(this, b, a)
    };
    F.onRequestAnimationFrame = function() {
        B.onRequestAnimationFrame.call(this);
        for (var a in this.animations) {
            this.animations[a].handleScroll(this.scrollPosition)
        }
    };
    F.onScroll = function(a, b, c) {
        this.scrollY = b;
        B.onScroll.call(this, a, b, c)
    };
    F.onSectionWillDisappear = function(b, a) {
        B.onSectionWillDisappear.call(this, b, a)
    };
    F.onResize = function() {
        this.windowHeight = sizes.height;
        for (var a in this.animations) {
            this.animations[a]._teardownEvents();
            this.animations[a].el = null;
            this.animations[a].options = null;
            this.animations[a] = null
        }
        this.animations = {};
        this.emitters = null;
        this.start();
        for (var a in this.animations) {
            this.animations[a].handleScroll(this.scrollPosition)
        }
    };
    F.onBreakpoint = function(a, c, b, d) {
        this.currentBreakpoint = a
    };

    app.plugins.scroll.AnimationController = I;

})(app, $, app.$dom, app.utils);
