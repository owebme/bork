(function(app, $, $dom, _){

    app.define("dom.querySelectorAll");

    function f(i, j) {
        j = j || document;
        return Array.prototype.slice.call(j.querySelectorAll(i))
    };

    app.dom.querySelectorAll = f;

})(app, $, app.$dom, app.utils);
