(function(app, $, $dom, _){

    app.define("pages.home");

    app.pages.home = {

        init: function(){

            WD.render();
        },

        render: function(){

            if (!$("home-header").length){

                WD.navbar();

                WD.resources();

                WD.animation();

                WD.features();

                return;
            }

            WD.responsive();

            WD.slider.once("ready", function(){
                setTimeout(function(){
                    app.$dom.root.addClass("-show");

                    WD.navbar();

                    WD.resources();

                    WD.animation();

                    WD.features();

                }, 0);
            });

            WD.slider.once("changed", function(){
                app.$dom.root.addClass("-ready")
                .removeClass("-show");
            });

            WD.slider.render();
        },

        resources: function(){

            $("img[data-src]").each(function(){
                var $elem = $(this);
                if ($elem.is(":visible")){
                    var url = $elem.data("src");
                    _.onLoadImage(url, function(){
                        $elem.attr("src", url);
                    });
                }
            });

            var imagesLoaded = new app.plugins.imagesLoaded();

            imagesLoaded.load({
                timeout: 5000
            });
        },

        features: function(){
            if (!app.mounted) riot.mount("*");
            app.sections.promo.gold.render();
            app.sections.promo.premium.render();
        },

        animation: function(){
            if (!app.device.isMobile){
                var animateScroll = new app.plugins.scroll.animate({
                    container: app.$dom.body,
                    selector: "products-grid .grid__item, .product__wrapper.-line, promo-gold .row.top, promo-premium .row.top, promo-premium .top__line, promo-premium .stand__title, promo-premium .product",
                    delta: "s"
                })
                animateScroll.start();

                var scrollAnimation = new app.plugins.scroll.AnimationController({
                    container: app.$dom.body
                });

                scrollAnimation.start();
            }
        },

        responsive: function() {
            if (app.device.isPhone){
                var $header = $("home-header"),
                    $slider = $header.find(".slider"),
                    height = $header.find(".header__categories").outerHeight();

                $header.css("max-height", parseInt(app.sizes.height + height) + "px");
                $slider.css("max-height", app.sizes.height + "px");
            }
        },

        navbar: function(){
            var $navbar = $('.navbar'),
                scrolling = false,
        		previousTop = 0,
        		currentTop = 0,
        		scrollDelta = 10,
        		scrollOffset = 0;

            app.$dom.window.on('scroll', function(){
        		if (!scrolling){
        			scrolling = true;
        			_.raf(autoHideHeader);
        		}
        	});

            function autoHideHeader(){
        		var currentTop = app.$dom.window.scrollTop();

        		checkSimpleNavigation(currentTop);

        	   	previousTop = currentTop;
        		scrolling = false;
        	}

        	function checkSimpleNavigation(currentTop) {
        	    if (previousTop - currentTop > scrollDelta) {
        	    	$navbar.attr('data-hidden', false);
        	    }
                else if (currentTop - previousTop > scrollDelta && currentTop > scrollOffset) {
        	    	$navbar.attr('data-hidden', true);
        	    }
                if (currentTop < 1) {
                    $navbar.addClass('-top');
                }
                else {
                    $navbar.removeClass('-top');
                }
        	}
        }
    };

    var WD = app.pages.home;

})(app, $, app.$dom, app.utils);
