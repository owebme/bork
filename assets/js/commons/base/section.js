(function(dom, _){

    app.define("section.BaseSection");

    var elementEngagement = app.commons.ElementEngagement,
        querySelectorAll = dom.querySelectorAll,
        domAttributes = dom.attributes,
        componentMap = app.components,
        emitterMicro = app.commons.EventEmitterMicro;

    app.section.BaseSection = function(page, componentElement, trackedElement, currentBreakpoint, scrollPosition, windowHeight, index) {
        if (arguments.length !== 7) {
            throw new Error("Incorrect number of arguments passed to BaseSection check the constructor or BaseSection.call method - argument's should be (page, componentElement, trackedElement, currentBreakpoint, scrollPosition, windowHeight, index)")
        }
        emitterMicro.call(this);
        this.element = componentElement;
        this.trackedElement = trackedElement;
        this.elementEngagement = new elementEngagement(null, {
            autoStart: false
        });
        this.rafWhenVisible = this.rafWhenVisible || false;
        this.index = index;
        this.isVisible = this.trackedElement.pixelsInView > 0;
        this.hasAnimatedIn = false;
        this.isActive = false;
        this.isFixedHero = false;
        this.cachedBreakpoint = currentBreakpoint;
        this.cachedScrollPosition = scrollPosition;
        this.cachedWindowHeight = windowHeight;
        this.name = this.name || this.element.getAttribute("data-name") || this.element.className;
        this.scrollToPosition = 0;
        this.updateScrollToPosition();
        this._components = [];
        this.setupComponents(currentBreakpoint, scrollPosition, windowHeight);
        this.setIsFixedHero();
        page.once("ready", function(){
            this.render();
        }.bind(this));
    };

    app.section.BaseSection.prototype = {
        destroy: function() {
            this.teardownEvents();
            this.elementEngagement.stop();
            this.elementEngagement = null;
            for (var q = 0, p = this._components.length; q < p; q++) {
                this._components[q].destroy()
            }
            this._components = null;
            this.trackedElement = null;
            this.element = null;
            emitterMicro.prototype.destroy.call(this)
        },
        render: function(){
            for (var q = 0, p = this._components.length; q < p; q++) {
                if (this._components[q].render) this._components[q].render()
            }
        },
        setupEvents: function() {
            for (var q = 0, p = this._components.length; q < p; q++) {
                this._components[q].setupEvents()
            }
        },
        teardownEvents: function() {
            for (var q = 0, p = this._components.length; q < p; q++) {
                this._components[q].teardownEvents()
            }
        },
        setupComponents: function() {
            var u = querySelectorAll("[" + domAttributes.COMPONENT_LIST + "]", this.element);
            if (this.element.hasAttribute(domAttributes.COMPONENT_LIST)) {
                u.push(this.element)
            }
            for (var s = 0; s < u.length; s++) {
                var w = u[s];
                var v = w.getAttribute(domAttributes.COMPONENT_LIST);
                if (v.indexOf("|") !== -1) {
                    throw "BaseSection::setupComponents component list should be space delimited, pipe character is no longer supported. Error at: '" + v + "'"
                }
                var t = v.split(" ");
                for (var r = 0, p = t.length; r < p; r++) {
                    var q = t[r];
                    if (q === "" || q === " ") {
                        continue
                    }
                    this.addComponentOfType(q, w)
                }
                setTimeout(this.elementEngagement.refreshAllElementStates.bind(this.elementEngagement), 100)
            }
        },
        addComponentOfType: function(q, s) {
            if (!componentMap.hasOwnProperty(q)) {
                throw "BaseSection::setupComponents parsing '#" + s.id + " ." + s.className + "' no component type '" + q + "' found!"
            }
            var r = componentMap[q];
            if (!this.componentIsSupported(r, q)) {
                console.log("BaseSection::setupComponents unsupported component '" + q + "'. Reason: '" + q + ".IS_SUPPORTED' returned false");
                return
            }
            var p = new r(this, s, q, this.cachedBreakpoint, this.cachedScrollPosition, this.cachedWindowHeight, this._components.length);
            this.rafWhenVisible = p.rafWhenVisible || this.rafWhenVisible;
            this._components.push(p);
            return p
        },
        removeComponentOfType: function(p) {
            var q = this.getComponentByName(p);
            if (q === null) {
                return
            }
            this.removeComponent(q)
        },
        removeComponent: function(q) {
            var p = this._components.indexOf(q);
            if (p === -1) {
                return
            }
            this._components.splice(p, 1);
            q.destroy()
        },
        activate: function() {
            if (app.dom.selectors.SECTION_ACTIVE){
                this.element.classList.add(app.dom.selectors.SECTION_ACTIVE);
            }
            for (var q = 0, p = this._components.length; q < p; q++) {
                if (!this._components[q].isEnabled) {
                    continue
                }
                this._components[q].activate()
            }
            this.isActive = true;
            if (!this.hasAnimatedIn) {
                this.hasAnimatedIn = true;
                if (this.animateDelay){
                    setTimeout(function(){
                        if (app.dom.selectors.SECTION_ANIMATED){
                            this.element.classList.add(app.dom.selectors.SECTION_ANIMATED);
                        }
                        this.animateIn();
                    }.bind(this), this.animateDelay)
                }
                else {
                    if (app.dom.selectors.SECTION_ANIMATED){
                        this.element.classList.add(app.dom.selectors.SECTION_ANIMATED);
                    }
                    this.animateIn();
                }
            }
        },
        deactivate: function() {
            if (app.dom.selectors.SECTION_ACTIVE){
                this.element.classList.remove(app.dom.selectors.SECTION_ACTIVE);
            }
            this.isActive = false;
            for (var q = 0, p = this._components.length; q < p; q++) {
                if (!this._components[q].isEnabled) {
                    continue
                }
                this._components[q].deactivate()
            }
        },
        animateIn: function() {
            for (var q = 0, p = this._components.length; q < p; q++) {
                if (!this._components[q].isEnabled) {
                    continue
                }
                this._components[q].animateIn()
            }
        },
        onRequestAnimationFrame: function() {
            for (var r = 0, p = this._components.length; r < p; r++) {
                var q = this._components[r];
                if (!q.isEnabled) {
                    continue
                }
                if (q.rafWhenVisible || this.isActive) {
                    q.onRequestAnimationFrame()
                }
            }
        },
        onResizeImmediate: function(t, q, u) {
            this.cachedScrollPosition = q;
            this.cachedWindowHeight = u;
            var s = false;
            for (var r = 0, p = this._components.length; r < p; r++) {
                if (!this._components[r].isEnabled) {
                    continue
                }
                if (!s && this._components[r]["onResizeWillBeCalledAfterDelay"]) {
                    console.warn("Jetpack: onResizeWillBeCalledAfterDelay has been removed please use `onResizeImmediate` or `onResizeDebounced` instead.");
                    s = true
                }
                this._components[r].onResizeImmediate(t, q, u)
            }
        },
        onResizeDebounced: function(t, q, u) {
            this.updateScrollToPosition();
            var s = false;
            for (var r = 0, p = this._components.length; r < p; r++) {
                if (!this._components[r].isEnabled) {
                    continue
                }
                if (!s && this._components[r]["onResize"]) {
                    console.warn("Jetpack: onResize has been removed please use `onResizeImmediate` or `onResizeDebounced` instead.");
                    s = true
                }
                this._components[r].onResizeDebounced(t, q, u)
            }
            this.elementEngagement.refreshAllElementMetrics(q, u)
        },
        onBreakpoint: function(r, u, q, t) {
            this.cachedBreakpoint = r;
            for (var s = 0, p = this._components.length; s < p; s++) {
                if (!this._components[s].isEnabled) {
                    continue
                }
                this._components[s].onBreakpoint(r, u, q, t)
            }
        },
        onRetinaChange: function(u, s, q, t) {
            for (var r = 0, p = this._components.length; r < p; r++) {
                if (!this._components[r].isEnabled) {
                    continue
                }
                this._components[r].onRetinaChange(u, s, q, t)
            }
            this.elementEngagement.refreshAllElementMetrics(q, t)
        },
        onOrientationChange: function(t, r, q, u) {
            this.cachedScrollPosition = q;
            this.cachedWindowHeight = u;
            for (var s = 0, p = this._components.length; s < p; s++) {
                if (!this._components[s].isEnabled) {
                    continue
                }
                this._components[s].onOrientationChange(t, r, q, u)
            }
        },
        onScroll: function(s, q, t) {
            this.cachedScrollPosition = q;
            this.elementEngagement.refreshAllElementStates(q);
            for (var r = 0, p = this._components.length; r < p; r++) {
                if (!this._components[r].isEnabled) {
                    continue
                }
                this._components[r].onScroll(s, q, t)
            }
        },
        onSectionWillAppearWithPadding: function(c, a) {
            this.cachedScrollPosition = c;
            this.isVisibleWithPadding = true;
            this.elementEngagement.refreshAllElementStates(c);
            for (var b = 0, d = this._components.length; b < d; b++) {
                this._components[b].onSectionWillAppearWithPadding(c, a)
            }
        },
        onSectionWillAppear: function(q, s) {
            this.cachedScrollPosition = q;
            this.isVisible = true;
            this.elementEngagement.refreshAllElementStates(q);
            for (var r = 0, p = this._components.length; r < p; r++) {
                this._components[r].onSectionWillAppear(q, s)
            }
        },
        onSectionWillDisappearWithPadding: function(c, a) {
            this.cachedScrollPosition = c;
            this.isVisibleWithPadding = false;
            for (var b = 0, d = this._components.length; b < d; b++) {
                this._components[b].onSectionWillDisappearWithPadding(c, a)
            }
        },
        onSectionWillDisappear: function(q, s) {
            this.cachedScrollPosition = q;
            this.isVisible = false;
            for (var r = 0, p = this._components.length; r < p; r++) {
                this._components[r].onSectionWillDisappear(q, s)
            }
        },
        getComponentByName: function(q) {
            if (!componentMap.hasOwnProperty(q)) {
                throw "BaseSection::getComponentByName no component type '" + q + "' exist in ComponentMap!"
            }
            for (var r = 0, p = this._components.length; r < p; r++) {
                if (this._components[r].componentName === q) {
                    return this._components[r]
                }
            }
            return null
        },
        getAllComponentsByName: function(q) {
            if (!componentMap.hasOwnProperty(q)) {
                throw "BaseSection::getAllComponentsByName no component type '" + q + "' exist in ComponentMap!"
            }
            var s = [];
            for (var r = 0, p = this._components.length; r < p; r++) {
                if (this._components[r].componentName === q) {
                    s.push(this._components[r])
                }
            }
            return s
        },
        updateScrollToPosition: function() {
            return this.scrollToPosition = dom.getPagePosition(this.element).top
        },
        setIsFixedHero: function() {
            if (this.index !== 0) {
                this.isFixedHero = false
            } else {
                var p = window.getComputedStyle(this.element);
                this.isFixedHero = p.position === "fixed"
            }
        },
        componentIsSupported: function(s, q) {
            var p = s.IS_SUPPORTED;
            if (p === undefined) {
                return true
            }
            if (typeof p !== "function") {
                console.error('BaseSection::setupComponents error in "' + q + '".IS_SUPPORTED - it should be a function which returns true/false');
                return true
            }
            var r = s.IS_SUPPORTED();
            if (r === undefined) {
                console.error('BaseSection::setupComponents error in "' + q + '".IS_SUPPORTED - it should be a function which returns true/false');
                return true
            }
            return r
        }
    };

    _.extend(app.section.BaseSection.prototype, new app.commons.EventEmitterMicro());

})(app.dom, app.utils);
