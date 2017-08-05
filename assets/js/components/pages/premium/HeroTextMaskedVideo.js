(function(app, $, $dom, _){

    var device = app.device,
        sizes = app.sizes,
        dom = app.dom,
        math = app.math,
        prefixed = app.prefixed;

    var options = {
        width: "1280",
        height: "248",
        timeout: {
            scroll: 1000 / 4,
            refresh: 1000 / 24
        }
    };

    var selectors = {
        headline: "hero__headline",
        content: "hero__content",
        textMask: "text__mask",
        l: "text__mask__screen",
        n: "text__mask__canvas__background",
        o: "text__mask__svg",
        h: "text__mask__svg__path",
        g: "text__mask__svg__content"
    };

    app.component.register("HeroTextMaskedVideo", {
        init: function(){
            this.heroVideo = this.section.getComponentByName("HeroBackgroundVideo").video;
            this.textElement = this.element.querySelector("." + selectors.textMask);
            this.textElementOffsetTop = dom.getPagePosition(this.textElement).top;
            this.text = this.textElement.innerHTML;
            this.svgTextMask = this.createSvgTextMask();
            this.yScrollMax = this.getParallaxScrollMax();
            this.heroVideo.style.display = "none";
            this.rafWhenVisible = true;
            this.isPlaying = false;
        },

        setupEvents: function(){
            this.onCanPlayThrough = this.onCanPlayThrough.bind(this);
            this.heroVideo.addEventListener("canplaythrough", this.onCanPlayThrough);
        },

        onCanPlayThrough: function() {
            if (this.isPlaying) {
                return
            }
            this.isPlaying = true;
            this.heroVideo.style.display = "block";
            this.element.style.display = "block";
            this.textBackgroundCanvasElement = this.createBackgroundCanvas();
            this.textBackgroundCanvasContext = this.textBackgroundCanvasElement.getContext("2d");
            this.updateBackgroundCanvasSize();
            this.textBackgroundScreenElement = this.createScreenLayer();
            this.injectMaskedText();
            this.fadeInMaskedText();
        },

        fadeInMaskedText: function(){
            setTimeout(function(){
                RAF(function(){
                    this.element.classList.add("-show");
                }.bind(this));
            }.bind(this), 200);
        },

        createBackgroundCanvas: function() {
            var y = document.createElement("canvas");

            y.width = "" + options.width;
            y.height = "" + options.height;
            y.style.width = y.width + "px";
            y.style.height = y.height + "px";
            y.classList.add(selectors.n);
            return y
        },

        createSvgTextMask: function() {
            var z = "http://www.w3.org/2000/svg";
            var y = document.createElementNS(z, "svg");
            y.classList.add(selectors.o);
            var A = document.createElementNS(z, "clipPath");
            A.setAttribute("id", selectors.h);
            var B = document.createElementNS(z, "text");
            B.classList.add(selectors.g);
            B.setAttribute("x", "50%");
            B.setAttribute("y", "50%");
            B.textContent = this.text;
            A.appendChild(B);
            y.appendChild(A);
            return y
        },

        createScreenLayer: function(){
            var y = document.createElement("div");
            y.classList.add(selectors.l);
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
            this.textElementOffsetTop = dom.getPagePosition(this.element).top;
            this.textBackgroundCanvasElement.style.width = this.heroVideo.clientWidth + "px";
        },

        getParallaxScrollMax: function() {
            return this.element.clientHeight;
        },

        onRequestAnimationFrame: function() {
            if (this.scrollTimer && ((new Date()) - this.scrollTimer) < options.timeout.scroll) {
                return
            }
            if (this.lastDrawDate && ((new Date()) - this.lastDrawDate) < options.timeout.refresh) {
                return
            }
            this.lastDrawDate = new Date();
            var A = parseInt(options.width);
            var D = parseInt(options.height);
            var E = 0;
            var C = this.textElementOffsetTop * (app.sizes.width > options.width ? options.width / app.sizes.width : 1);
            var z = 0;
            var y = 0;
            var B = parseInt(options.width);
            var F = parseInt(options.height * (app.sizes.width > options.width ? app.sizes.width / options.width : 1));

            if (this.textBackgroundCanvasElement) {
                this.textBackgroundCanvasContext.drawImage(this.heroVideo, E, C, A, D, z, y, B, F)
            }
        },
        onResizeDebounced: function(e, scrollTop) {
            this.yScrollMax = this.getParallaxScrollMax();
            this.updateBackgroundCanvasSize();
        },
        onBreakpoint: function(value) {
            this.currentBreakpoint = value;
        }
    },
    function(){
        var html = document.getElementsByTagName("html")[0];
        var addTests = function(){
            if (!device.isMobile){
                if (device.isSafari && _.isArray(device.browser.version) && device.browser.version[0] < 10) {
                    return false
                }
                if (device.isChrome || device.isSafari && device.isMac) {
                    return true
                }
            }
            return false
        }
        if (addTests()){
            return true;
        }
        else {
            html.classList.add("no-svg-clip-path");
            return false;
        }
    });

})(app, $, app.$dom, app.utils);
