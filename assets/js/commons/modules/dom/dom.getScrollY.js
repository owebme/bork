(function(app, $, $dom, _){

    app.define("dom.getScrollY");

    function g(b) {
        var a;
        b = b || window;
        if (b === window) {
            a = window.pageYOffset;
            if (!a) {
                b = document.documentElement || document.body.parentNode || document.body
            } else {
                return a
            }
        }
        return b.scrollTop
    };

    app.dom.getScrollY = g;

})(app, $, app.$dom, app.utils);
