(function(app, $, $dom, _){

    app.define("app.dom.styles.setStyle");

    var k = app.dom.styles.prefixer;
    var i = app.dom.styles.cssToObject;
    var j = app.dom.styles.combinePartialProperties;

    function l(g, b) {
        var c;
        var d;
        var h;
        var f;
        var a;
        if ((typeof b !== "string" && typeof b !== "object") || Array.isArray(b)) {
            throw new TypeError("setStyle: styles must be an Object or String")
        }
        b = i(b);
        b = j(b);
        c = "";
        for (h in b) {
            a = b[h];
            if (!a && a !== 0) {
                f = k.getStyleProperty(h);
                if ("removeAttribute" in g.style) {
                    g.style.removeAttribute(f)
                } else {
                    g.style[f] = ""
                }
            } else {
                d = k.getStyleCSS(h, a);
                if (d !== false) {
                    c += " " + d
                }
            }
        }
        if (c.length) {
            g.style.cssText += c
        }
        return g
    }

    app.dom.styles.setStyle = l;

})(app, $, app.$dom, app.utils);
