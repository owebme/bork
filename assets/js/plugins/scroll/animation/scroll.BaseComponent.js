(function(app, $, $dom, _){

    app.define("plugins.scroll.BaseComponent");

    var l = app.commons.EventEmitterMicro,
        k = l.prototype;

    function j() {
        l.call(this);
        this.index = 0;
        this.rafWhenVisible = this.rafWhenVisible || false
    }
    var m = j.prototype = Object.create(l.prototype);
    j.prototype.constructor = j;
    m.destroy = function() {
        this.teardownEvents();
        k.destroy.call(this)
    };
    m.setupEvents = function() {};
    m.teardownEvents = function() {};
    m.onSectionWillAppear = function(b, a) {};
    m.activate = function() {};
    m.animateIn = function() {};
    m.onRequestAnimationFrame = function() {};
    m.deactivate = function() {};
    m.onScroll = function(b, c, a) {};
    m.onSectionWillDisappear = function(b, a) {};
    m.onResize = function(b, c, a) {};
    m.onResizeWillBeCalledAfterDelay = function(b, c, a) {};
    m.onBreakpoint = function(c, a, d, b) {};

    app.plugins.scroll.BaseComponent = j;

})(app, $, app.$dom, app.utils);
