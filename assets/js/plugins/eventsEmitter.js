(function(app, $, $dom, _){

    app.define("plugins.eventsEmitter");

    app.plugins.eventsEmitter = {

        init: function(data){
            _.extend(data, this.events);
        },

        events: {

            _events: {},

            on: function (type, fn) {
    			if ( !this._events[type] ) {
    				this._events[type] = [];
    			}

    			this._events[type].push(fn);
    		},

            once: function(g, j) {
                var i = this;

                function h(k) {
                    i.off(g, h);
                    if (k !== undefined) {
                        j(k);
                    } else {
                        j();
                    }
                }
                this.on(g, h);
            },

    		off: function (type, fn) {
    			if ( !this._events[type] ) {
    				return;
    			}

    			var index = this._events[type].indexOf(fn);

    			if ( index > -1 ) {
    				this._events[type].splice(index, 1);
    			}
    		},

    		trigger: function (type) {
    			if ( !this._events[type] ) {
    				return;
    			}

    			var i = 0,
    				l = this._events[type].length;

    			if ( !l ) {
    				return;
    			}

    			for ( ; i < l; i++ ) {
    				this._events[type][i].apply(this, [].slice.call(arguments, 1));
    			}
    		},

            destroyEvents: function(){
                var _this = this;

                _.each(this._events, function(fn, type){
                    delete _this._events[type];
                });
            }
        }
    };

})(app, $, app.$dom, app.utils);
