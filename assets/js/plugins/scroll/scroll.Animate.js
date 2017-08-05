(function(app, $, $dom, _){

    app.define("plugins.scroll.animate");

    app.plugins.scroll.animate = function(options){
        this.ready = false;
        this.delay = options.delay;
        this.selector = options.selector ? options.selector : ".anim";
        this.scroll = options.scroll ? $(options.scroll) : $dom.window;
        this.scrollTracker = options.scroll ? (app.device.isIE && options.scroll === $dom.window ? document.documentElement : (_.isElement(options.scroll) ? options.scroll : options.scroll[0])) : (app.device.isIE ? document.documentElement : $dom.window[0]);
        this.scope = options.container ? $(options.container) : $dom.body;
        this.delta = options.delta ? this.deltaValues.getValueByTitle(options.delta) : null;
        this._items = options.items;
        this.onlyItems = options.onlyItems;
        this.eventResize = app.device.isMobile ? 'orientationchange' : 'resize';
        this.items = [];
    };

    app.plugins.scroll.animate.prototype = {

        start: function(render){
            var _this = this;

            if (!this.ready || render) this.render();

            if (this.items.length){

                this.scroll.on("scroll.animate", function(){
                    _this.raf = _.raf(function(){
                        _this.onScroll.call(_this);
                    });
                });

                var resize = _.debounce(this.render, 1000);

                $dom.window.on(this.eventResize + '.scroll-animate', function(){
                    resize.call(_this);
            	});
            }
        },

        render: function(force){
            var _this = this;

            this.ready = false;

            this.scrollTop = this.getScrollY.call(this);

            if (!force && !_.isEmpty(this.items)){
                _.each(this.items, function(item){
                    if (!item.anim){
                        item.offset = item.elem.offset();
                    }
                });
            }
            else {
                this.items = [];

                if (this._items){
                    var i = 0;
                    _.each(this._items, function(item){
                        (function(item){
                            _this.scope.find(item.elem).each(function(){
                                _this.each({
                                    elem: this,
                                    index: i,
                                    delta: item.delta,
                                    callback: item.callback
                                })
                                i++;
                            });
                        })(item);
                    });
                }

                if (!this.onlyItems){
                    this.scope.find(this.selector).each(function(){
                        _this.each({
                            elem: this
                        })
                    });
                }
            }

            this.ready = true;
        },

        each: function(options){
            var $elem = $(options.elem),
                delta = options.delta || options.elem.getAttribute("data-delta");

            if (delta) delta = this.deltaValues.getValueByTitle(delta);
            else delta = this.delta ? this.delta : this.deltaValues.getValueByTitle("m");

            var data = {
                elem: $elem,
                anim: false,
                offset: $elem.offset(),
                delta: app.device.isMobile && app.device.orientation === "portrait" ? delta * 1.25 : delta,
                callback: options.callback ? options.callback : null
            };

            if (!this.iteration(this.scrollTop, data, options.index)){
                this.items.push(data);
            }
        },

        onScroll: function(){
            if (!this.ready) return;

            var _this = this,
                scroll = this.getScrollY.call(this);

            this.items.forEach(function(item, i){
                _this.iteration(scroll, item, i);
            });
        },

        getScrollY: function(){
            return this.scrollTracker.scrollTop || this.scrollTracker.scrollY;
        },

        iteration: function(scroll, item, i){
            if (!item.anim && (scroll + app.sizes.height * item.delta) > item.offset.top){
                item.anim = true;
                if (item.callback) item.callback(item.elem, i);
                else item.elem.addClass("animated");
                return true;
            }
            else {
                return false;
            }
        },

        destroy: function(){
            $dom.window.off(this.eventResize + '.scroll-animate');
            this.scroll.off("scroll.animate");
            _.caf(this.raf);
            this.items.forEach(function(item, i){
                if (item.anim){
                    item.anim = false;
                    item.elem.removeClass("animated");
                }
            });
            this.ready = false;
        },

        deltaValues: {

            items: [
                {
                    title: "xxs",
                    value: 1.25
                },
                {
                    title: "xs",
                    value: 1
                },
                {
                    title: "s",
                    value: 0.733
                },
                {
                    title: "m",
                    value: 0.54
                },
                {
                    title: "l",
                    value: 0.38
                },
                {
                    title: "xl",
                    value: 0.25
                }
            ],

            getValueByTitle: function(title){
                return _.findWhere(this.items, {"title": title}).value;
            }
        }
    };

})(app, $, app.$dom, app.utils);
