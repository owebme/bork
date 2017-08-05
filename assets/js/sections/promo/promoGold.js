(function(app, $, $dom, _){

    app.define("sections.promo.gold");

    app.sections.promo.gold = {

        render: function(){

            WD.el = $("promo-gold");

            if (!WD.el.length) return;

            if (!app.device.isMobile) WD.parallax();

            //WD.video();
        },

        parallax: function(){
            var parallax = new app.plugins.scroll.parallaxLite({
                    container: WD.el,
                    items: WD.items
                });

            parallax.start();

            WD.el.find(".-parallax-smooth").each(function(){
                var parallaxSmooth = new app.plugins.scroll.ParallaxController({
                    items: [
                        {
                            elem: this,
                            from: parseInt(this.getAttribute("data-from")),
                            to: parseInt(this.getAttribute("data-to")),
                            off: 0
                        }
                    ]
                });
                parallaxSmooth.start();
            });
        },

        video: function(){

            WD.el.find(".video").each(function(){
                $(this).replaceWith('<iframe class="video" type="text/html" src="https://www.youtube.com/embed/' + this.getAttribute('data-video') +  '?autoplay=1&color=white&controls=0&showinfo=0&mute=1&vq=hd720" frameborder="0" allowfullscreen/>');
            });
        },

        items: [
            {
                selector: ".top__title__parallax",
                options: {
                    oy: {
                        direction: "up"
                    },
                    speed: 0.6
                }
            },
            {
                selector: ".slider__parallax[data-pos='left'] .slider__parallax__image.-front",
                options: {
                    clip: {
                        direction: "right"
                    },
                    speed: 0.833
                }
            },
            {
                selector: ".slider__parallax[data-pos='right'] .slider__parallax__image.-front",
                options: {
                    clip: {
                        direction: "down"
                    },
                    speed: 0.833
                }
            },
            {
                selector: ".layer.orange-left",
                options: {
                    oy: {
                        direction: "up"
                    },
                    ox: {
                        direction: "right"
                    },
                    rotate: {
                        deg: 270
                    },
                    speed: 0.833
                }
            },
            {
                selector: ".layer.orange-right",
                options: {
                    oy: {
                        direction: "down",
                        speed: 1.5
                    },
                    ox: {
                        direction: "left",
                        speed: 1.7
                    },
                    rotate: {
                        deg: 270
                    },
                    speed: 0.833
                }
            },
            {
                selector: ".layer.orange-bottom",
                options: {
                    ox: {
                        direction: "right"
                    },
                    rotate: {
                        deg: 180
                    },
                    speed: 0.833
                }
            }
        ]
    };

    var WD = app.sections.promo.gold;

})(app, $, app.$dom, app.utils);
