(function(app, $, $dom, _){

    app.define("plugins.sortable");

    app.plugins.sortable = function(scope, options, callback){
        if (!scope || !options || !callback) return;

        var opt = {
            animation: 400,
            handle: false
        };
        _.extend(opt, options);

        this.scope = scope;
        this.options = opt;
        this.callback = callback;
    };

    app.plugins.sortable.prototype = {

        init: function(){
            var _this = this;

            if (this.active) return;

            this.elem = Sortable.create(this.scope[0], {
                animation: this.options.animation,
                handle: this.options.handle,
                draggable: this.options.draggable,
                onUpdate: function(e){
                    var sort = [];
                    _this.scope.find(_this.options.draggable).each(function(i, item){
                        sort.push({
                            _id: item.getAttribute("data-id"),
                            pos: i + 1
                        })
                    });
                    _this.callback(sort);
                }
            });

            this.active = true;
        },

        destroy: function(){
            this.elem.destroy();
            this.active = false;
        }
    };

})(app, $, app.$dom, app.utils);
