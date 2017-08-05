(function(app, $, $dom, _){

    app.define("commons.EventEmitter");

    var n = "EventEmitter:propagation",
        r = function(t) {
            t && (this.context = t)
        },
        o = r.prototype,
        s = function() {
            return this.hasOwnProperty("_events") || "object" == typeof this._events || (this._events = {}), this._events
        },
        a = function(t, e) {
            var i = t[0],
                n = t[1],
                r = t[2];
            if ("string" != typeof i && "object" != typeof i || null === i || Array.isArray(i)) throw new TypeError("Expecting event name to be a string or object.");
            if ("string" == typeof i && !n) throw new Error("Expecting a callback function to be provided.");
            if (n && "function" != typeof n) {
                if ("object" != typeof i || "object" != typeof n) throw new TypeError("Expecting callback to be a function.");
                r = n
            }
            if ("object" == typeof i)
                for (var o in i) e.call(this, o, i[o], r);
            "string" == typeof i && (i = i.split(" "), i.forEach(function(t) {
                e.call(this, t, n, r)
            }, this))
        },
        c = function(t, e) {
            var i, n, r;
            if (i = s.call(this)[t], i && 0 !== i.length)
                for (i = i.slice(), this._stoppedImmediatePropagation = !1, n = 0, r = i.length; n < r && (!this._stoppedImmediatePropagation && !e(i[n], n)); n++);
        },
        l = function(t, e, i) {
            var n = -1;
            c.call(this, e, function(t, e) {
                if (t.callback === i) return n = e, !0
            }), n !== -1 && t[e].splice(n, 1)
        };
    o.on = function() {
        var t = s.call(this);
        return a.call(this, arguments, function(e, i, n) {
            t[e] = t[e] || (t[e] = []), t[e].push({
                callback: i,
                context: n
            })
        }), this
    }, o.once = function() {
        return a.call(this, arguments, function(t, e, i) {
            var n = function(r) {
                e.call(i || this, r), this.off(t, n)
            };
            this.on(t, n, this)
        }), this
    }, o.off = function(t, e) {
        var i = s.call(this);
        if (0 === arguments.length) this._events = {};
        else if (!t || "string" != typeof t && "object" != typeof t || Array.isArray(t)) throw new TypeError("Expecting event name to be a string or object.");
        if ("object" == typeof t)
            for (var n in t) l.call(this, i, n, t[n]);
        if ("string" == typeof t) {
            var r = t.split(" ");
            1 === r.length ? e ? l.call(this, i, t, e) : i[t] = [] : r.forEach(function(t) {
                i[t] = []
            })
        }
        return this
    }, o.trigger = function(t, e, i) {
        if (!t) throw new Error("trigger method requires an event name");
        if ("string" != typeof t) throw new TypeError("Expecting event names to be a string.");
        if (i && "boolean" != typeof i) throw new TypeError("Expecting doNotPropagate to be a boolean.");
        return t = t.split(" "), t.forEach(function(t) {
            c.call(this, t, function(t) {
                t.callback.call(t.context || this.context || this, e)
            }.bind(this)), i || c.call(this, n, function(i) {
                var n = t;
                i.prefix && (n = i.prefix + n), i.emitter.trigger(n, e)
            })
        }, this), this
    }, o.propagateTo = function(t, e) {
        var i = s.call(this);
        i[n] || (this._events[n] = []), i[n].push({
            emitter: t,
            prefix: e
        })
    }, o.stopPropagatingTo = function(t) {
        var e = s.call(this);
        if (!t) return void(e[n] = []);
        var i, r = e[n],
            o = r.length;
        for (i = 0; i < o; i++)
            if (r[i].emitter === t) {
                r.splice(i, 1);
                break
            }
    }, o.stopImmediatePropagation = function() {
        this._stoppedImmediatePropagation = !0
    }, o.has = function(t, e, i) {
        var n = s.call(this),
            r = n[t];
        if (0 === arguments.length) return Object.keys(n);
        if (!r) return !1;
        if (!e) return r.length > 0;
        for (var o = 0, a = r.length; o < a; o++) {
            var c = r[o];
            if (i && e && c.context === i && c.callback === e) return !0;
            if (e && !i && c.callback === e) return !0
        }
        return !1
    };

    app.commons.EventEmitter = r;

})(app, $, app.$dom, app.utils);
