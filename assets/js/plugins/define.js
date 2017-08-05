(function(app, $, $dom, _){

    app.define("plugins.define");

    app.plugins.define = function(name){
        this.__name__ = name;
        _.extend(this, window[name] || {});
    };

    app.plugins.define.prototype = {

        module: function (namespace, value) {
            var parts = namespace.split("."),
                parent = window[this.__name__],
                i, l = parts.length;

            for (i = 0; i < l; i++) {

                if (typeof parent[parts[i]] == "undefined") {
                    parent[parts[i]] = {};
                }
                if (l - 1 == i && value){
                    parent[parts[i]] = value;
                }

                parent = parent[parts[i]];
            }
            return parent;
        }
    }

})(app, $, app.$dom, app.utils);
