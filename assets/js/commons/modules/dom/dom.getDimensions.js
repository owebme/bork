(function(app, $, $dom, _){

    app.define("dom.getDimensions");

    var g = _.getBoundingClientRect;

    function h(c, a) {
        var b;
        if (a) {
            b = g(c);
            return {
                width: b.width,
                height: b.height
            }
        }
        return {
            width: c.offsetWidth,
            height: c.offsetHeight
        }
    };

    app.dom.getDimensions = h;

})(app, $, app.$dom, app.utils);
