(function(app, $, $dom, _){

    var device = app.device,
        sizes = app.sizes,
        dom = app.dom,
        math = app.math,
        prefixed = app.prefixed;

    var selectors = {
        overlay: "hero__overlay",
        content: "hero__content"
    };

    app.component.register("HeroScrollAnimation", {
        init: function(){
            this.heroOverlay = this.element.querySelector("." + selectors.overlay);
            this.heroContent = this.element.querySelector("." + selectors.content);
            this.yScrollMax = this.getParallaxScrollMax();
            this.parallaxDistance = {
                small: 100,
                medium: 200,
                large: 300,
                xlarge: 300
            };
            this.rafWhenVisible = true;
            this.heroScrollProgress = 0;
        },

        getParallaxScrollMax: function() {
            return this.element.clientHeight;
        },

        onScroll: function(e, scrollTop) {
            this.heroScrollProgress = math.mapClamp(scrollTop, 0, this.yScrollMax, 0, 1)
        },
        onRequestAnimationFrame: function() {
            var l = this.parallaxDistance[this.currentBreakpoint];
            this.heroOverlay.style.opacity = this.heroScrollProgress;
            this.heroContent.style[prefixed.transform] = "translate3d(0, " + Math.floor(this.heroScrollProgress * l) + "px, 0)";
        },
        onResizeDebounced: function(e, scrollTop) {
            this.yScrollMax = this.getParallaxScrollMax();
        },
        onBreakpoint: function(value) {
            this.currentBreakpoint = value;
        }
    },
    function(){
        return !device.isMobile && !device.isSafari;
    });

})(app, $, app.$dom, app.utils);
