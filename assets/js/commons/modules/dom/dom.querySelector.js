(function(app, $, $dom, _){

    app.define("dom.querySelector");

    function f(i, j) {
        j = j || document;
        return j.querySelector(i)
    };

    app.dom.querySelector = f;

})(app, $, app.$dom, app.utils);
