(function(app, $, $dom, _){

    app.define("plugins.slider");

    app.plugins.slider = function(scope, options){
        this.options = options || {};
        this.active = false;
        this.index = 0;
        this.scope = $(scope);
        this.wrapper = this.scope.find(".slider__wrapper");
        this.nav = {
            prev: this.scope.find(".slider__nav__prev"),
            next: this.scope.find(".slider__nav__next")
        };

        this.init();
    };

    app.plugins.slider.prototype = {

        init: function(){
            var _this = this;

            this.nav.next.on('click', function(){
        		_this.nextSlides();
        	});

        	this.nav.prev.on('click', function(){
        		_this.prevSlides();
        	});

            this.wrapper.on('swipeLeft', function(){
                if (!_this.nav.next.hasClass('slider__nav--hidden')){
                    _this.nextSlides();
                }
            });

            this.wrapper.on('swipeRight', function(){
                if (!_this.nav.prev.hasClass('slider__nav--hidden')){
                    _this.prevSlides();
                }
            });

            if (this.options.autoUpdate){
                this._autoUpdate();
            }

            this.render();
        },

        render: function(){
            var _this = this;

            if (this.reRender) return;

            this.reRender = true;
            this.sizeSlider = this.wrapper.width();
            this.firstSlide = this.wrapper.find(".slider__item:first");
            this.widthSlide = this.firstSlide.width();
            this.cnt = Math.floor((app.sizes.width < this.sizeSlider ? app.sizes.width : this.sizeSlider) / this.widthSlide);
            if (!this.cnt || app.device.isPhone) this.cnt = 1;

            if (this.cnt == 1 && !this.scope.hasClass("largeSlides")){
                this.scope.addClass("largeSlides")
            }

            this.navUpdate();
            this.firstSlide.addClass("current");

            this.reRender = false;
        },

        _autoUpdate: function(){
            var _this = this,
                wrapper = this.wrapper[0],
                countSlide = wrapper.childElementCount,
                counts = countSlide,
                dec;

            (function checkSize(){
                counts = wrapper.childElementCount;
                if ($.ready && countSlide !== counts){
                    dec = countSlide > counts ? true : false;
                    countSlide = counts;
                    if (dec && _this.index > 0){
                        _this.prevSlides();
                    }
                    else {
                        _this.navUpdate();
                    }
                }
                _.raf(checkSize);
            })();
        },

        show: function(callback){

            if (this.active) return;

            this.scope.addClass("showSlides");

            if (_.isFunction(callback)){
                _.onEndTransition(this.firstSlide[0], function(){
                    callback();
                });
            }

            this.active = true;
        },

        hide: function(callback){
            var _this = this;

            if (!this.active) {
                if (_.isFunction(callback)){
                    callback();
                }
                return;
            }

            this.reset();

            this.scope.addClass("hideSlides");

            _.onEndTransition(this.wrapper.find(".slider__item:first")[0], function(){
    			_this.scope.removeClass("showSlides hideSlides");
                _this.active = false;
                if (_.isFunction(callback)) callback();
    		});
        },

        reset: function(){

            this.setTranslateValue(0);

            this.wrapper.removeClass('next prev')
            .find('.current, .previous').removeClass("current previous");

            this.wrapper.find(".slider__item:first").addClass("current");

            this.navUpdate();
        },

        navUpdate: function(){
            this.sizeSlider = this.wrapper.width();

            var l = this.wrapper.find(".slider__item").length,
                max = parseInt(Math.floor(this.sizeSlider / this.wrapper.find(".slider__item").width()));

            if (this.cnt > 1 && l < max + 1 || this.cnt == 1 && l == "1"){
                this.nav.next.addClass('slider__nav--hidden');
            }
            else {
                this.nav.next.removeClass('slider__nav--hidden');
            }
            if (this.index == 0){
                this.nav.prev.addClass('slider__nav--hidden');
            }
        },

    	nextSlides: function() {

            this.scope.triggerHandler("next");

    		var _this = this,
                actual = this.wrapper.children('.current'),
    			index = actual.index(),
    			following = actual.nextAll('.slider__item').length;

                if (this.cnt == 1){
                    index = following ? index + this.cnt : index;
                }
                else {
                    index = (following > (this.cnt + 1)) ? index + this.cnt : index + following - (this.cnt - 1);
                }

            var translate = index * (this.widthSlide + 15) + 'px';

    		if (this.cnt > 1) this.wrapper.addClass('next');
    		this.setTranslateValue(translate);

            if (app.device.isPhone){
                _this.updateSlider('next', actual, following);
            }
            else {
                _.onEndTransition(this.wrapper[0], function(){
        			_this.updateSlider('next', actual, following);
        		});
            }

            this.index = index;
    	},

    	prevSlides: function() {

            this.scope.triggerHandler("prev");

    		var _this = this,
                actual = this.wrapper.children('.previous'),
    			index = actual.index(),
                translate = index * (this.widthSlide + 15) + 'px';

            if (this.cnt > 1) this.wrapper.addClass('prev');
    		this.setTranslateValue(translate);

            if (app.device.isPhone){
                _this.updateSlider('prev', actual);
            }
            else {
                _.onEndTransition(this.wrapper[0], function(){
        			_this.updateSlider('prev', actual);
        		});
            }

            this.index = index;
    	},

    	updateSlider: function(direction, actual, numerFollowing) {
    		if (direction === 'next'){

    			this.wrapper.removeClass('next')
                .find('.previous')
                .removeClass('previous');

    			actual.removeClass('current');

                if (this.cnt == 1){
                    actual.addClass('previous')
                    .next('.slider__item')
                    .addClass('current');
                }
                else if (this.cnt == 2){
                    if (numerFollowing > (this.cnt + 1)) {
        				actual.addClass('previous')
                        .next('.slider__item')
                        .next('.slider__item')
                        .addClass('current');
        			}
                    else if (numerFollowing == (this.cnt + 1)) {
        				actual.next('.slider__item')
                        .next('.slider__item')
                        .addClass('current')
                        .prev('.slider__item')
                        .addClass('previous');
        			}
                    else {
        				actual.next('.slider__item')
                        .addClass('current')
                        .end()
                        .addClass('previous');
        			}
                }
                else {
        			if (numerFollowing > (this.cnt + 1)) {
        				actual.addClass('previous')
                        .next('.slider__item')
                        .next('.slider__item')
                        .next('.slider__item')
                        .addClass('current');
        			}
                    else if (numerFollowing == (this.cnt + 1)) {
        				actual.next('.slider__item')
                        .next('.slider__item')
                        .addClass('current')
                        .prev('.slider__item')
                        .prev('.slider__item')
                        .addClass('previous');
        			}
                    else {
        				actual.next('.slider__item')
                        .addClass('current')
                        .end()
                        .addClass('previous');
        			}
                }

    		} else {

    			this.wrapper.removeClass('prev')
                .find('.current')
                .removeClass('current');

    			actual.removeClass('previous')
                .addClass('current');

                if (this.cnt == 1){
                    actual.prev('.slider__item')
                    .addClass('previous');
                }
                else if (this.cnt == 2){
                    if (actual.prevAll('.slider__item').length > (this.cnt - 1)) {
        				actual.prev('.slider__item')
                        .prev('.slider__item')
                        .addClass('previous');
        			}
                    else {
        				(!this.wrapper.children('.slider__item').eq(0).hasClass('current')) && this.wrapper.children('.slider__item').eq(0).addClass('previous');
        			}
                }
                else {
        			if (actual.prevAll('.slider__item').length > (this.cnt - 1)) {
        				actual.prev('.slider__item')
                        .prev('.slider__item')
                        .prev('.slider__item')
                        .addClass('previous');
        			}
                    else {
        				(!this.wrapper.children('.slider__item').eq(0).hasClass('current')) && this.wrapper.children('.slider__item').eq(0).addClass('previous');
        			}
                }
    		}

    		this.updateNavigation();
    	},

    	updateNavigation: function() {
    		var current = this.wrapper.find('.slider__item.current');
    		(current.is(':first-child')) ? this.nav.prev.addClass('slider__nav--hidden') : this.nav.prev.removeClass('slider__nav--hidden');
    		(current.nextAll('.slider__item').length < this.cnt) ? this.nav.next.addClass('slider__nav--hidden') : this.nav.next.removeClass('slider__nav--hidden');
    	},

    	setTranslateValue: function(translate) {
    		this.wrapper.css({
    		    '-moz-transform': 'translate3d(-' + translate + ', 0, 0)',
    		    '-webkit-transform': 'translate3d(-' + translate + ', 0, 0)',
    			'-ms-transform': 'translate3d(-' + translate + ', 0, 0)',
    			'-o-transform': 'translate3d(-' + translate + ', 0, 0)',
    			'transform': 'translate3d(-' + translate + ', 0, 0)',
    		});
    	}
    };

})(app, $, app.$dom, app.utils);
