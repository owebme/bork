(function(app, $, $dom, _){

    app.define("plugins.imagesLoaded");

    var u = app.plugins.imagesLoaded.LiveQueue;
    var o = app.commons.EventEmitterMicro;
    var t = app.commons.RAF.Controller("update");
    var q = app.commons.RAF.Controller("draw");
    var w = {
        container: document.body,
        includeContainer: false
    };
    var p = {
        loadingPoolSize: 8,
        timeout: null,
        imageDataAttribute: "data-progressive-image",
        imageAnimate: false,
        imageAnimateClass: "progressive-image-animated"
    };
    n.Events = {
        ImageLoad: "image-load",
        Complete: "complete"
    };

    function n(a) {
        o.call(this);
        this.options = _.extend(w, a);
        this.loadingOptions = null;
        this.els = [];
        this.loadingQueue = null;
        this._queueItems = [];
        this._queueItemsObj = {};
        this._loadOrder = [];
        this._timeout = null;
        this._didCallLoad = false
    }
    var r = n.prototype = Object.create(o.prototype);
    r.load = function(a) {
        if (this._didCallLoad) {
            return
        }
        this._didCallLoad = true;
        this.loadingOptions = _.extend(p, a);
        this.loadingQueue = new u(this.loadingOptions.loadingPoolSize);
        this.els = this._getProgressiveImageElements();
        if (this.options.includeContainer && this.options.container.hasAttribute(this._getProgressiveImageDataAttribute())) {
            this.els.unshift(this.options.container)
        }
        q(function() {
            var c, d = this.els.length,
                b;
            for (c = 0; c < d; c++) {
                b = {
                    queueItem: this.loadingQueue.enqueue(this._loadNextItem.bind(this, c), c),
                    el: this.els[c],
                    id: c
                };
                this._queueItems.push(b);
                this._queueItemsObj[c] = b;
                if (this.loadingOptions.imageAnimate) {
                    this.els[c].classList.add(this.loadingOptions.imageAnimateClass)
                }
            }
            t(function() {
                this.loadingQueue.start();
                if (typeof this.loadingOptions.timeout === "number") {
                    this._timeout = setTimeout(this.cancel.bind(this), this.loadingOptions.timeout)
                }
            }.bind(this))
        }.bind(this))
    };
    r.setVisible = function(a) {
        return new Promise(function(b, c) {
            q(function() {
                a.removeAttribute(this._getProgressiveImageDataAttribute());
                b();
                a = null
            }.bind(this))
        }.bind(this))
    };
    r.cancel = function() {
        if (this.els) {
            var a, b = this.els.length;
            for (a = 0; a < b; a++) {
                this.setVisible(this.els[a]);
                if (this.loadingOptions.imageAnimate) {
                    q(function() {
                        this.els[a].setAttribute("data-progressive-image-loaded", "")
                    }.bind(this, a))
                }
            }
        }
        this._handleLoadingComplete()
    };
    r.destroy = function() {
        this.cancel();
        this.off();
        o.prototype.destroy.call(this)
    };
    r._loadNextItem = function(a) {
        return new Promise(function(f, c, d) {
            var b = this._queueItemsObj[f];
            this._loadAndSetVisible(b.el).then(function() {
                var g = this._queueItems.indexOf(b);
                this._queueItems.splice(g, 1);
                this._queueItemsObj[b.id] = null;
                c();
                this._handleImageLoad(b.el);
                b = c = null;
                if (this.loadingQueue.count() === 1) {
                    this._handleLoadingComplete()
                }
            }.bind(this))
        }.bind(this, a))
    };
    r._loadAndSetVisible = function(a) {
        return new Promise(function(b, c) {
            this.setVisible(a).then(function() {
                this._getBackgroundImageSrc(a).then(function(d) {
                    this._loadImage(d).then(b);
                    a = null
                }.bind(this))
            }.bind(this))
        }.bind(this))
    };
    r._getBackgroundImageSrc = function(a) {
        return new Promise(function(b, c) {
            t(function() {
                var d = a.currentStyle;
                if (!d) {
                    d = window.getComputedStyle(a, false)
                }
                a = null;
                if (d.backgroundImage.indexOf("url(") === 0) {
                    b(d.backgroundImage.slice(4, -1).replace(/"/g, ""));
                    return
                }
                b(null)
            }.bind(this))
        }.bind(this))
    };
    r._getProgressiveImageDataAttribute = function() {
        return this.loadingOptions.imageDataAttribute
    };
    r._getProgressiveImageCSSQuery = function() {
        return "[" + this._getProgressiveImageDataAttribute() + "]"
    };
    r._getProgressiveImageElements = function() {
        return this.options.container.querySelectorAll(this._getProgressiveImageCSSQuery())
    };
    r._loadImage = function(a) {
        return new Promise(this._loadImagePromiseFunc.bind(this, a))
    };
    r._loadImagePromiseFunc = function(a, b, c) {
        function d() {
            this.removeEventListener("load", d);
            b(this);
            b = null
        }
        if (!a) {
            b(null);
            return
        }
        var f = new Image();
        f.addEventListener("load", d);
        f.src = a
    };
    r._clearTimeout = function() {
        if (this._timeout) {
            window.clearTimeout(this._timeout);
            this._timeout = null
        }
    };
    r._handleImageLoad = function(a) {
        q(function() {
            this.trigger(n.Events.ImageLoad, a);
            if (this.loadingOptions.imageAnimate) {
                a.setAttribute("data-progressive-image-loaded", "")
            }
            a = null
        }.bind(this))
    };
    r._handleLoadingComplete = function() {
        this.loadingQueue.stop();
        this._clearTimeout();
        this.trigger(n.Events.Complete)
    };

    app.plugins.imagesLoaded = n;

})(app, $, app.$dom, app.utils);
