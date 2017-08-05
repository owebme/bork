(function(app, $, $dom, _){

    app.define("plugins.scroll.parallaxLite");

    app.plugins.scroll.parallaxLite = function(options){

        if (!options || options && !options.container) return;

        this.ready = false;
        this.scroll = options.scroll && $(options.scroll) || $dom.window;
        this.scrollTracker = app.device.isIE && this.scroll === $dom.window ? document.documentElement : (_.isElement(this.scroll) ? this.scroll : this.scroll[0]);
        this.scope = options.container ? $(options.container) : null;
        this.items = options.items;
        this.eventResize = app.device.isMobile ? 'orientationchange' : 'resize';
    };

    app.plugins.scroll.parallaxLite.prototype = {

        start: function(render){
            var _this = this;

            if (!this.ready || render) this.render();

            if (this.items && this.items.length){

                (function scrollParallax(){
                    _this.raf = _.raf(scrollParallax);
                    if (_this.ready) _this.onScroll.call(_this);
                })();

                var resize = _.debounce(this.render, 300);

                $dom.window.on(this.eventResize + '.scroll-parallaxLite', function(){
                    resize.call(_this);
            	});
            }
        },

        render: function(){
            var _this = this;

            this.ready = false;

            this.scopeOffsetTop = this.scope.offset().top;
            this.scopeHeight = this.scope.height();

            _.each(this.items, function(item, i){
                item.$elem = _this.scope.find(item.selector);
                item.height = item.$elem.height();
                item.width = item.$elem.width();
            });

            this.ready = true;
        },

        onScroll: function(){
            var _this = this,
                scrollTop = this.scrollTracker.scrollTop || this.scrollTracker.scrollY,
                delta = scrollTop - this.scopeOffsetTop;

            this.items.forEach(function(item, i){
                if (scrollTop + app.sizes.height > _this.scopeOffsetTop && scrollTop < _this.scopeOffsetTop + _this.scopeHeight + 1){
                    var options = item.options,
                        speedY = 1 / (options.oy && options.oy.speed || options.speed),
                        speedX = 1 / (options.ox && options.ox.speed || options.speed);

                    if (options.clip){
                        var shiftY = delta / speedY,
                            shiftX = delta / speedX;

                        if (options.clip.direction === "up"){
                            item.clipping = "rect(0, auto, " + (item.height - shiftY) + "px, 0)";
                        }
                        else if (options.clip.direction === "down"){
                            item.clipping = "rect(0, auto, " + shiftY + "px, 0)";
                        }
                        else if (options.clip.direction === "left"){
                            item.clipping = "rect(0, " + (item.width - shiftY) + "px, auto, 0)";
                        }
                        else if (options.clip.direction === "right"){
                            item.clipping = "rect(0, " + shiftX + "px, auto, 0)";
                        }
                    }
                    else {
                        var shiftY = options.oy ? delta / (options.oy.direction === "up" ? -speedY : speedY) : 0,
                            shiftX = options.ox ? delta / (options.ox.direction === "left" ? -speedX : speedX) : 0,
                            shiftRotate = options.rotate ? (delta > 0 ? (delta / app.sizes.width) * options.rotate.deg : 0) : 0;

                        item.transform = 'translateY(' + shiftY + 'px) translateX(' + shiftX + 'px) translateZ(0) rotate(' + shiftRotate + 'deg)';
                    }

                    _this.update(item);
                }
            });
        },

        update: function(item){
            if (item.clipping){
                item.$elem.css({
                    clip: item.clipping,
                    '-webkit-clip': item.clipping
                });
            }
            else {
                item.$elem.css({
                    transform: item.transform,
                    '-webkit-transform': item.transform
                });
            }
        },

        destroy: function(){
            _.caf(this.raf);
            $dom.window.off(this.eventResize + '.scroll-parallaxLite');
            this.ready = false;
        }
    };

})(app, $, app.$dom, app.utils);
