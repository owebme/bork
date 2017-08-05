(function(dom, _){

    app.define("commons.RAF.ExecutorShared");

    var h = app.commons.RAF.Executor,
        a;

    function b() {
        var c = new h();
        return c
    }

    app.commons.RAF.ExecutorShared = {
        getInstance: function() {
            if (!a) {
                a = b()
            }
            return a
        }
    }

})(app.dom, app.utils);
