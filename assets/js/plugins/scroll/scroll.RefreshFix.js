(function(app, $, $dom, _){

    app.define("plugins.scroll.refreshFix");

    app.plugins.scroll.refreshFix = function(scroll){

        if (!scroll) return;

        this.active = false;
        this.scroll = _.isElement(scroll) ? scroll : scroll[0];
        this.reset();
        this.init();
    };

    app.plugins.scroll.refreshFix.prototype = {

        init: function(){
            if (this.active) return;

            this.scroll.addEventListener('touchstart', this.touchstartHandler.bind(this), false);
            this.scroll.addEventListener('touchmove', this.touchmoveHandler.bind(this), false);

            this.active = true;
        },

        touchstartHandler: function(e) {
            if (e.touches.length != 1) return;
            this.lastTouchY = e.touches[0].clientY;
            // Pull-to-refresh will only trigger if the scroll begins when the
            // document's Y offset is zero.
            this.maybePreventPullToRefresh = window.pageYOffset == 0;
        },

        touchmoveHandler: function(e) {
            var touchY = e.touches[0].clientY,
                touchYDelta = touchY - this.lastTouchY;

            this.lastTouchY = touchY;

            if (this.maybePreventPullToRefresh) {
                // To suppress pull-to-refresh it is sufficient to preventDefault the
                // first overscrolling touchmove.
                this.maybePreventPullToRefresh = false;
                if (touchYDelta > 0) {
                    e.preventDefault();
                    return;
                }
            }
        },

        reset: function(){
            this.maybePreventPullToRefresh = false;
            this.lastTouchY = 0;
        },

        destroy: function(){
            if (!this.active) return;
            this.scroll.removeEventListener('touchstart', this.touchstartHandler);
            this.scroll.removeEventListener('touchmove', this.touchmoveHandler);
            this.reset();
            this.active = false;
        }
    };

})(app, $, app.$dom, app.utils);
