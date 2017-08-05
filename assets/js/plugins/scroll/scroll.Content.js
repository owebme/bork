(function(app, $, $dom, _){

    app.define("plugins.scroll.content");

    app.plugins.scroll.content = function(scope, options){
        if (!scope) return;

        this.active = false;
        this.scope = $(scope);
        this.options = options;
    };

    app.plugins.scroll.content.prototype = {

        init: function(){
            var _this = this;

            if (this.active || !this.scope.length) return;

            // this.scope.on('touchmove MSPointerMove', function(e){
        	// 	e.preventDefault();
        	// });
            //
            // this.scope.on('dragstart selectstart', function() {
            //     return false;
            // });

            var options = {
                disableMouse: false,
                mouseWheel: true,
                scrollX: false,
                scrollY: true,
                click: false,
                tap: false,
                preventDefault: true,
                eventPassthrough: 'horizontal',
                forceBounds: app.device.isMobile ? true : false,
    			boundDeceleration: app.device.isMobile ? 3.5 : false,
                scrollbars: 'custom',
                interactiveScrollbars: !app.device.support.touch,
                probeType: app.device.support.touch ? false : 3,
            }
            if (this.options) _.extend(options, this.options);

            if (app.device.isMobile){
                options.deceleration = 0.0006;
            }

        	this.scroll = new IScroll(this.scope[0], options);

            if (options.keyboard && !app.device.support.touch) this.keyboard();
        	this.embeds(app.device.isMobile && options.autoScroll ? true : false);

            this.active = true;
        },

        show: function(){
            this.scroll.enable();
        },

        hide: function(){
            this.scroll.disable();
        },

        scrollTop: function(){
            this.scroll.scrollTo(0, 0);
        },

        refresh: function(){
            this.scroll.refresh();
        },

        keyboard: function(){
            var scroll = this.scroll,
                eventName = 'keydown.keyboards-scroll-' + String(Math.round(new Date().getTime() / 1000));
                paused = false,
                duration = 500;

            // scroll to
            var scrollTo = function(y){
                if (paused) return false;
                paused = true;
                scrollTimer = setTimeout(function(){
                    paused = false;
                }, 50);
                scroll.scrollTo(0, y, duration, IScroll.utils.ease.cubicOut);
            };

            // prev
            var prev = function(){
                var y = Math.min(0, scroll.y + 100);
                scrollTo(y);
            };

            // next
            var next = function(){
                var y = Math.max(scroll.maxScrollY, scroll.y - 100);
                scrollTo(y);
            };

            // prev
            var pageUp = function(){
                var y = Math.min(0, scroll.y + scroll.wrapperHeight);
                scrollTo(y);
            };

            // next
            var pageDown = function(){
                var y = Math.max(scroll.maxScrollY, scroll.y - scroll.wrapperHeight);
                scrollTo(y);
            };

            // start
            var toStart = function(){
                scrollTo(0);
            };

            // start
            var toEnd = function(){
                scrollTo(scroll.maxScrollY);
            };

            // {fn} enable
            scroll.enableKeyboardScroll = function(){
                if (!app.device.support.touch) $dom.document.on(eventName, function(e){
                    if (e.which==38) prev();
                    if (e.which==40) next();
                    if (e.which==33) pageUp();
                    if (e.which==34) pageDown();
                    if (e.which==36) toStart();
                    if (e.which==35) toEnd();
                });
            };

            // {fn} disable
            scroll.disableKeyboardScroll = function(){
                if (!app.device.support.touch) $dom.document.off(eventName);
            };

            // init
            if (scroll.enabled) scroll.enableKeyboardScroll();

            scroll.on('enable', function(){
                scroll.enableKeyboardScroll();
            });

            scroll.on('disable', function(){
                scroll.disableKeyboardScroll();
            });
        },

        embeds: function(autoScroll){
            var _this = this,
                scope = this.scope,
                scroll = this.scroll,
                isScrolled = false,
                grabTimer,
                state = null,
                $focus = null,
                resize = _.debounce(this.refresh, 300);

            scroll.enable();

            $dom.window.on('resize.scrollable-content', function(){
                if (app.device.isMobile) _this.scope.scrollTop(0);
                if (autoScroll){
                    if (state == "focus" && $focus){
                        setTimeout(function(){
                            centered(app.sizes.height / 1.3, 0);
                        }, 150);
                    }
                }
                resize.call(_this);
        	});

            if (autoScroll){
                this.scope.on("focus blur", "input[type='text'], textarea", function(e){
                    if (e.type == "focusin" || e.type == "focus"){
                        $focus = $(e.target);

                        state = "focus";

                        centered(app.sizes.height / 2.5, 400);
                    }
                    else {
                        state = "blur";
                    }
                    _this.scope.scrollTop(0);
                });
            }
            if (!app.device.isMobile){
                this.scope.on("mouseenter mouseleave", ".country-list", function(e){
                    if (e.type == "mouseenter"){
                        scroll.disable();
                    }
                    else {
                        scroll.enable();
                    }
                });
            }

            var centered = function(delta, duration){
                var top = $focus.offset().top;
                if (top < delta){
                    scroll.scrollBy(0, (-top + delta), duration, IScroll.utils.ease.cubicOut);
                }
                else if (top > delta){
                    scroll.scrollBy(0, -(top - delta), duration, IScroll.utils.ease.cubicOut);
                }
            };

            var start = function(){
                clearTimeout(grabTimer);
        		if (!isScrolled) {
        			scope.addClass('i-scrolling');
        			isScrolled = true;
        		}
        	};
        	var end = function(){
                clearTimeout(grabTimer);
        		if (isScrolled) {
        			scope.removeClass('i-scrolling');
        			isScrolled = false;
        		}
        	};

            if (app.device.isMobile){
            	scroll.on('grab', function(){
            		start();
                    grabTimer = setTimeout(function(){
            			end();
            		}, 500);
            	});
            	scroll.on('scrollEnd', function(){
            		end();
            	});
            }
        },

        destroy: function(){
            this.scope.off();
            this.scroll.destroy();
            $dom.window.off('resize.scrollable-content');
            this.active = false;
        }
    };

})(app, $, app.$dom, app.utils);
