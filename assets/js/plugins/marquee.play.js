(function(app, $, $dom, _){

    app.define("plugins.marquee.playScreens");

    app.plugins.marquee.playScreens = function(parent, options){
        this.parent = parent;
        this.options = options || {};
        this.options.duration = this.options.duration || 800;
        this.options.interval = this.options.interval || 3.33;
        this.options.pause = this.options.pause || 5;
        this.options.round = this.options.round || false;
        this.options.ease = IScroll.utils.ease.cubicOut;
        this.interval = null;
        this.timeout = null;
    };

    app.plugins.marquee.playScreens.prototype = {
        init: function(){
            var _this = this;

            if (this.options.run !== undefined){
                if (this.options.run === true){
                    this.run();
                }
                else if (_.isNumber(this.options.run)) {
                    setTimeout(function(){
                        _this.run();
                    }, this.options.run * 1000);
                }
            }

            this.parent.scope.on("click.play", function(){
                _this.pause();
            });
        },
        run: function(force){
            var _this = this;

            if (force) _this.rotate();

            this.interval = setInterval(function(){
                _this.rotate();
            }, this.options.interval * 1000);
        },
        rotate: function(){
            var index = this.parent.marquee.index,
                counts = this.parent.items.length,
                newIndex = index + 2 > counts ? 0 : index + 1;

            if (counts < 2) return;

            if (newIndex == 0 && this.options.round){
                var $firstElem = this.parent.scope.find(this.parent.options.screens + ":first").children(),
                    firstImage = $firstElem.css("backgroundImage"),
                    $lastElem = this.parent.scope.find(this.parent.options.screens + ":last").children(),
                    lastImage = $lastElem.css("backgroundImage");

                $firstElem.css("backgroundImage", lastImage);
                $lastElem.css("backgroundImage", firstImage);
                this.parent.marquee.scrollTo(0, 0);
                this.parent.marquee.scrollTo(1, this.options.duration, this.options.ease);
            }
            else {
                this.parent.marquee.scrollTo(newIndex, this.options.duration, this.options.ease);
            }
        },
        pause: function(){
            var _this = this;

            this.clear();
            this.timeout = setTimeout(function(){
                _this.rotate();
                _this.run();
            }, this.options.pause * 1000);
        },
        stop: function(){
            this.clear();
        },
        clear: function(){
            clearInterval(this.interval);
            clearTimeout(this.timeout);
        },
        destroy: function(){
            this.clear();
            this.parent.scope.off("click.play");
        }
    };

})(app, $, app.$dom, app.utils);
