(function(dom, _){

    app.define("page.BasePage");

    var querySelector = dom.querySelector,
        querySelectorAll = dom.querySelectorAll,
        elementTracker = app.commons.ElementTracker,
        viewportEmitter = new app.commons.ViewportEmitter,
        sectionMap = app.section,
        domAttributes = dom.attributes,
        emitterMicro = app.commons.EventEmitterMicro;

    app.page.BasePage = function(options) {
        this.enabledFeatures();
        this.name = this.name || "[NOT SET]";
        this._mainEl = querySelector(app.dom.selectors.ROOT);
        if (!this._mainEl) return;
        emitterMicro.call(this);
        this.options = options || {};
        this._sections = [];
        this._visibleSections = [];
        this._visibleSectionsWithPadding = [];
        this._elementTracker = new elementTracker(null, {
            autoStart: true
        });
        this._currentSection = null;
        this._currentBreakpoint = viewportEmitter.viewport;
        this.isRetina = viewportEmitter.retina;
        this._cachedScrollY = this._getScrollY(true);
        this._cachedWindowHeight = this._getWindowHeight(true);
        this._viewportPaddingRatio = 1.5;
        this._rafId = -1;
        this._resizeTimeout = -1;
        this._resizeTimeoutDelay = this._resizeTimeoutDelay || 250;
        if (this.options.lazyReady && this.options.render){
            var self = this;
            this.once("lazyReady", function(){
                var Q = document.documentElement.scrollHeight,
                    T = 0;

                function K() {
                    var a = document.documentElement.scrollHeight;
                    if (Q !== a) {
                        T = 0
                    } else {
                        T++;
                        if (T >= 30) {
                            self.trigger("ready");
                            return
                        }
                    }
                    Q = a;
                    window.requestAnimationFrame(K)
                }
                window.requestAnimationFrame(K);
            });
        }
        this.setupSections();
        this.setupEvents();
        this._updateSectionVisibility();
        this._onRequestAnimationFrame();
    };

    app.page.BasePage.prototype = {
        enabledFeatures: function() {
            d = document.getElementsByTagName("html")[0];
            this.TOUCH = d.classList.contains("m-touch");
            this.JS = d.classList.contains("m-js");
            this.PARALLAX = d.classList.contains("m-parallax");
            this.INLINE_VIDEO = d.classList.contains("m-inline-video");
            this.SVG_CLIP_PATH = d.classList.contains("m-svg-clip-path");
            this.REDUCED_MOTION = d.classList.contains("m-prefers-reduced-motion")
        },
        destroy: function() {
            for (var s = 0, r = this._sections.length; s < r; s++) {
                this._sections[s].destroy()
            }
            this.teardownEvents();
            this._elementTracker.destroy();
            this._elementTracker = null;
            this._sections = null;
            this._currentSection = null;
            this._visibleSections = null;
            this._mainEl = null
        },
        setupEvents: function() {
            this._onScroll = this._onScroll.bind(this);
            this._onBreakpoint = this._onBreakpoint.bind(this);
            this._onRetinaChange = this._onRetinaChange.bind(this);
            this._onPageDidAppear = this._onPageDidAppear.bind(this);
            this._onResizeImmediate = this._onResizeImmediate.bind(this);
            this._onOrientationChange = this._onOrientationChange.bind(this);
            this._onPageWillDisappear = this._onPageWillDisappear.bind(this);
            this._onRequestAnimationFrame = this._onRequestAnimationFrame.bind(this);
            this.performDeepMetricsRefresh = this.performDeepMetricsRefresh.bind(this);
            window.addEventListener("scroll", this._onScroll);
            window.addEventListener("resize", this._onResizeImmediate);
            window.addEventListener("orientationchange", this._onOrientationChange);
            viewportEmitter.on("change", this._onBreakpoint);
            viewportEmitter.on("retinachange", this._onRetinaChange);
        },
        teardownEvents: function() {
            window.removeEventListener("scroll", this._onScroll);
            window.removeEventListener("resize", this._onResizeImmediate);
            window.removeEventListener("orientationchange", this._onOrientationChange);
            viewportEmitter.off("change", this._onBreakpoint);
            viewportEmitter.off("retinachange", this._onRetinaChange);
            this._elementTracker.stop();
            clearTimeout(this._resizeTimeout);
            cancelAnimationFrame(this._rafId)
        },
        setupSections: function() {
            var s = querySelectorAll(app.dom.selectors.SECTION, this._mainEl);
            for (var u = 0, r = s.length; u < r; u++) {
                if (s[u].parentElement !== this._mainEl) {
                    console.warn("BasePage::addSection - Jetpack does not support nested BaseSections, consider using a component instead.", s[u]);
                    continue
                }
                var t = s[u];
                this._addSectionImp(t);
            }
            if (this.options.render){
                if (this.options.lazyReady){
                    this.trigger("lazyReady");
                }
                else {
                    setTimeout(function(){
                        this.trigger("ready");
                    }.bind(this), 0);
                }
            }
        },
        addSection: function(r) {
            var s = this.getSectionByElement(r);
            if (s) {
                return s
            }
            s = this._addSectionImp(r);
            this._updateSectionVisibility();
            return s
        },
        removeSection: function(r) {
            var t = (r instanceof sectionMap.BaseSection);
            var s = t ? r : this.getSectionByElement(r);
            if (s) {
                this._sections.splice(this._sections.indexOf(s), 1)
            }
            this._updateSectionVisibility();
            return s
        },
        _addSectionImp: function(t) {
            if (t.parentNode !== this._mainEl && this._isNestedSection(t)) {
                console.warn("BasePage::addSection - Jetpack does not support nested BaseSections, consider using a component instead.", t);
                return null
            }
            var s = this._elementTracker.addElement(t);
            this._elementTracker.refreshElementState(s);
            var u = (t.hasAttribute(domAttributes.SECTION_TYPE)) ? t.getAttribute(domAttributes.SECTION_TYPE) : "BaseSection";
            if (u === "") {
                u = "BaseSection"
            }
            if (!sectionMap.hasOwnProperty(u)) {
                throw "BasePage::setupSections parsing '#" + t.id + " ." + t.className + "' no section type '" + u + "'found!"
            }
            var r = sectionMap[u];
            var v = new r(this, t, s, this._getCurrentBreakpoint(), this._getScrollY(), this._getWindowHeight(), this._sections.length);
            v.setupEvents();
            this._sections.push(v);
            return v
        },
        _activateSection: function(r) {
            if (this._currentSection === r) {
                return
            }
            if (this._currentSection) {
                this._currentSection.deactivate()
            }
            if (r) {
                this._currentSection = r;
                this._currentSection.activate()
            }
        },
        _updateSectionVisibility: function() {
            var h = this._getScrollY();
            var j = this._getWindowHeight();
            var c = this._getViewportPadding();
            var a = [];
            var H = this._sections[0];
            var f = [];
            var l = 0;
            var E = [];
            var b = h - c;
            var g = h + j + c;
            for (var I = 0, F = this._sections.length; I < F; I++) {
                var d = this._sections[I];
                var k = d.trackedElement;
                var D = k.pixelsInView;
                if (d.isFixedHero) {
                    D = j - h
                }
                if (D > l) {
                    H = d;
                    l = D
                }
                if (D > 0.000001) {
                    a.push(d);
                    f.push(d);
                    E.push(d)
                } else {
                    if (g > k.top && b < k.bottom) {
                        a.push(d);
                        E.push(d)
                    }
                }
            }
            var i = {};
            var G = {};
            for (I = 0, F = Math.max(this._visibleSections.length, a.length); I < F; I++) {
                if (this._visibleSectionsWithPadding[I]) {
                    if (typeof i[I] === "undefined") {
                        i[I] = E.indexOf(this._visibleSectionsWithPadding[I]) === -1
                    }
                    if (i[I]) {
                        this._visibleSectionsWithPadding[I].onSectionWillDisappearWithPadding(h, j)
                    }
                }
                if (this._visibleSections[I] && f.indexOf(this._visibleSections[I]) === -1) {
                    this._visibleSections[I].onSectionWillDisappear(h, j)
                }
                if (E[I]) {
                    if (typeof G[I] === "undefined") {
                        G[I] = this._visibleSectionsWithPadding.indexOf(E[I]) === -1
                    }
                    if (G[I]) {
                        E[I].onSectionWillAppearWithPadding(h, j)
                    }
                }
                if (f[I] && this._visibleSections.indexOf(f[I]) === -1) {
                    f[I].onSectionWillAppear(h, j)
                }
            }
            this._visibleSections = f;
            this._visibleSectionsWithPadding = E;
            this._activateSection(H)
        },
        _onPageDidAppear: function(r) {},
        _onPageWillDisappear: function(r) {
            this.destroy()
        },
        _onBreakpoint: function(w) {
            var s = w.to;
            var u = w.from;
            this._currentBreakpoint = s;
            var t = this._getScrollY();
            var x = this._getWindowHeight();
            this._elementTracker.refreshAllElementMetrics(t, x);
            for (var v = 0, r = this._sections.length; v < r; v++) {
                this._sections[v].onBreakpoint(s, u, t, x)
            }
            this.performDeepMetricsRefresh()
        },
        _onRetinaChange: function(v) {
            var s = this._getScrollY(true);
            var w = this._getWindowHeight(true);
            this.isRetina = viewportEmitter.retina;
            var u = this._currentBreakpoint;
            this._elementTracker.refreshAllElementMetrics(s, w);
            for (var t = 0, r = this._sections.length; t < r; t++) {
                this._sections[t].onRetinaChange(this.isRetina, u, s, w)
            }
        },
        _onScroll: function(u) {
            var s = this._getScrollY(true);
            var v = this._getWindowHeight();
            this._updateSectionVisibility();
            for (var t = 0, r = this._visibleSections.length; t < r; t++) {
                this._visibleSections[t].onScroll(u, s, v)
            }
        },
        _onResizeDebounced: function(v) {
            var s = this._getScrollY();
            var w = this._getWindowHeight();
            var u = false;
            for (var t = 0, r = this._sections.length; t < r; t++) {
                if (!u && this._sections[t]["onResize"]) {
                    console.warn("Jetpack: onResize has been removed please use `onResizeImmediate` or `onResizeDebounced` instead.");
                    u = true
                }
                this._sections[t].onResizeDebounced(v, s, w)
            }
            this._updateSectionVisibility();
        },
        performDeepMetricsRefresh: function() {
            var s = this._getScrollY();
            var u = this._getWindowHeight();
            this._elementTracker.refreshAllElementMetrics(s, u);
            for (var t = 0, r = this._sections.length; t < r; t++) {
                this._sections[t].elementEngagement.refreshAllElementMetrics(s, u);
                this._sections[t].updateScrollToPosition()
            }
            this._updateSectionVisibility();
        },
        _onOrientationChange: function(v) {
            var t = this._getScrollY(true);
            var w = this._getWindowHeight(true);
            var s = v && v.orientation || 'landscape';
            if (v && v.target && !v.orientation){
                s = v.target.innerHeight > v.target.innerWidth ? 'portrait' : 'landscape';
                v.orientation = s;
            }
            for (var u = 0, r = this._sections.length; u < r; u++) {
                this._sections[u].onOrientationChange(v, s, t, w)
            }
        },
        _onResizeImmediate: function(v) {
            var s = this._getScrollY();
            var w = this._getWindowHeight(true);
            var u = false;
            for (var t = 0, r = this._sections.length; t < r; t++) {
                if (!u && this._sections[t]["onResizeWillBeCalledAfterDelay"]) {
                    console.warn("Jetpack: onResizeWillBeCalledAfterDelay has been removed please use `onResizeImmediate` or `onResizeDebounced` instead.");
                    u = true
                }
                this._sections[t].onResizeImmediate(v, s, w)
            }
            window.clearTimeout(this._resizeTimeout);
            this._resizeTimeout = window.setTimeout(this._onResizeDebounced.bind(this, v), this._resizeTimeoutDelay)
        },
        _onRequestAnimationFrame: function() {
            this._rafId = requestAnimationFrame(this._onRequestAnimationFrame);
            for (var s = 0, r = this._visibleSections.length; s < r; s++) {
                var t = this._visibleSections[s];
                if (t.rafWhenVisible || t.isActive) {
                    t.onRequestAnimationFrame()
                }
            }
        },
        _getScrollY: function(r) {
            if (r) {
                this._cachedScrollY = window.pageYOffset || (document.documentElement || document.body).scrollTop
            }
            return this._cachedScrollY
        },
        _getWindowHeight: function(r) {
            if (r) {
                this._cachedWindowHeight = document.documentElement.clientHeight || window.innerHeight
            }
            return this._cachedWindowHeight
        },
        _getViewportPadding: function() {
            return this._getWindowHeight() * this._viewportPaddingRatio
        },
        _getVisibleBottomOfPage: function() {
            return this._getScrollY() + this._getWindowHeight()
        },
        _getCurrentBreakpoint: function() {
            return this._currentBreakpoint
        },
        _isNestedSection: function(t) {
            var u = t;
            var r = this._sections.length;
            while (u = u.parentElement) {
                for (var s = 0; s < r; s++) {
                    if (this._sections[s].element === u) {
                        return true
                    }
                }
            }
            return false
        },
        getSectionByName: function(q) {
            for (var r = 0, p = this._sections.length; r < p; r++) {
                if (this._sections[r].name === q) {
                    return this._sections[r]
                }
            }
            return null
        },
        getSectionByElement: function(t) {
            for (var s = 0, r = this._sections.length; s < r; s++) {
                if (this._sections[s].element === t) {
                    return this._sections[s]
                }
            }
            return null
        }
    };

    _.extend(app.page.BasePage.prototype, new app.commons.EventEmitterMicro());

})(app.dom, app.utils);
