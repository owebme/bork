(function(dom, _){

    app.define("commons.RAF.Controller");

    var h = app.commons.RAF.Emitter;
    var g = app.commons.RAF.Throttled;

    app.commons.RAF.Controller = function(a) {
        return function(b, c) {
            var d;
            if (c) {
                d = new g(c)
            } else {
                d = new h()
            }
            d.once(a, function(f) {
                b(f);
                d.destroy();
                b = d = null
            });
            d.run()
        }
    };

})(app.dom, app.utils);
