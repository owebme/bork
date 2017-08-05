(function(app, $, $dom, _){

    app.define("dom.styles.cssToObject");

    function g(d) {
        var b;
        var a;
        var c;
        var n;
        var m;
        if (typeof d === "string") {
            b = {};
            a = d.split(";");
            n = a.length;
            for (m = 0; m < n; m += 1) {
                c = a[m].indexOf(":");
                if (c > 0) {
                    b[a[m].substr(0, c).trim()] = a[m].substr(c + 1).trim()
                }
            }
        } else {
            b = d
        }
        return b
    };

    app.dom.styles.cssToObject = g;

})(app, $, app.$dom, app.utils);
