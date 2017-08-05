(function(dom, _){

    app.define("math");

    app.math = {
        lerp: function(b, a, c) {
            return a + (c - a) * b
        },
        map: function(a, b, j, c, k) {
            return this.lerp(this.norm(a, b, j), c, k)
        },
        mapClamp: function(i, h, f, g, d) {
            var i = this.lerp(this.norm(i, h, f), g, d);
            return Math.max(g, Math.min(d, i))
        },
        norm: function(a, b, c) {
            return (a - b) / (c - b)
        },
        clamp: function(a, b, c) {
            return Math.max(b, Math.min(c, a))
        },
        randFloat: function(a, b) {
            return (Math.random() * (b - a)) + a
        },
        randInt: function(a, b) {
            return Math.floor((Math.random() * (b - a)) + a)
        }
    };

})(app.dom, app.utils);
