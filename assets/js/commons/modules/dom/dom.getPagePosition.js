(function(app, $, $dom, _){

    app.define("dom.getPagePosition");

    var q = app.dom.getDimensions;
    var p = _.getBoundingClientRect;
    var j = app.dom.getScrollX;
    var k = app.dom.getScrollY;

    function l(d, f) {
        var b;
        var g;
        var a;
        var c;
        var h;
        if (f) {
            b = p(d);
            g = j();
            a = k();
            return {
                top: b.top + a,
                right: b.right + g,
                bottom: b.bottom + a,
                left: b.left + g
            }
        }
        c = q(d, f);
        b = {
            top: d.offsetTop,
            left: d.offsetLeft,
            width: c.width,
            height: c.height
        };
        while (d = d.offsetParent) {
            b.top += d.offsetTop;
            b.left += d.offsetLeft
        }
        return {
            top: b.top,
            right: b.left + b.width,
            bottom: b.top + b.height,
            left: b.left
        }
    };

    app.dom.getPagePosition = l;

})(app, $, app.$dom, app.utils);
