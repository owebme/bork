(function(app, $, $dom, _){

    app.define("pages.premium");

    app.pages.premium = {

        options: {
            width: "1280",
            height: "248",
            timeout: {
                scroll: 1000 / 4,
                refresh: 1000 / 24
            }
        },

        selectors: {
            m: "hero",
            v: "hero__video",
            b: "hero__video__container",
            t: "hero__headline",
            y: "hero__overlay",
            c: "hero__content",
            a: "text__mask",
            l: "text__mask__screen",
            n: "text__mask__canvas__background",
            o: "text__mask__svg",
            h: "text__mask__svg__path",
            g: "text__mask__svg__content"
        },

        init: function(){

            if (!$("premium-products").length) return;

            this.element = document.querySelector("." + WD.selectors.m);
            this.textElement = this.element.querySelector("." + WD.selectors.a);
            this.textElementOffsetTop = app.dom.getPagePosition(this.textElement).top;
            this.text = this.textElement.innerHTML;
            this.svgTextMask = this.createSvgTextMask();
            this.heroBackgroundVideo = this.element.querySelector("." + WD.selectors.v);
            this.heroContainerVideo = this.element.querySelector("." + WD.selectors.b);
            this.heroContentElement = this.element.querySelector("." + WD.selectors.c);
            this.heroOverlay = this.element.querySelector("." + WD.selectors.y);
            this.heroHeadline = this.element.querySelector("." + WD.selectors.t);
            this.yScrollMax = this.getParallaxScrollMax();
            this.heroBackgroundVideo.style.display = "none";
            this.eventResize = app.device.isMobile ? 'orientationchange' : 'resize';
            this.parallaxDistance = {
                small: 100,
                medium: 200,
                large: 300,
                xlarge: 300
            };
            this.heroScrollProgress = 0;

            WD.render();
        },

        render: function(){
            this.isPlaying = false;
            this.onCanPlayThrough = this.onCanPlayThrough.bind(this);
            this.heroBackgroundVideo.addEventListener("canplaythrough", WD.onCanPlayThrough);

            (function _raf(){
                WD.raf = _.raf(_raf);
                WD.onRequestAnimationFrame();
            })();

            _.onLoadImage(_.getBgImage(this.heroContainerVideo), function(){
                WD.heroBackgroundVideo.loop = true;
                WD.heroBackgroundVideo.play();
                WD.onScroll();
                setTimeout(function(){
                    WD.heroContainerVideo.setAttribute("data-play", true);
                }, 300);
                $afterlag.s(function(){
                    WD.heroHeadline.classList.add("-show");
                });
                WD.resize();
            });
        },

        resize: function(){
            var resize = _.debounce(this.updateBackgroundCanvasSize, 250);

            $dom.window.on(this.eventResize + '.resize', function(){
                resize();
            });
        },

        getParallaxScrollMax: function() {
            return this.element.clientHeight;
        },

        onScroll: function() {
            app.$dom.window.on("scroll", function(){
                WD.scrollTimer = new Date();
                WD.heroScrollProgress = WD.mapClamp(app.$dom.document.scrollTop(), 0, WD.yScrollMax, 0, 1);
            });
        },

        createBackgroundCanvas: function() {
            var y = document.createElement("canvas");

            y.width = "" + WD.options.width;
            y.height = "" + WD.options.height;
            y.style.width = y.width + "px";
            y.style.height = y.height + "px";
            y.classList.add(WD.selectors.n);
            return y
        },

        onCanPlayThrough: function() {
            if (this.isPlaying) {
                return
            }
            this.isPlaying = true;
            this.heroBackgroundVideo.style.display = "block";
            this.textBackgroundCanvasElement = WD.createBackgroundCanvas();
            this.textBackgroundCanvasContext = this.textBackgroundCanvasElement.getContext("2d");
            this.updateBackgroundCanvasSize();
            this.textBackgroundScreenElement = this.createScreenLayer();
            this.injectMaskedText();
        },

        createSvgTextMask: function() {
            var z = "http://www.w3.org/2000/svg";
            var y = document.createElementNS(z, "svg");
            y.classList.add(WD.selectors.o);
            var A = document.createElementNS(z, "clipPath");
            A.setAttribute("id", WD.selectors.h);
            var B = document.createElementNS(z, "text");
            B.classList.add(WD.selectors.g);
            B.setAttribute("x", "50%");
            B.setAttribute("y", "50%");
            B.textContent = this.text;
            A.appendChild(B);
            y.appendChild(A);
            return y
        },

        createScreenLayer: function(){
            var y = document.createElement("div");
            y.classList.add(WD.selectors.l);
            return y
        },

        injectMaskedText: function() {
            this.textElement.innerHTML = "";
            this.textElement.setAttribute("aria-label", this.text);
            this.textElement.insertBefore(this.textBackgroundCanvasElement, this.textElement.firstChild);
            this.textElement.insertBefore(this.textBackgroundScreenElement, this.textElement.firstChild);
            this.textElement.appendChild(this.svgTextMask);
        },

        updateBackgroundCanvasSize: function() {
            WD.textElementOffsetTop = app.dom.getPagePosition(WD.heroHeadline).top;
            WD.textBackgroundCanvasElement.style.width = app.sizes.width + "px";
            WD.textBackgroundCanvasElement.style.height = WD.options.height + "px";
            WD.yScrollMax = WD.getParallaxScrollMax();
        },

        onRequestAnimationFrame: function() {
            var l = this.parallaxDistance[app.sizes.viewport];
            this.heroOverlay.style.opacity = this.heroScrollProgress;
            this.heroContentElement.style[app.prefixed.transform] = "translate3d(0, " + Math.floor(this.heroScrollProgress * l) + "px, 0)";

            if (this.scrollTimer && ((new Date()) - this.scrollTimer) < this.options.timeout.scroll) {
                return
            }
            if (this.lastDrawDate && ((new Date()) - this.lastDrawDate) < this.options.timeout.refresh) {
                return
            }
            this.lastDrawDate = new Date();
            var A = parseInt(this.options.width);
            var D = parseInt(this.options.height);
            var E = 0;
            var C = this.textElementOffsetTop;
            var z = 0;
            var y = 0;
            var B = parseInt(this.options.width);
            var F = parseInt(this.options.height);

            if (this.textBackgroundCanvasElement) {
                this.textBackgroundCanvasContext.drawImage(this.heroBackgroundVideo, E, C, A, D, z, y, B, F)
            }
        },

        lerp: function(f, g, d) {
            return g + (d - g) * f
        },

        map: function(i, h, f, g, d) {
            return this.lerp(this.norm(i, h, f), g, d)
        },

        mapClamp: function(i, h, f, g, d) {
            var i = this.lerp(this.norm(i, h, f), g, d);
            return Math.max(g, Math.min(d, i))
        },

        norm: function(g, f, d) {
            return (g - f) / (d - f)
        },

        clamp: function(g, f, d) {
            return Math.max(f, Math.min(d, g))
        },

        randFloat: function(f, d) {
            return (Math.random() * (d - f)) + f
        },

        randInt: function(f, d) {
            return Math.floor((Math.random() * (d - f)) + f)
        }
    };

    var WD = app.pages.premium;

})(app, $, app.$dom, app.utils);
