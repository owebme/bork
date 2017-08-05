(function(app, $, $dom, _){

    app.define("plugins.screens");
    app.define("plugins.marquee.effects");

    app.plugins.screens = function(scope, options){
        this.active = false;
        this.scope = $(scope);
        this.options = options || {};
        this.state = null;
    };

    app.plugins.screens.prototype = {

        init: function(screen){
            var _this = this;

            if (this.active) return;

            this.scope.on('touchmove MSPointerMove', function(e){
        		e.preventDefault();
        	});

            this.scope.on('dragstart selectstart', function() {
                return false;
            });

            var options = {
                vertical: this.options.vertical === false ? false : true,
                screens: '.screen',
                effect: this.options.vertical === false ? 'space' : 'light',
                mousewheel: this.options.vertical === false ? false : this.options.mousewheel !== undefined ? this.options.mousewheel : true,
                activeClass: this.options.activeClass ? this.options.activeClass : !this.options.static ? "screen--active" : false,
                spaceClass: this.options.vertical === false ? 'horizontal__space' : 'vertical__space',
                longClass: this.options.vertical === false ? false : 'screen--long',
                contentClass: this.options.vertical === false ? false : 'screen__content',
                hideSections: this.options.hideSections === false ? false : true,
                navPrev: this.options.navPrev,
        		navNext: this.options.navNext,
                phoneEmulate: this.options.phoneEmulate,
                duration: this.options.vertical === false ? (app.device.isPhone ? 375 : 450) : 500,
            }

            if (this.options) _.extend(options, this.options);

            this.options = options;
            this.items = [];

            var index = 100;
            this.scope.find(options.screens).each(function(i) {
                _this.items.push({
                    index: i,
                    title: this.getAttribute("data-" + (options.dataAttr ? options.dataAttr : "marquee"))
                })
                if (!options.vertical) this.style.zIndex = index;
                index--;
            });

            this.marquee = options.static ? app.plugins.marqueeStatic(this.scope, options) : app.plugins.marquee(this.scope, options);

            this.marquee.enable();

            this.marquee.scroll.on('scrollEnd', function(){
                _this.state = _this.marquee.section;
            });

            if (screen !== undefined) this.nav(screen, 0);

            this.embeds();

            if (this.options.play){
                this.play = new app.plugins.marquee.playScreens(this, this.options.play);
                this.play.init();
            }
            if (this.options.phoneEmulate){
                this.marquee.disableKeyboard();
            }

            this.active = true;
        },

        nav: function(screen, duration){
            if (_.isNumber(screen)){
                if (screen > this.items.length - 1) screen = this.items.length - 1;
                this.marquee.scrollTo(screen, duration !== undefined ? duration : undefined);
                if (duration == 0) this.marquee.refresh();
            }
            else {
                if (!screen) return;
                var item = _.findWhere(this.items, {"title": screen});
                if (item && _.isNumber(item.index)) {
                    this.state = item.title;
                    this.marquee.scrollTo(item.index, duration !== undefined ? duration : undefined);
                    if (duration == 0) this.marquee.refresh();
                }
            }
        },

        get: function(parameter){
    		return this.marquee[parameter];
    	},

        refresh: function(){
            this.marquee.resize();
        },

        refreshAll: function(){
            var index = this.marquee.index;
            this.destroy();
            this.init(index);
        },

        embeds: function(){
            var _this = this;

            if (!app.device.isMobile){
                this.scope.on("mouseenter mouseleave", ".country-list", function(e){
                    if (e.type == "mouseenter"){
                        _this.marquee.scroll.disable();
                    }
                    else {
                        _this.marquee.scroll.enable();
                    }
                });
            }
            if (app.device.isPhone){
                var state = null,
                    $focus = null,
                    resize = _.debounce(this.refresh, 300);

                $dom.window.on('resize.screens', function(){
                    _this.scope.scrollTop(0);
                    if (_this.options.resizeRefresh) resize.call(_this);
            	});

                if (_this.options.static){
                    this.scope.on("focus blur", "input[type='text'], textarea", function(e){
                        if (e.type == "focusin" || e.type == "focus"){
                            $focus = $(e.target);

                            state = "focus";

                            centered(app.sizes.height / 2.5, 400);

                            setTimeout(function(){
                                centered(app.sizes.height / 2.5, 0);
                            }, 300);
                        }
                        else {
                            state = "blur";
                            setTimeout(function(){
                                if (state == "focus"){
                                    centered(app.sizes.height / 2.5, 0);
                                }
                                else if (state == "blur"){
                                    resize.call(_this);
                                }
                            }, 500);
                        }
                        _this.scope.scrollTop(0);
                    });
                }

                var centered = function(delta, duration){
                    var top = $focus.offset().top;
                    if (top < 0){
                        _this.marquee.scroll.scrollBy(0, (-top + delta), duration, (_this.options.static ? IScrollStatic.utils.ease.cubicOut : IScroll.utils.ease.cubicOut));
                    }
                    else if (top > delta){
                        _this.marquee.scroll.scrollBy(0, -(top - delta), duration, (_this.options.static ? IScrollStatic.utils.ease.cubicOut : IScroll.utils.ease.cubicOut));
                    }
                };
            }
        },

        destroy: function(){
            this.scope.off();
            this.marquee.scroll.off();
            this.marquee.destroy();
            if (this.options.play){
                this.play.destroy();
            }
            $dom.window.off('resize.screens');
            this.active = false;
        }
    };

})(app, $, app.$dom, app.utils);
