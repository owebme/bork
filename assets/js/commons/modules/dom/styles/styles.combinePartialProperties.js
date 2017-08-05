(function(app, $, $dom, _){

    app.define("dom.styles.combinePartialProperties");

    var g = {
        transform: ["matrix", "translate", "translateX", "translateY", "scale", "scaleX", "scaleY", "rotate", "skewX", "skewY", "matrix3d", "translate3d", "translateZ", "scale3d", "scaleZ", "rotate3d", "rotateX", "rotateY", "rotateZ", "perspective"],
        filter: ["blur", "brightness", "contrast", "drop-shadow", "grayscale", "hue-rotate", "invert", "saturate", "sepia"]
    };

    function h(c) {
        var a;
        var b;
        var d;
        var f;
        for (a in g) {
            b = c[a] ? c[a] : "";
            for (f = 0; f < g[a].length; f++) {
                d = g[a][f];
                if (d in c) {
                    b += " " + d + "(" + c[d] + ")";
                    delete c[d]
                }
            }
            b = b.trim();
            if (b) {
                c[a] = b
            }
        }
        return c
    };

    app.dom.styles.combinePartialProperties = h;

})(app, $, app.$dom, app.utils);
