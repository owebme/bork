(function(app, $, $dom, _){

    app.define("plugins.player");

    app.plugins.player = function(e){
        var i = e.data("video"),
            t = e.data("poster"),
            n = e.hasClass("player_compact"),
            o = n,
            s = 2,
            a = '<video class="player__video video-js vjs-default-skin" preload="none" controls src="' + i + '" poster="' + t + '"></video>',
            r = $(a).appendTo(e),
            l = function(e, i, t) {
                var n = document.createElementNS("http://www.w3.org/2000/svg", "path");
                n.setAttributeNS(null, "d", t), n.setAttributeNS(null, "stroke", "none"), n.setAttributeNS(null, "class", "vjs-volume-menu-button__path vjs-volume-menu-button__path_" + i), e.appendChild(n)
            },
            c = function() {
                var i = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                i.setAttribute("width", "36"), i.setAttribute("height", "36"), i.setAttribute("class", "vjs-volume-menu-button__icon"), i.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
                var t = ["M8,21 L12,21 L17,26 L17,10 L12,15 L8,15 L8,21 Z", "M19,14 L19,22 C20.48,21.32 21.5,19.77 21.5,18 C21.5,16.26 20.48,14.74 19,14 Z", "M19,11.29 C21.89,12.15 24,14.83 24,18 C24,21.17 21.89,23.85 19,24.71 L19,26.77 C23.01,25.86 26,22.28 26,18 C26,13.72 23.01,10.14 19,9.23 L19,11.29 Z"];
                t.forEach(function(e, t) {
                    l(i, t, e)
                });
                var n = e.find(".vjs-volume-menu-button");
                n[0].appendChild(i)
            },
            d = function(e, i) {
                e.append('<span class="vjs-fullscreen-control__decor vjs-fullscreen-control__decor_' + i + '" />')
            },
            u = function() {
                for (var i = e.find(".vjs-fullscreen-control"), t = 1; 4 >= t; t++) d(i, t)
            },
            f = videojs(r[0], {}, function() {
                n && app.device.isPhone && e.find("video").attr("poster", "/assets/images/blank.gif"), c(), u()
            }),
            h = e.find(".vjs-poster"),
            p = e.find(".player__video"),
            v = function() {
                if (!o) return !1;
                o = !1;
                var i = new TimelineMax({
                    paused: !0
                });
                i.to(p, .3, {
                    opacity: 0
                }), i.set(h, {
                    opacity: 0
                }), i.add(function() {
                    r.removeAttr("poster")
                }), i.to(e, .3, {
                    height: e.width() / s,
                    ease: Cubic.easeOut
                }), i.add(function() {
                    e.removeClass("player_compact").height("auto"), e.triggerHandler("slideDown")
                }), i.to(p, .3, {
                    opacity: 1
                }), i.play()
            };
        f.on("play", function() {
            app.activePlayer && app.activePlayer != f && app.activePlayer.pause(), o && v(), app.activePlayer = f
        }), e.data("player", {
            play: function() {
                f.play()
            },
            pause: function() {
                f.pause()
            },
            isCollapsed: function() {
                return o
            },
            slideDown: v
        })
    };

})(app, $, app.$dom, app.utils);
