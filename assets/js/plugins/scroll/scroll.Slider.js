(function(app, $, $dom, _){

    app.define("plugins.scroll.slider");

    app.plugins.scroll.slider = function(scope, options){
        if (!scope) return;

        this.active = false;
        this.scope = $(scope);
        this.options = options;
        this.index = 0;
		this.prevIndex = 0;
        this.prevSlide = null;
        this.currentSlide = null;
		this.scrolling = false;
        this.slides = [];
    };

    app.plugins.scroll.slider.prototype = {

        init: function(slide){
            var _this = this;

            if (this.active || !this.scope.length || !this.options.items) return;

            var options = {
                navbar: {
                    el: ".section__slider__navbar",
                    align: "right",
                    pos: "top"
                },
                container: ".section__slider__container",
                slide: ".section__slider__item",
                slideId: "_id",
                select: ".section__slider__navbar__select",
                dataSlide: "data-slide",
                dataItem: "data-item",
                hideSlides: true
            }
            if (this.options) _.extend(options, this.options);

            this.options = options;
            this.navbar = this.scope.find(options.navbar.el);
            this.container = this.scope.find(options.container);

            this.title = $('<span class="section__slider__navbar__title">')
            .appendTo(this.navbar);

            this.navbar.attr({
                "data-select": true,
                "data-align": options.navbar.align,
                "data-pos": options.navbar.pos
            });

            this.container.find(options.slide).each(function(i){
                var $item = $$(this);
                $item.attr(options.dataItem, i + 1);

                if (options.scroll){
                    _this.slides.push({
                        index: i,
                        id: options.items[i][options.slideId],
                        title: options.items[i].title,
                        el: $item,
                        scroll: new app.plugins.scroll.content($item, {
                            autoScroll: true
                        })
                    });
                    _this.slides[i].scroll.init();
                }
                if (options.hideSlides && i > 0){
                    $item.css("display", "none");
                }
            });

            if (app.plugins.eventsEmitter) app.plugins.eventsEmitter.init(this);

            this.select = $('<select class="section__slider__navbar__select">');

            _.each(this.slides, function(item){
                _this.select.append('<option value="' + item.id + '">' + item.title + '</option>');
            });

            this.navbar.append(this.select);
            this.onSelect();

            this.nav(slide !== undefined ? slide : this.slides[0].id);

            this.active = true;
        },

        onSelect: function(){
            var _this = this;

            this.select.on("change", function(e){
                _this.nav(e.currentTarget.value);
            });
        },

        nav: function(id){
            var _this = this,
                slide = _.findWhere(this.slides, {"id": id});

            if (slide){
                this.title[0].innerHTML = slide.title;
                this.container[0].setAttribute(this.options.dataSlide, slide.index + 1);
                this.trigger("change", id, slide.title);

                this.scrolling = true;
                this.prevIndex = this.index;
                this.prevSlide = this.currentSlide;
                this.index = slide.index;
                this.currentSlide = slide;

                if (this.options.hideSlides){
                    slide.el.css("display", "block");

                    if (this.prevSlide){
                        _.onEndTransition(this.container[0], function(){
                            _this.prevSlide.el.css("display", "none");
                            _this.refresh();
                        });
                    }
                }
            }
        },

        refresh: function(){
            if (this.options.scroll){
                _.each(this.slides, function(item){
                    item.scroll.refresh();
                });
            }
        },

        destroy: function(){
            if (this.navbar){
                this.navbar.empty();
            }
            if (this.options.scroll){
                _.each(this.slides, function(item){
                    item.scroll.destroy();
                });
            }
            this.destroyEvents();
            this.active = false;
        }
    };

})(app, $, app.$dom, app.utils);
