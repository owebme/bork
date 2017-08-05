(function(app, $, $dom, _){

    app.define("easing.fn");

    var S = app.easing.createBezier;
    var af = S(0.25, 0.1, 0.25, 1).easingFunction;
    var aw = S(0.42, 0, 1, 1).easingFunction;
    var Z = S(0, 0, 0.58, 1).easingFunction;
    var ae = S(0.42, 0, 0.58, 1).easingFunction;
    var ah = function(b, d, a, c) {
        return a * b / c + d
    };
    var av = function(b, d, a, c) {
        return a * (b /= c) * b + d
    };
    var O = function(b, d, a, c) {
        return -a * (b /= c) * (b - 2) + d
    };
    var Y = function(b, d, a, c) {
        if ((b /= c / 2) < 1) {
            return a / 2 * b * b + d
        }
        return -a / 2 * ((--b) * (b - 2) - 1) + d
    };
    var au = function(b, d, a, c) {
        return a * (b /= c) * b * b + d
    };
    var aB = function(b, d, a, c) {
        return a * ((b = b / c - 1) * b * b + 1) + d
    };
    var at = function(b, d, a, c) {
        if ((b /= c / 2) < 1) {
            return a / 2 * b * b * b + d
        }
        return a / 2 * ((b -= 2) * b * b + 2) + d
    };
    var an = function(b, d, a, c) {
        return a * (b /= c) * b * b * b + d
    };
    var ap = function(b, d, a, c) {
        return -a * ((b = b / c - 1) * b * b * b - 1) + d
    };
    var am = function(b, d, a, c) {
        if ((b /= c / 2) < 1) {
            return a / 2 * b * b * b * b + d
        }
        return -a / 2 * ((b -= 2) * b * b * b - 2) + d
    };
    var ad = function(b, d, a, c) {
        return a * (b /= c) * b * b * b * b + d
    };
    var ag = function(b, d, a, c) {
        return a * ((b = b / c - 1) * b * b * b * b + 1) + d
    };
    var ac = function(b, d, a, c) {
        if ((b /= c / 2) < 1) {
            return a / 2 * b * b * b * b * b + d
        }
        return a / 2 * ((b -= 2) * b * b * b * b + 2) + d
    };
    var az = function(b, d, a, c) {
        return -a * Math.cos(b / c * (Math.PI / 2)) + a + d
    };
    var Q = function(b, d, a, c) {
        return a * Math.sin(b / c * (Math.PI / 2)) + d
    };
    var aa = function(b, d, a, c) {
        return -a / 2 * (Math.cos(Math.PI * b / c) - 1) + d
    };
    var V = function(b, d, a, c) {
        return (b === 0) ? d : a * Math.pow(2, 10 * (b / c - 1)) + d
    };
    var ab = function(b, d, a, c) {
        return (b === c) ? d + a : a * (-Math.pow(2, -10 * b / c) + 1) + d
    };
    var ak = function(b, d, a, c) {
        if (b === 0) {
            return d
        } else {
            if (b === c) {
                return d + a
            } else {
                if ((b /= c / 2) < 1) {
                    return a / 2 * Math.pow(2, 10 * (b - 1)) + d
                }
            }
        }
        return a / 2 * (-Math.pow(2, -10 * --b) + 2) + d
    };
    var aq = function(b, d, a, c) {
        return -a * (Math.sqrt(1 - (b /= c) * b) - 1) + d
    };
    var ax = function(b, d, a, c) {
        return a * Math.sqrt(1 - (b = b / c - 1) * b) + d
    };
    var T = function(b, d, a, c) {
        if ((b /= c / 2) < 1) {
            return -a / 2 * (Math.sqrt(1 - b * b) - 1) + d
        }
        return a / 2 * (Math.sqrt(1 - (b -= 2) * b) + 1) + d
    };
    var X = function(c, f, a, d) {
        var h = 1.70158;
        var b = 0;
        var g = a;
        if (c === 0) {
            return f
        } else {
            if ((c /= d) === 1) {
                return f + a
            }
        }
        if (!b) {
            b = d * 0.3
        }
        if (g < Math.abs(a)) {
            g = a;
            h = b / 4
        } else {
            h = b / (2 * Math.PI) * Math.asin(a / g)
        }
        return -(g * Math.pow(2, 10 * (c -= 1)) * Math.sin((c * d - h) * (2 * Math.PI) / b)) + f
    };
    var U = function(c, f, a, d) {
        var h = 1.70158;
        var b = 0;
        var g = a;
        if (c === 0) {
            return f
        } else {
            if ((c /= d) === 1) {
                return f + a
            }
        }
        if (!b) {
            b = d * 0.3
        }
        if (g < Math.abs(a)) {
            g = a;
            h = b / 4
        } else {
            h = b / (2 * Math.PI) * Math.asin(a / g)
        }
        return g * Math.pow(2, -10 * c) * Math.sin((c * d - h) * (2 * Math.PI) / b) + a + f
    };
    var ai = function(c, f, a, d) {
        var h = 1.70158;
        var b = 0;
        var g = a;
        if (c === 0) {
            return f
        } else {
            if ((c /= d / 2) === 2) {
                return f + a
            }
        }
        if (!b) {
            b = d * (0.3 * 1.5)
        }
        if (g < Math.abs(a)) {
            g = a;
            h = b / 4
        } else {
            h = b / (2 * Math.PI) * Math.asin(a / g)
        }
        if (c < 1) {
            return -0.5 * (g * Math.pow(2, 10 * (c -= 1)) * Math.sin((c * d - h) * (2 * Math.PI) / b)) + f
        }
        return g * Math.pow(2, -10 * (c -= 1)) * Math.sin((c * d - h) * (2 * Math.PI) / b) * 0.5 + a + f
    };
    var aj = function(b, d, a, c, f) {
        if (f === undefined) {
            f = 1.70158
        }
        return a * (b /= c) * b * ((f + 1) * b - f) + d
    };
    var al = function(b, d, a, c, f) {
        if (f === undefined) {
            f = 1.70158
        }
        return a * ((b = b / c - 1) * b * ((f + 1) * b + f) + 1) + d
    };
    var ar = function(b, d, a, c, f) {
        if (f === undefined) {
            f = 1.70158
        }
        if ((b /= c / 2) < 1) {
            return a / 2 * (b * b * (((f *= (1.525)) + 1) * b - f)) + d
        }
        return a / 2 * ((b -= 2) * b * (((f *= (1.525)) + 1) * b + f) + 2) + d
    };
    var R = function(b, d, a, c) {
        if ((b /= c) < (1 / 2.75)) {
            return a * (7.5625 * b * b) + d
        } else {
            if (b < (2 / 2.75)) {
                return a * (7.5625 * (b -= (1.5 / 2.75)) * b + 0.75) + d
            } else {
                if (b < (2.5 / 2.75)) {
                    return a * (7.5625 * (b -= (2.25 / 2.75)) * b + 0.9375) + d
                }
            }
        }
        return a * (7.5625 * (b -= (2.625 / 2.75)) * b + 0.984375) + d
    };
    var ao = function(b, d, a, c) {
        return a - R(c - b, 0, a, c) + d
    };
    var P = function(b, d, a, c) {
        if (b < c / 2) {
            return ao(b * 2, 0, a, c) * 0.5 + d
        }
        return R(b * 2 - c, 0, a, c) * 0.5 + a * 0.5 + d
    };
    app.easing.fn = {
        linear: ah,
        ease: af,
        easeIn: aw,
        "ease-in": aw,
        easeOut: Z,
        "ease-out": Z,
        easeInOut: ae,
        "ease-in-out": ae,
        easeInCubic: au,
        "ease-in-cubic": au,
        easeOutCubic: aB,
        "ease-out-cubic": aB,
        easeInOutCubic: at,
        "ease-in-out-cubic": at,
        easeInQuad: av,
        "ease-in-quad": av,
        easeOutQuad: O,
        "ease-out-quad": O,
        easeInOutQuad: Y,
        "ease-in-out-quad": Y,
        easeInQuart: an,
        "ease-in-quart": an,
        easeOutQuart: ap,
        "ease-out-quart": ap,
        easeInOutQuart: am,
        "ease-in-out-quart": am,
        easeInQuint: ad,
        "ease-in-quint": ad,
        easeOutQuint: ag,
        "ease-out-quint": ag,
        easeInOutQuint: ac,
        "ease-in-out-quint": ac,
        easeInSine: az,
        "ease-in-sine": az,
        easeOutSine: Q,
        "ease-out-sine": Q,
        easeInOutSine: aa,
        "ease-in-out-sine": aa,
        easeInExpo: V,
        "ease-in-expo": V,
        easeOutExpo: ab,
        "ease-out-expo": ab,
        easeInOutExpo: ak,
        "ease-in-out-expo": ak,
        easeInCirc: aq,
        "ease-in-circ": aq,
        easeOutCirc: ax,
        "ease-out-circ": ax,
        easeInOutCirc: T,
        "ease-in-out-circ": T,
        easeInBack: aj,
        "ease-in-back": aj,
        easeOutBack: al,
        "ease-out-back": al,
        easeInOutBack: ar,
        "ease-in-out-back": ar,
        easeInElastic: X,
        "ease-in-elastic": X,
        easeOutElastic: U,
        "ease-out-elastic": U,
        easeInOutElastic: ai,
        "ease-in-out-elastic": ai,
        easeInBounce: ao,
        "ease-in-bounce": ao,
        easeOutBounce: R,
        "ease-out-bounce": R,
        easeInOutBounce: P,
        "ease-in-out-bounce": P
    };

})(app, $, app.$dom, app.utils);
