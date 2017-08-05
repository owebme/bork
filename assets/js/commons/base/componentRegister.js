(function(dom, _){

    app.define("component.register");

    app.component.register = function(name, component, supported){

        app.define("components." + name);

        var f = app.component.BaseComponent;

        var h = function(p, r, l, o, m, q, n) {
            this.name = name + "_" + n;
            f.call(this, p, r, l, o, m, q, n);
            if (component.init) component.init.call(this);
        };

        var g = h.prototype = Object.create(f.prototype);
        h.prototype.constructor = h;

        _.extend(g, _.omit(component, 'init'));

        app.components[name] = h;

        if (supported){
            app.components[name]["IS_SUPPORTED"] = supported;
        }
    }

})(app.dom, app.utils);
