(function(app, $, $dom, _){

    app.define("plugins.scroll.PooledScrollTracker");

    var k = app.plugins.scroll.ScrollTracker;

    function m(a) {
        k.call(this, a);
        this._poolSize = this._options.poolSize;
        this._pool = [];
        this._targetPosition = null
    }
    var l = m.prototype = Object.create(k.prototype);
    l.defaults.poolSize = 20;
    l._updateScrollData = function(a) {
        a = k.prototype._updateScrollData.call(this, a);
        a.target = {
            position: this._position,
            lastPosition: (this._targetPosition === null) ? this._position : this._targetPosition,
            positionDelta: this._position - this._targetPosition
        };
        this._targetPosition = this._position;
        this._pushPoolData(a);
        this._eventData = _.clone(a);
        this._position = this._eventData.position = Math.round(this._eventData.position);
        return this._eventData
    };
    l._pushPoolData = function(a) {
        this._pool.push(a);
        if (this._poolSize && this._pool.length > this._poolSize) {
            this._pool.shift()
        }
    };

    app.plugins.scroll.PooledScrollTracker = m;

})(app, $, app.$dom, app.utils);
