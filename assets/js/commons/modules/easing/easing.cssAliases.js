(function(app, $, $dom, _){

    app.define("easing.cssAliases");

    var g = {
        linear: "cubic-bezier(0, 0, 1, 1)",
        ease: "cubic-bezier(0.25, 0.1, 0.25, 1)",
        "ease-in": "cubic-bezier(0.42, 0, 1, 1)",
        "ease-out": "cubic-bezier(0, 0, 0.58, 1)",
        "ease-in-out": "cubic-bezier(0.42, 0, 0.58, 1)",
        "ease-in-cubic": "cubic-bezier(0.55, 0.055, 0.675, 0.19)",
        "ease-out-cubic": "cubic-bezier(0.215, 0.61, 0.355, 1)",
        "ease-in-out-cubic": "cubic-bezier(0.645, 0.045, 0.355, 1)",
        "ease-in-quad": "cubic-bezier(0.55, 0.085, 0.68, 0.53)",
        "ease-out-quad": "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        "ease-in-out-quad": "cubic-bezier(0.455, 0.03, 0.515, 0.955)",
        "ease-in-quart": "cubic-bezier(0.895, 0.03, 0.685, 0.22)",
        "ease-out-quart": "cubic-bezier(0.165, 0.84, 0.44, 1)",
        "ease-in-out-quart": "cubic-bezier(0.77, 0, 0.175, 1)",
        "ease-in-quint": "cubic-bezier(0.755, 0.05, 0.855, 0.06)",
        "ease-out-quint": "cubic-bezier(0.23, 1, 0.32, 1)",
        "ease-in-out-quint": "cubic-bezier(0.86, 0, 0.07, 1)",
        "ease-in-sine": "cubic-bezier(0.47, 0, 0.745, 0.715)",
        "ease-out-sine": "cubic-bezier(0.39, 0.575, 0.565, 1)",
        "ease-in-out-sine": "cubic-bezier(0.445, 0.05, 0.55, 0.95)",
        "ease-in-expo": "cubic-bezier(0.95, 0.05, 0.795, 0.035)",
        "ease-out-expo": "cubic-bezier(0.19, 1, 0.22, 1)",
        "ease-in-out-expo": "cubic-bezier(1, 0, 0, 1)",
        "ease-in-circ": "cubic-bezier(0.6, 0.04, 0.98, 0.335)",
        "ease-out-circ": "cubic-bezier(0.075, 0.82, 0.165, 1)",
        "ease-in-out-circ": "cubic-bezier(0.785, 0.135, 0.15, 0.86)",
        "ease-in-back": "cubic-bezier(0.6, -0.28, 0.735, 0.045)",
        "ease-out-back": "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        "ease-in-out-back": "cubic-bezier(0.68, -0.55, 0.265, 1.55)"
    };
    g.easeIn = g["ease-in"];
    g.easeOut = g["ease-out"];
    g.easeInOut = g["ease-in-out"];
    g.easeInCubic = g["ease-in-cubic"];
    g.easeOutCubic = g["ease-out-cubic"];
    g.easeInOutCubic = g["ease-in-out-cubic"];
    g.easeInQuad = g["ease-in-quad"];
    g.easeOutQuad = g["ease-out-quad"];
    g.easeInOutQuad = g["ease-in-out-quad"];
    g.easeInQuart = g["ease-in-quart"];
    g.easeOutQuart = g["ease-out-quart"];
    g.easeInOutQuart = g["ease-in-out-quart"];
    g.easeInQuint = g["ease-in-quint"];
    g.easeOutQuint = g["ease-out-quint"];
    g.easeInOutQuint = g["ease-in-out-quint"];
    g.easeInSine = g["ease-in-sine"];
    g.easeOutSine = g["ease-out-sine"];
    g.easeInOutSine = g["ease-in-out-sine"];
    g.easeInExpo = g["ease-in-expo"];
    g.easeOutExpo = g["ease-out-expo"];
    g.easeInOutExpo = g["ease-in-out-expo"];
    g.easeInCirc = g["ease-in-circ"];
    g.easeOutCirc = g["ease-out-circ"];
    g.easeInOutCirc = g["ease-in-out-circ"];
    g.easeInBack = g["ease-in-back"];
    g.easeOutBack = g["ease-out-back"];
    g.easeInOutBack = g["ease-in-out-back"];

    app.easing.cssAliases = g;

})(app, $, app.$dom, app.utils);
