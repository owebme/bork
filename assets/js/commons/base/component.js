(function(dom, _){

    app.define("component.BaseComponent");

    var k = app.commons.RAF.Emitter,
        g = app.commons.EventEmitterMicro,
        h = g.prototype;

    function a(section, componentElement, componentName, currentBreakpoint, scrollPosition, windowHeight, index) {
        if (arguments.length !== 7) {
            throw new Error("Incorrect number of arguments passed to BaseComponent check the constructor or BaseComponent.call method - argument's should be (section, componentElement, componentName, currentBreakpoint, scrollPosition, windowHeight, index)")
        }
        g.call(this);
        this.section = section;
        this.element = componentElement;
        this.componentName = componentName;
        this.currentBreakpoint = currentBreakpoint;
        this.index = index;
        this.isEnabled = true;
        this.rafWhenVisible = this.rafWhenVisible || false
    }
    var f = a.prototype = Object.create(g.prototype);
    a.prototype.constructor = a;
    f.destroy = function() {
        this.teardownEvents();
        this.teardownRAFEmitter();
        this.section = null;
        h.destroy.call(this)
    };
    f.onDOMRead = function(a) {};
    f.onDOMWrite = function(a) {};
    f.requestDOMChange = function() {
        if (!this.isEnabled || !this.section.isVisible) {
            return false
        }
        if (!this._rafEmitter) {
            this.setupRAFEmitter()
        }
        return this._rafEmitter.run()
    };
    f.setupEvents = function() {};
    f.teardownEvents = function() {};
    f.setupRAFEmitter = function() {
        if (this._rafEmitter) {
            return
        }
        this._rafEmitter = new k();
        this.onDOMRead = this.onDOMRead.bind(this);
        this.onDOMWrite = this.onDOMWrite.bind(this);
        this._rafEmitter.on("update", this.onDOMRead);
        this._rafEmitter.on("draw", this.onDOMWrite)
    };
    f.teardownRAFEmitter = function() {
        if (!this._rafEmitter) {
            return
        }
        this._rafEmitter.destroy();
        this._rafEmitter = null
    };
    f.activate = function() {};
    f.deactivate = function() {};
    f.animateIn = function() {};
    f.onRequestAnimationFrame = function() {};
    f.onScroll = function(j, i, k) {}; // {e, scrollTop, windowHeight}
    f.onSectionWillAppearWithPadding = function(i, j) {}; // {scrollTop, windowHeight}
    f.onSectionWillAppear = function(i, j) {}; // {scrollTop, windowHeight}
    f.onSectionWillDisappearWithPadding = function(i, j) {}; // {scrollTop, windowHeight}
    f.onSectionWillDisappear = function(i, j) {}; // {scrollTop, windowHeight}
    f.onResizeDebounced = function(j, i, k) {}; // {e, scrollTop, windowHeight}
    f.onResizeImmediate = function(j, i, k) {}; // {e, scrollTop, windowHeight}
    f.onOrientationChange = function(k, j, i, l) {}; // {e, orientation, scrollTop, windowHeight}
    f.onBreakpoint = function(j, l, i, k) {}; // {to, from, scrollTop, windowHeight}
    f.onRetinaChange = function(l, j, i, k) {}; // {isRetina, bPoint, scrollTop, windowHeight}

    app.component.BaseComponent = a;

})(app.dom, app.utils);
