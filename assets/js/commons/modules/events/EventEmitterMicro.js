(function(app, $, $dom, _){

    app.define("commons.EventEmitterMicro");

    app.commons.EventEmitterMicro = function(){
        this._events = {};
    };

    app.commons.EventEmitterMicro.prototype = {
        on: function(g, h) {
            this._events[g] = this._events[g] || [];
            this._events[g].unshift(h)
        },
        once: function(g, j) {
            var i = this;

            function h(k) {
                i.off(g, h);
                if (k !== undefined) {
                    j(k)
                } else {
                    j()
                }
            }
            this.on(g, h)
        },
        off: function(g, i) {
            if (g in this._events === false) {
                return
            }
            var h = this._events[g].indexOf(i);
            if (h === -1) {
                return
            }
            this._events[g].splice(h, 1)
        },
        trigger: function(g, j) {
            if (g in this._events === false) {
                return
            }
            for (var h = this._events[g].length - 1; h >= 0; h--) {
                if (j !== undefined) {
                    this._events[g][h](j)
                } else {
                    this._events[g][h]()
                }
            }
        },
        destroy: function() {
            for (var g in this._events) {
                this._events[g] = null
            }
            this._events = null
        }
    };

})(app, $, app.$dom, app.utils);
