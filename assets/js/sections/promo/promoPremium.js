(function(app, $, $dom, _){

    app.define("sections.promo.premium");

    app.sections.promo.premium = {

        render: function(){

            WD.el = $("promo-premium");

            if (!WD.el.length) return;

            if (!app.device.isMobile) WD.parallax();
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

        items: [
            {
                selector: ".top__title__parallax",
                options: {
                    oy: {
                        direction: "up"
                    },
                    speed: 0.3
                }
            }
        ]
    };

    var WD = app.sections.promo.premium;

})(app, $, app.$dom, app.utils);
