(function(dom, _){

    app.define("commons.TrackedElement");

    var i = app.commons.EventEmitterMicro;
    var j = i.prototype;

    function g(k, l) {
        if (!_.isElement(k)) {
            throw new TypeError("TrackedElement: " + k + " is not a valid DOM element")
        }
        i.call(this);
        this.element = k;
        this.inView = false;
        this.percentInView = 0;
        this.pixelsInView = 0;
        this.offsetTop = 0;
        this.top = 0;
        this.right = 0;
        this.bottom = 0;
        this.left = 0;
        this.width = 0;
        this.height = 0;
        this.useRenderedPosition = l || false
    }
    var f = g.prototype = _.create(j);
    f.destroy = function() {
        this.element = null;
        j.destroy.call(this)
    };

    app.commons.TrackedElement = g;

})(app.dom, app.utils);
