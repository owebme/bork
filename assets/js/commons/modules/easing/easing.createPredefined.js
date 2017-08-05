(function(app, $, $dom, _){

    app.define("easing.createPredefined");

    var l = app.easing.createStep;
    var o = app.easing.cssAliases;
    var r = app.easing.fn;
    var m = app.easing.Ease;
    var n = 'Easing function "%TYPE%" not recognized among the following: ' + Object.keys(r).join(", ");

    function k(b) {
        var a;
        if (b === "step-start") {
            return l(1, "start")
        } else {
            if (b === "step-end") {
                return l(1, "end")
            } else {
                a = r[b]
            }
        }
        if (!a) {
            throw new Error(n.replace("%TYPE%", b))
        }
        return new m(a, o[b])
    }

    app.easing.createPredefined = k;

})(app, $, app.$dom, app.utils);
