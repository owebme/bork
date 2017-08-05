(function(app, $, $dom, _){

    app.define("plugins.sliderElastic");

    app.plugins.sliderElastic = function(scope, options){
        if (!scope) return;

        this.active = false;
        this.scope = $(scope);
        this.options = options;
        this.initX = null;
        this.transX = 0;
        this.deltaY = 0;
        this.rotZ = 0;
        this.transY = 0;
        this.prevSlide = null;
        this.curSlide = null;
        this.isScrolling = false;
        this.slides = null;
    };

    app.plugins.sliderElastic.prototype = {

        init: function(){
            var _this = this;

            if (this.active || !this.scope.length) return;

            var options = {
                fadeOut: 'ease 0.2s',
                Y_DIS: "-50%",
                Z_DIS: 50,
                TRANS_DUR: 0.4
            }
            if (this.options) _.extend(options, this.options);

            this.options = options;

            this.container = this.scope.children();

            this.container.on('touchmove MSPointerMove', "img", function(e){
        		e.preventDefault();
        	});

            this.container.on('dragstart selectstart', "img", function() {
                return false;
            });

            this.slides = this.container[0].children;

            this.attachEvents(this.slides[this.slides.length - 1]);

            this.active = true;

        },

        attachEvents: function(elem){
            this.curSlide = elem;

            this.curSlide.addEventListener(app.device.support.touch ? 'touchstart' : 'mousedown', this.slideMouseDown.bind(this), false);
        },

        slideMouseDown: function(e){
            if (e.touches) {
                this.initX = e.touches[0].clientX;
            }
            else {
                this.initX = e.pageX;
            }

            this.scope[0].addEventListener(app.device.support.touch ? 'touchmove' : 'mousemove', this.slideMouseMove.bind(this), false);

            this.scope[0].addEventListener(app.device.support.touch ? 'touchend' : 'mouseup', this.slideMouseUp.bind(this), false);
        },

        slideMouseMove: function(e){
            var _this = this,
                mouseX;

            if (this.isScrolling) return;

            if (e.touches) {
                mouseX = e.touches[0].clientX;
            }
            else {
                mouseX = e.pageX;
            }

            this.transX += mouseX - this.initX;
            this.rotZ = this.transX / 20;

            this.curSlide.style.transition = 'none';
            this.curSlide.style.webkitTransform = 'translateX(' + this.transX + 'px)' + ' rotateZ(' + this.rotZ + 'deg)' + ' translateY(' + this.options.Y_DIS + ') translateZ(0)';
            this.curSlide.style.transform = 'translateX(' + this.transX + 'px)' + ' rotateZ(' + this.rotZ + 'deg)' + ' translateY(' + this.options.Y_DIS + ') translateZ(0)';

            var j = 1;

            //remains elements
            for (var i = this.slides.length -2; i >= 0; i--) {
                this.slides[i].style.webkitTransform = 'translateX(' + this.transX/(2*j) + 'px)' + ' rotateZ(' + this.rotZ/(2*j) + 'deg)' + ' translateY(' + this.options.Y_DIS + ')'+ ' translateZ(' + (-this.options.Z_DIS*j) + 'px) translateZ(0)';
                this.slides[i].style.transform = 'translateX(' + this.transX/(2*j) + 'px)' + ' rotateZ(' + this.rotZ/(2*j) + 'deg)' + ' translateY(' + this.options.Y_DIS + ')'+ ' translateZ(' + (-this.options.Z_DIS*j) + 'px) translateZ(0)';
                this.slides[i].style.transition = 'none';
                j++;
            }

            this.initX = mouseX;
            e.preventDefault();

            if (Math.abs(this.transX) >= this.curSlide.offsetWidth-30) {

                this.scope[0].removeEventListener(app.device.support.touch ? 'touchmove' : 'mousemove', this.slideMouseMove, false);

                this.curSlide.style.transition = this.options.fadeOut;
                this.curSlide.style.opacity = 0;
                this.prevSlide = this.curSlide;

                this.attachEvents(this.slides[this.slides.length - 2]);

                this.slideMouseUp();

                setTimeout(function(){
                    _this.container[0].insertBefore(_this.prevSlide, _this.container[0].firstChild);

                    _this.prevSlide.style.transition = 'none';
                    _this.prevSlide.style.opacity = '1';
                    _this.slideMouseUp();
                }, 201);

                return;
             }
        },

        slideMouseUp: function(){
            this.transX = 0;
            this.rotZ = 0;

            this.curSlide.style.transition = 'cubic-bezier(0.075, 0.82, 0.165, 1) '+this.options.TRANS_DUR+'s';

            this.curSlide.style.webkitTransform = 'translateX(' + this.transX + 'px)' + 'rotateZ(' + this.rotZ + 'deg)' + ' translateY(' + this.options.Y_DIS + ') translateZ(0)';
            this.curSlide.style.transform = 'translateX(' + this.transX + 'px)' + 'rotateZ(' + this.rotZ + 'deg)' + ' translateY(' + this.options.Y_DIS + ') translateZ(0)';

            var j = 1;

            //remains elements
            for (var i = this.slides.length -  2; i >= 0; i--) {
                this.slides[i].style.transition = 'cubic-bezier(0.075, 0.82, 0.165, 1) ' + this.options.TRANS_DUR / (j + 0.9) + 's';
                this.slides[i].style.webkitTransform = 'translateX(' + this.transX + 'px)' + 'rotateZ(' + this.rotZ + 'deg)' + ' translateY(' + this.options.Y_DIS + ')' + ' translateZ(' + (-this.options.Z_DIS*j) + 'px)';
                this.slides[i].style.transform = 'translateX(' + this.transX + 'px)' + 'rotateZ(' + this.rotZ + 'deg)' + ' translateY(' + this.options.Y_DIS + ')' + ' translateZ(' + (-this.options.Z_DIS*j) + 'px)';
                j++;
            }

            this.scope[0].removeEventListener(app.device.support.touch ? 'touchmove' : 'mousemove', this.slideMouseMove, false);
        }
    };

})(app, $, app.$dom, app.utils);
