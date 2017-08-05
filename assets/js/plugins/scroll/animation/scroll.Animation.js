(function(app, $, $dom, _){

    app.define("plugins.scroll.Animation");

    var G = document.querySelectorAll;
    var B = app.math.lerp;
    var getDimensions = app.dom.getDimensions;
    var getPagePosition = app.dom.getPagePosition;
    var v = app.plugins.scroll.ScrollMotionEmitter;
    var w = {
        pin: false,
        duration: 0,
        delay: 0,
        scrollStart: false,
        friction: 4,
        translateTo: [0, 0],
        translateFrom: [0, 0],
        scaleTo: 1,
        scaleFrom: 1,
        rotateTo: 0,
        rotateFrom: 0,
        fadeTo: 1,
        fadeFrom: 1,
        blurTo: 0,
        blurFrom: 0,
        overrideScroll: false,
        smooth: true,
        scrollMotionEmitter: null
    };
    var A = ["blurTo", "blurFrom"];
    var D = ["translateTo", "translateFrom", "scaleTo", "scaleFrom", "rotateTo", "rotateFrom"];
    var F = ["fadeTo", "fadeFrom"];
    var y = function(a, b) {
        this.el = a;
        this.options = this._overrideDefaultOptions(b);
        this.transforms = {};
        this._update = this._update.bind(this);
        this._memoizeMetrics();
        this._setEmitterBounds();
        this._initScrollMotionEmitter();
        this._setupEvents();
        this._isAnimating = false;
        this.handleScroll(window.pageYOffset || (document.documentElement || document.body).scrollTop)
    };
    var x = y.prototype;
    x.destroy = function() {
        this._teardownEvents();
        this.scrollMotionEmitter.destroy();
        this.scrollMotionEmitter = null;
        this.el = null;
        this.options = null
    };
    x.setOption = function(b, a) {
        this.options[b] = a;
        if (b === "duration" || b === "delay") {
            this._setEmitterBounds()
        }
    };
    x.handleScroll = function(a) {
        this.scrollMotionEmitter.handleScroll(a)
    };
    x.getTransform = function(a) {
        return this.transforms[a]
    };
    x.getOpacity = function(a) {
        return this.opacity
    };
    x._overrideDefaultOptions = function(a) {
        var d = Object.assign(_.clone(w), a);
        var b;
        var c;
        for (c in a) {
            if (D.indexOf(c) > -1) {
                this.hasTransform = true
            } else {
                if (F.indexOf(c) > -1) {
                    this.hasFade = true
                } else {
                    if (A.indexOf(c) > -1) {
                        this.hasBlur = true
                    }
                }
            }
        }
        return d
    };
    x._setEmitterBounds = function() {
        if (this.options.scrollStart || this.options.scrollStart === 0) {
            this._emitterMin = this.options.scrollStart
        } else {
            this._emitterMin = this.elTop - this.windowHeight + this.options.delay + this.options.translateFrom[1]
        }
        this._emitterMax = this._emitterMin + this.options.duration;
        if (this.scrollMotionEmitter) {
            this.scrollMotionEmitter.min = this._emitterMin;
            this.scrollMotionEmitter.max = this._emitterMax
        }
    };
    x._memoizeMetrics = function() {
        this.windowHeight = parseInt(window.innerHeight,10);
        this.elHeight = getDimensions(this.el).height;
        this.elTop = getPagePosition(this.el).top
    };
    x._initScrollMotionEmitter = function() {
        if (this.options.scrollMotionEmitter) {
            this.scrollMotionEmitter = this.options.scrollMotionEmitter
        } else {
            this.scrollMotionEmitter = new v({
                scroll: this.options.scroll,
                smooth: this.options.smooth,
                overrideScroll: this.options.overrideScroll,
                min: this._emitterMin,
                max: this._emitterMax,
                friction: this.options.friction
            })
        }
        if (!this.scrollMotionEmitter.isRunning()) {
            this.scrollMotionEmitter.start()
        }
    };
    x._setupEvents = function() {
        this.scrollMotionEmitter.on("draw", this._update)
    };
    x._teardownEvents = function() {
        this.scrollMotionEmitter.off("draw", this._update)
    };
    x._setElementTransform = function() {
        if (!this.hasTransform) {
            return
        }
        this.transforms.translateY = B(this._progress, this.options.translateFrom[1], this.options.translateTo[1]);
        this.transforms.translateX = B(this._progress, this.options.translateFrom[0], this.options.translateTo[0]);
        this.transforms.rotate = B(this._progress, this.options.rotateFrom, this.options.rotateTo);
        this.transforms.scale = B(this._progress, this.options.scaleFrom, this.options.scaleTo);
        var b = (this.transforms.scale == 1) ? "" : "scale(" + this.transforms.scale + "," + this.transforms.scale + ") ";
        var a = (this.transforms.rotate == 0) ? "" : " rotate(" + this.transforms.rotate + "deg)";
        //if (I) {
            this.el.style[app.prefixed.transform] = b + "translate3d(" + this.transforms.translateX + "px," + this.transforms.translateY + "px,0)" + a
        // } else {
        //     this.el.style[s.transform] = b + "translate(" + this.transforms.translateX + "px," + this.transforms.translateY + "px)" + a
        // }
    };
    x._setElementOpacity = function() {
        if (!this.hasFade) {
            return
        }
        this.opacity = B(this._progress, this.options.fadeFrom, this.options.fadeTo);
        this.el.style.opacity = this.opacity
    };
    x._setStatus = function() {
        if ((this._progress > 0 && this._progress < 1) && !this._isAnimating) {
            this._isAnimating = true;
            this.el.classList.remove("has-animated");
            this.el.classList.remove("has-not-animated");
            this.el.classList.add("is-animating")
        } else {
            if (this._progress >= 1 && this._isAnimating) {
                this._isAnimating = false;
                this.el.classList.remove("is-animating");
                this.el.classList.remove("has-not-animated");
                this.el.classList.add("has-animated")
            } else {
                if (this._progress <= 0 && this._isAnimating) {
                    this._isAnimating = false;
                    this.el.classList.remove("is-animating");
                    this.el.classList.remove("has-animated");
                    this.el.classList.add("has-not-animated")
                }
            }
        }
    };
    x._update = function(a) {
        if (isNaN(a.progress)) {
            return
        }
        this._progress = a.progress;
        this._setElementTransform();
        this._setElementOpacity()
    };

    app.plugins.scroll.Animation = y;

})(app, $, app.$dom, app.utils);
