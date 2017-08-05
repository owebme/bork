(function(app, $, $dom, _){

    app.define("easing.KeySpline");

    function h(a, d, b, q) {
        this.get = function(j) {
            if (a === d && b === q) {
                return j
            }
            return t(p(j), d, q)
        };

        function r(k, j) {
            return 1 - 3 * j + 3 * k
        }

        function s(k, j) {
            return 3 * j - 6 * k
        }

        function u(j) {
            return 3 * j
        }

        function t(j, l, k) {
            return ((r(l, k) * j + s(l, k)) * j + u(l)) * j
        }

        function c(j, l, k) {
            return 3 * r(l, k) * j * j + 2 * s(l, k) * j + u(l)
        }

        function p(k) {
            var m = k;
            for (var l = 0; l < 4; ++l) {
                var j = c(m, a, b);
                if (j === 0) {
                    return m
                }
                var n = t(m, a, b) - k;
                m -= n / j
            }
            return m
        }
    };

    app.easing.KeySpline = h;

})(app, $, app.$dom, app.utils);
