(function(app, $, $dom, _){

    app.define("dom.getScrollX");

    function g(b) {
        var a;
        b = b || window;
        if (b === window) {
            a = window.pageXOffset;
            if (!a) {
                b = document.documentElement || document.body.parentNode || document.body
            } else {
                return a
            }
        }
        return b.scrollLeft
    };

    app.dom.getScrollX = g;

})(app, $, app.$dom, app.utils);
