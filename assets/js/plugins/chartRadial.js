(function(app, $, $dom, _){

    app.define("plugins.chartRadial");

    app.plugins.chartRadial = function(scope, options){
        if (!scope) return;

        this.active = false;
        this.scope = $(scope);
        this.options = options;
        this.items = [];
        this.rendered = false;
        this.init();
    };

    app.plugins.chartRadial.prototype = {

        init: function(){
            var _this = this;

            if (this.active) return;

            var options = {
                animate: !app.device.isPhone,
                lineWidth: app.device.isPhone ? 16.5 : 24,
                colors: ['#0084ff', '#ff2d55', '#ffc43a'],
                container: "chart__radial__graph",
                graphItem: "chart__radial__graph",
                labels: "chart__radial__labels",
                labelItem: "chart__radial__label",
                labelTitle: "chart__radial__label__title",
                labelColor: "chart__radial__label__color",
                labelDash: app.device.isPhone ? '&nbsp; &ndash; &nbsp;' : '&nbsp; &mdash; &nbsp;'
            }
            if (this.options) _.extend(options, this.options);

            this.options = options;

            this.$graph = $('<div class="' + options.container + '">').appendTo(this.scope);
            this.$graphItem = $("<div>");

            this.$graph.append(this.$graphItem, this.$graphItem.clone(), this.$graphItem.clone());

            this.$graph.find("div").each(function(i, item){
                $(this).addClass(options.graphItem + (i + 1));
            });

            this.$labels = $('<div class="' + options.labels + '">').appendTo(this.scope);
            this.$labelItem = $('<div class="' + options.labelItem + '"><div class="' + options.labelColor + '"></div>' + options.labelDash + '<span class="' + options.labelTitle + '"></span></div>');

            this.$labels.append(this.$labelItem, this.$labelItem.clone(), this.$labelItem.clone());

            this.active = true;
        },

        render: function(data) {
            var _this = this;

            if (!data || data && data.length < 3) return;

            if (this.rendered){
                _.each(this.items, function(item, i){
                    item.reset();
                    item.start(_.isNumber(data[i].value) ? data[i].value : (_.isNumber(data[i]) ? data[i] : 0));
                });
            }
            else {
                this.$graph.children("div").each(function(i, item){
                    _this.items.push(_this.build(this, data[i].value, {
                        color: _this.options.colors[i],
                        autostart: true
                    }))
                });

                this.$labels.children("div").each(function(i){
                    var $item = $(this);

                    $item.find("." + _this.options.labelColor)
                    .css("backgroundColor", _this.options.colors[i]);

                    $item.find("." + _this.options.labelTitle)
                    .text(data[i].title);
                });

                this.rendered = true;
            }
        },

        build: function(box, value, _options) {

        	var canvas = document.createElement('canvas'),
        		context = canvas.getContext('2d'),

        		boxsize = box.offsetWidth,

        		options = _options || {},
        		lineWidth = this.options.lineWidth,
        		barcolor = options.color || '#fff',
        		noanimation = !this.options.animate || false,

        		from = options.from || 0,
        		to = value,
        		now = {percent: from},

        		nowanimating = false,
        		animateduration = this.options.animate ? 2 : 0,
        		animateoptions = {ease: 'easeInOutCubic', onUpdate: onupdate, onComplete: onend};


        	canvas.width = canvas.height = boxsize;
        	box.appendChild(canvas);

        	context.lineWidth = lineWidth;
        	context.lineCap = 'round';
        	context.strokeStyle = barcolor;

        	if (noanimation) {
        		options.autostart = true;
        	}

        	options.autostart ? start(to) : reset();


        	function ready() {
        		draw(from);
        	}

        	function start(to) {
        		if (!nowanimating) {
        			now.percent = noanimation ? value : from;
        			if (now.percent == to) {
        				draw(now.percent);
        			} else {
        				nowanimating = true;
        				animateoptions.percent = to;
        				TweenLite.to(now, animateduration, animateoptions);
        			}
        		}
        	}

        	function onupdate() {
        		draw(now.percent);
        	}

        	function onend() {
        		nowanimating = false;
        	}

        	function draw(percent) {

        		var boxhalfsize = boxsize/2;

        		percent = Math.max(percent, 0.005);

        		context.clearRect(0, 0, boxsize, boxsize);

        		// bg
        		context.beginPath();
        		context.globalAlpha = 0.2;
        		context.arc(boxhalfsize, boxhalfsize, boxhalfsize-lineWidth/2, 0, 2*Math.PI);
        		context.stroke();

        		// bar
        		context.beginPath();
        		context.arc(boxhalfsize, boxhalfsize, boxhalfsize-lineWidth/2, 0-Math.PI/2, (2*Math.PI)*percent/100-Math.PI/2);
        		context.globalAlpha = 1;
        		context.stroke();

        	}

        	function reset() {
        		draw(from);
        	}

        	return {
        		start: start,
        		reset: reset
        	}
        },

        destroy: function(){
            this.scope.empty();
            this.items = [];
            this.rendered = false;
            this.active = false;
        }
    };

})(app, $, app.$dom, app.utils);
