(function(app, $, $dom, _){

    app.define("plugins.scroll.fix");

    app.plugins.scroll.fix = function(options){

        if (!options || options && !options.scroll) return;

        this.active = false;
        this.scroll = $(options.scroll);
        this.container = $(options.container);
    };

    app.plugins.scroll.fix.prototype = {

        init: function(){
            var _this = this;

            if (this.active || app.device.isMobile) return;

            var timer, body = $dom.body[0];

    		this.scroll.on('scroll.fix', function(){
    			clearTimeout(timer);
    			if (!_this.container[0].getAttribute("class").match(/disable__hover/)){
    				_this.container.addClass('disable__hover');
    			}

    			timer = setTimeout(function(){
    				_this.container.removeClass('disable__hover')
    			}, 300);
    		});

            this.active = true;
        },

        destroy: function(){
            if (!this.active) return;
            this.scroll.off("scroll.fix");
            this.active = false;
        }
    };

})(app, $, app.$dom, app.utils);
