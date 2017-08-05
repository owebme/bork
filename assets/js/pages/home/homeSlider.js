(function(app, $, $dom, _){

    app.define("pages.home.slider");

    app.pages.home.slider = {

        render: function(){

            var player = app.$dom.root.find("section-player");

            if (player.length){
                WD.player = player[0] && player[0]._tag;
            }

            WD.header();
        },

        header: function(){
            var header = {};
            header.el = $("home-header");
            header.slider = header.el.find(".slider");
            header.slides = header.slider.find(".slider__items");
            header.nav = header.slider.find(".slider__nav");
            header.nav.arrowLeft = header.nav.find(".slider__nav__arrow__left");
            header.nav.arrowRight = header.nav.find(".slider__nav__arrow__right");
            header.nav.pagination = header.nav.find(".slider__pagination"),
            header.nav.progress = header.nav.pagination.find(".slider__pagination__progress"),
            header.nav.progress.circle = header.nav.progress.find("circle"),
            header.nav.progress.counter = null;

            this.entities = header;

            var num = app.device.isPhone ? "2" : "0",
                $slide = header.slider.find(".slider__item:eq(" + num + ")"),
                i = 0;

            if (app.device.isPhone){
                WD.init($slide);
            }
            else {
                $slide.find("img").each(function(){
                    var $elem = $(this),
                        url = $elem.attr("src") || $elem.attr("srcset");

                    _.onLoadImage(url, function(){
                        i++;
                        if (i == 2){
                            WD.init($slide);
                        }
                    });
                });
            }
        },

        init: function($slide){
            if (this.start || !$slide) return;

            this.start = true;

            WD.trigger("ready");

            WD.change($slide);

            WD.nav();
        },

        nav: function(){
            var header = this.entities;

            header.nav.arrowRight.on("click", function(){
                var $slide = header.slider.find(".slider__item.-active").next();
                WD.change($slide.length ? $slide : header.slider.find(".slider__item:first"));
            });

            header.nav.arrowLeft.on("click", function(){
                var $slide = header.slider.find(".slider__item.-active").prev();
                WD.change($slide.length ? $slide : header.slider.find(".slider__item:last"));
            });

            header.nav.pagination.on("click", ".slider__pagination__item", function(e){
                var $item = $(e.currentTarget);
                WD.change(header.slides.find(".slider__item:eq(" + $item.index() + ")"));
            });

            header.slider.on("mouseenter mouseleave", ".slider__options, .slider__play, .slider__basket, .slider__content .slider__options__item", function(e){
                // if (e.type === "mouseenter"){
                //     WD.progressHandler.stop();
                // }
                // else {
                //     WD.progressHandler.start();
                // }
            });

            header.slides.on("click", ".slider__play, .slider__content__xs .title", function(e){
                var video = $(e.currentTarget).data("video");
                if (video && WD.player) WD.player.show(video);
            });
        },

        change: function($nextSlide){
            if (this.loading) return;
            this.loading = true;

            this.callback = null;

            var self = this,
                header = this.entities,
                $activeSlide = header.slider.find(".slider__item.-active"),
                $pagItem = header.nav.pagination.find(".slider__pagination__item:eq(" + $nextSlide.index() + ")"),
                index = $nextSlide.index(),
                pagHeight = $pagItem.height();

            self.progressHandler.stop(0);

            if (app.sizes.viewport !== "small"){
                header.nav.progress.circle.css("transition", "all 1.5s ease");
                header.slider.addClass("-loading");
            }

            $activeSlide.removeClass("-ready");
            $nextSlide.addClass("-active -currentSlide");

            header.nav.progress.css("transform", "translateY(" + (pagHeight * index) + "px) translateZ(0)");

            $pagItem
            .addClass("-active")
            .siblings()
            .removeClass("-active");

            if (app.sizes.viewport === "small"){
                $activeSlide.removeClass("-active");
                $nextSlide.addClass("-ready");

                $afterlag.run(function(){
                    $nextSlide.removeClass("-currentSlide");
                    self.trigger("changed");
                    self.loading = false;
                    self.ready = true;
                }, {
                    delay: self.ready ? 900 : 2200,
                    timeout: self.ready ? 900 : 2200
                });
            }
            else {

                self.cnt = new Date().getTime();

                (function(cnt){
                    $afterlag.run(function(){
                        if (cnt !== self.cnt) return;

                        header.nav.progress.circle.css("transition", "");

                        $activeSlide.removeClass("-active");
                        $nextSlide.addClass("-ready")
                        .removeClass("-currentSlide");

                        $afterlag.run(function(){
                            if (cnt !== self.cnt) return;

                            header.slider.removeClass("-loading");
                            $afterlag.m(function(){
                                if (cnt !== self.cnt) return;

                                self.callback = function(){
                                    $afterlag.s(function(){
                                        if (cnt !== self.cnt) return;

                                        var $slide = header.slider.find(".slider__item.-active").next();
                                        self.change($slide.length ? $slide : header.slider.find(".slider__item:first"));
                                    });
                                };

                                //self.progressHandler.start(0);
                            });

                            self.trigger("changed");

                            self.loading = false;
                            self.ready = true;
                        }, {
                            delay: 1500,
                            timeout: 2000
                        });
                    }, {
                        delay: 800,
                        timeout: 1000
                    });
                })(self.cnt);
            }
        },

        progress: 0,

        progressHandler: {

            start: function(value){
                var self = this;

                WD.progress = value !== undefined ? value : WD.progress;

                this.stop();

                WD.entities.nav.progress.counter = setInterval(function(){
                    (function _counter(){
                        WD.raf = _.raf(_counter);
                    })();
                    self.iteration(WD.progress, WD.callback);
                    WD.progress++;
                }, 75);
            },

            stop: function(value){
                var header = WD.entities;
                if (value !== undefined){
                    this.iteration(value);
                }
                if (WD.raf) _.caf(WD.raf);
                clearInterval(header.nav.progress.counter);
            },

            iteration: function(value, callback){
                var header = WD.entities,
                    $elem = header.nav.progress.circle,
                    value = value !== undefined ? value : WD.progress,
                    counter = header.nav.progress.counter,
                    callback = callback || WD.callback;

                var r = $elem.attr('r');
                var c = Math.PI * (r * 2);

                if (value < 0) {value = 0;}
                if (value > 100) {value = 100;}

                var pct = ((100 - value) / 100) * c;

                $elem.css({strokeDashoffset: pct});

                if (value === 100){
                    WD.progressHandler.stop();
                    $elem.css({
                        "transition": "all 2s ease 0.5s",
                        strokeDashoffset: $elem.attr("stroke-dasharray")
                    });
                    if (callback && typeof callback === "function") callback();
                }
            }
        }
    };

    _.extend(app.pages.home.slider, new app.commons.EventEmitterMicro());

    var WD = app.pages.home.slider;

})(app, $, app.$dom, app.utils);
