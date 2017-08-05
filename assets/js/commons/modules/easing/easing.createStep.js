(function(app, $, $dom, _){

    app.define("easing.createStep");

    var l = app.easing.Ease;
    var i = "Step function expects a numeric value greater than zero. Given: ";
    var j = 'Step function direction must be either "start" or "end" (default). Given: ';

    function k(d, a) {
        a = a || "end";
        if (typeof d !== "number" || d < 1) {
            throw new TypeError(i + d)
        }
        if (a !== "start" && a !== "end") {
            throw new TypeError(j + a)
        }
        var b = function(h, f, g, s) {
            var t = g / d;
            var u = Math[(a === "start") ? "floor" : "ceil"](h / s * d);
            return f + t * u
        };
        var c = "steps(" + d + ", " + a + ")";
        return new l(b, c)
    }

    app.easing.createStep = k;

})(app, $, app.$dom, app.utils);
