(function(app, $, $dom, _){

    app.define("commons.clockShared");

    var h = app.commons.clock,
        a;

    function b() {
        var c = new h();
        return c
    }

    app.commons.clockShared = {
        getInstance: function() {
            if (!a) {
                a = b()
            }
            return a
        }
    }

})(app, $, app.$dom, app.utils);
