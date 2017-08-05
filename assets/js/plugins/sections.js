(function(app, $, $dom, _){

    app.define("plugins.sections");

    app.plugins.sections = function(scope, options){
        this.scope = scope;
        this.active = false;
        this.options = options || {};
        this.content = this.options.content || this.scope;
    };

    app.plugins.sections.prototype = {

        show: function(options){
            if (this.active) return;

            var _this = this,
                options = options || {};

            this.scroll = options && options.scroll || null;

            this.active = true;

            if (options.forceShow){
                var $content = $(this.getContent());
                $content.addClass("transition-none");
                this.scope.setAttribute("data-inner", "show");
                this.scope.setAttribute("data-open", true);
                if (options.scroll){
                    options.scroll.refresh();
                    options.scroll.scrollTop();
                }
                if (_.isFunction(options.beforeShow)){
                    options.beforeShow();
                }
                if (options.update && options.tag){
                    options.tag.update(options.update);

                    options.tag.one("updated", function(){
                        if (_.isFunction(options.afterShow)){
                            options.afterShow();
                        }
                    });
                }
                else {
                    if (_.isFunction(options.afterShow)){
                        options.afterShow();
                    }
                }
                $afterlag.run(function(){
                    $content.removeClass("transition-none");
                });
                return;
            }

            if (this.options.mode === "light"){
                this.scope.style.display = "block";
                $afterlag.run(function(){
                    _this.scope.setAttribute("data-open", true);
                    if (_.isFunction(options.afterShow)){
                        options.afterShow();
                    }
                });
            }
            else {
                this.scope.setAttribute("data-open", true);
                this.scope.setAttribute("data-loading", true);

                if (_.isFunction(options.beforeShow)){
                    options.beforeShow();
                }
                _.onEndTransition(this.getContent(), function(){
                    if (_.isFunction(options.callback)){
                        options.callback(_this._afterShow.bind(_this), _this.hide.bind(_this));
                    }
                    else {
                        if (options.update && options.tag){
                            options.tag.one("updated", function(){
                                _this._afterShow(options);
                            });
                            options.tag.update(options.update);
                        }
                        else {
                            _this._afterShow(options);
                        }
                    }
                });
            }
        },

        getContent: function(){
            if (this.options.content && _.isFunction(this.content)){
                return this.content();
            }
            else {
                return this.content;
            }
        },

        _afterShow: function(options){
            var _this = this,
                options = options || {};

            this.scope.setAttribute("data-inner", "show");

            $afterlag.run(function(){
                if (_this.scroll){
                    _this.scroll.refresh();
                    _this.scroll.scrollTop();
                }
                _this.scope.setAttribute("data-loading", false);

                if (_.isFunction(options.afterShow)){
                    options.afterShow();
                }
            });
        },

        loading: function(show){
            var _this = this;

            if (show){
                this.scope.setAttribute("data-inner", "hidden");
                this.scope.setAttribute("data-loading", true);
            }
            else {
                this.scope.setAttribute("data-inner", "show");

                $afterlag.run(function(){
                    _this.scope.setAttribute("data-loading", false);
                });
            }
        },

        hide: function(options){
            if (!this.active) return;

            var _this = this,
                options = options || {};

            if (this.options.mode === "light"){
                this.scope.setAttribute("data-open", false);
                _.onEndTransition(_this.getContent(), function(){
                    _this.scope.style.display = "none";
                    if (_.isFunction(options.afterHide)){
                        options.afterHide();
                    }
                    _this.active = false;
                });
            }
            else {
                this.scope.setAttribute("data-open", false);
                this.scope.setAttribute("data-loading", false);

                if (_.isFunction(options.beforeHide)){
                    options.beforeHide();
                }
                _.onEndTransition(this.getContent(), function(){
                    _this.scope.setAttribute("data-inner", "hidden");

                    if (_.isFunction(options.afterHide)){
                        options.afterHide();
                    }
                    _this.active = false;
                });
            }
        }
    };

})(app, $, app.$dom, app.utils);
