(function(app, $, $dom, _){

    app.define("plugins.ripple");

    app.plugins.ripple = function(options){
        var options = options || {};

        this.active = false;
        this.classes = options.classes && _.isArray(options.classes) ? options.classes.join(", ") : "[data-ripple]";
        this.disabled = options.disabled;
        this.init();
    };

    app.plugins.ripple.prototype = {

        init: function(){
            if (this.active) return;

            var _this = this;

            $(document).on("mousedown.ripple", _this.classes, function(e) {

                var $self = $(this);

                if (_this.disabled && _.isArray(_this.disabled)) {
                    if ($self.is(_this.disabled.join(", "))) {
                        return;
                    }
                }
                if ($self.closest(_this.classes)) {
                    e.stopPropagation();
                }

                var initPos = $self.css("position"),
                    offs = $self.offset(),
                    x = e.pageX - offs.left,
                    y = e.pageY - offs.top,
                    dia = Math.min(this.offsetHeight, this.offsetWidth, 100), // start diameter
                    $ripple = $('<div/>', {
                        class: "ripple",
                        appendTo: $self
                    });

                if (!initPos || initPos === "static") {
                    $self.css({
                        position: "relative"
                    });
                }

                $('<div/>', {
                    class: "rippleWave",
                    css: {
                        background: $self.data("ripple"),
                        width: dia,
                        height: dia,
                        left: x - (dia / 2),
                        top: y - (dia / 2),
                    },
                    appendTo: $ripple,
                    one: {
                        animationend: function() {
                            $ripple.remove();
                        }
                    }
                });
            });

            this.active = true;
        },

        destroy: function(){
            this.active = false;
            $dom.document.off("mousedown.ripple");
        }
    };

})(app, $, app.$dom, app.utils);
