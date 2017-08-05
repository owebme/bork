app.plugins.marquee = function($frame, settings){
	var $screens = $frame.find(settings.screens),
		$fake = $('<div class="'+settings.spaceClass+'" />').prependTo($frame),
		screens = [],
		effect = app.plugins.marqueeEffects({
			isPhone: settings.phoneEmulate
		})[settings.effect],
		overlayed = false,
		name = $frame.data('name');
	// marquee
	var marquee = {
		index: 0,
		prevIndex: 0,
		progress: 0,
		size: 0,
		scrolling: false,
		enabled: true,
		section: null,
		_events: {},

		on: function (type, fn) {
			if ( !this._events[type] ) {
				this._events[type] = [];
			}

			this._events[type].push(fn);
		},

		off: function (type, fn) {
			if ( !this._events[type] ) {
				return;
			}

			var index = this._events[type].indexOf(fn);

			if ( index > -1 ) {
				this._events[type].splice(index, 1);
			}
		},

		_execEvent: function (type) {
			if ( !this._events[type] ) {
				return;
			}

			var i = 0,
				l = this._events[type].length;

			if ( !l ) {
				return;
			}

			for ( ; i < l; i++ ) {
				this._events[type][i].apply(this, [].slice.call(arguments, 1));
			}
		}
	};
	// screens
	$screens.each(function(i){
		var $block = $(this);
		// api
		var api = $block.api('screen');
		api.state = {
			isVisible: false,
			isEndShow: false,
			isStartShow: false,
			isFullShow: false,
			isFullHide: true
		};
		// screen
		var screen = {
			index: i,
			title: $block[0].getAttribute("data-" + (settings.dataAttr ? settings.dataAttr : "marquee")),
			block: $block,
			fake: $('<div class="'+settings.spaceClass+'__screen" />'),
			api: api,
			ratio: 1,
			enable: true
		};
		// save screen
		screens.push(screen);
		// decor
		//if (i && settings.nextClass) $block.addClass(settings.nextClass);
		$fake.append(screen.fake);
	});
	// {fn} resize fake
	var resize = function(){
		var offset = 0;
		marquee.size = settings.vertical ? $frame.height() : app.sizes.width;
		$.each(screens, function(i, screen){
			if (settings.vertical){
				var height = Math.max(screen.block.outerHeight(), screen.block.find(settings.contentClass ? '.' + settings.contentClass : '.screen__frame').outerHeight());
				if (height > marquee.size) {
					screen.block.addClass(settings.longClass ? settings.longClass : 'screen__long');
					screen.size = height;
				} else {
					screen.block.removeClass(settings.longClass ? settings.longClass : 'screen__long');
					screen.size = $frame.height();
				}
				screen.fake.width(app.sizes.width);
				screen.fake.height(screen.size);
			} else {
				screen.size = app.sizes.width;
				screen.fake.width(screen.size);
				screen.fake.height(app.sizes.height);
			}
			if (settings.hideSections){
				if (!settings.activeClass && i > 0 || settings.activeClass && !screen.block.hasClass(settings.activeClass)){
					screen.block.css("display", "none");
				}
			}
			screen.offset = offset;
			screen.ratio = screen.size/marquee.size;
			offset += screen.size;
		});
	};
	resize();

	// scroll
	var scroll = new IScroll($frame[0], {
		marquee: true,
		disableMouse: false,
		mouseWheel: settings.mousewheel,
		scrollX: !settings.vertical,
		scrollY: settings.vertical,
		bounce: true,
		snap: '.'+settings.spaceClass+'__screen',
		eventPassthrough: settings.vertical ? 'horizontal' : true,
		probeType: 3,
		snapSpeed: settings.duration,
		preventDefault: true,
		scrollbars: settings.vertical ? 'custom' : false,
		interactiveScrollbars: settings.vertical && !app.device.support.touch,
		// deceleration: settings.vertical ? false : 0.0034,
		fake: true
	});
	// {fn} set limits
	marquee.setLimits = function(index){
		index = Math.min(Math.max(0, index), screens.length-1);
		var isLast = index >= screens.length-1,
			isFirst = index==0;
		// min limit
		scroll[settings.vertical ? 'minScrollY' : 'minScrollX'] = -screens[index].offset + (isFirst ? 0 : screens[index-1].size);
		// max limit
		scroll[settings.vertical ? 'maxScrollY' : 'maxScrollX'] = -screens[index].offset - (isLast ? screens[index].size-marquee.size : screens[index].size);
		// set current page
		scroll.currentPage = { x:0, y:0, pageX:0, pageY:0 };
		scroll.currentPage[settings.vertical ? 'y' : 'x'] = -screens[index].offset;
		scroll.currentPage[settings.vertical ? 'pageY' : 'pageX'] = index;
	};
	// {fn} update params
	marquee.update = function(){
		var position = -Math.round(scroll[settings.vertical ? 'y' : 'x']),
			index = 0;
		// get screen index
		for (var i=0; i<screens.length; i++) {
			if (position >= screens[i].offset) index = i;
		};
		// position
		marquee.position = (position-screens[index].offset) / screens[index].size;
		// progress
		marquee.progress = index+marquee.position;
		// indexes
		if (marquee.index!=index) {
			marquee.prevIndex = marquee.index;
			marquee.index = index;
		};
	};
	// {fn} hide invisibles
	marquee.hideInvisibles = function(){
		for (var i=0; i<screens.length; i++) {
			if (i!=marquee.index && i!=marquee.index+1) {
				if (i>marquee.index+1) effect.show(screens[i].block, 0, marquee.size, screens[i].ratio);
				if (i<marquee.index) effect.hide(screens[i].block, 1, marquee.size, screens[i].ratio);
				if (settings.hideSections) screens[i].block[0].style.display = 'none';
			}
		};
	};
	// {fn} hide invisibles
	marquee.callScreensAPI = function(){
		var isLast = marquee.index>=screens.length-1,
			ratio = 1 / screens[marquee.index].ratio,
			position = { top:0, bottom:0 };
		// position
		position.top = marquee.position / ratio;
		position.bottom = marquee.position*screens[marquee.index].ratio - (screens[marquee.index].ratio - 1);
		// show and hide
		if (position.bottom>0.6) {
			if (screens[marquee.index].api.state.isVisible) {
				screens[marquee.index].api.state.isVisible = false;
				screens[marquee.index].block.triggerHandler('hide');
			}
			if (!isLast && !screens[marquee.index+1].api.state.isVisible) {
				screens[marquee.index+1].api.state.isVisible = true;
				screens[marquee.index+1].block.triggerHandler('show');
			}
		} else if (position.top>0.4) {
			if (screens[marquee.index] && !screens[marquee.index].api.state.isVisible) {
				screens[marquee.index].api.state.isVisible = true;
				screens[marquee.index].block.triggerHandler('show');
			}
			if (!isLast && screens[marquee.index+1].api.state.isVisible) {
				screens[marquee.index+1].api.state.isVisible = false;
				screens[marquee.index+1].block.triggerHandler('hide');
			}
		}
		// show start and end of next screen
		if (!isLast) {
			if (position.bottom>0.1 && !screens[marquee.index+1].api.state.isStartShow) {
				screens[marquee.index+1].api.state.isStartShow = true;
				screens[marquee.index+1].block.triggerHandler('startShow');
			} else if (position.bottom<0.1 && screens[marquee.index+1].api.state.isStartShow) {
				screens[marquee.index+1].api.state.isStartShow = false;
			}
			if (position.bottom>0.9 && !screens[marquee.index+1].api.state.isEndShow) {
				screens[marquee.index+1].api.state.isEndShow = true;
				screens[marquee.index+1].block.triggerHandler('endShow');
			} else if (position.bottom<0.9 && screens[marquee.index+1].api.state.isEndShow) {
				screens[marquee.index+1].api.state.isEndShow = false;
			}
		}
		// show start and end of current screen
		if (screens[marquee.index] && position.bottom<0.9 && !screens[marquee.index].api.state.isEndShow) {
			screens[marquee.index].api.state.isEndShow = true;
			screens[marquee.index].block.triggerHandler('endShow');
		} else if (screens[marquee.index] && position.bottom>0.9 && screens[marquee.index].api.state.isEndShow) {
			screens[marquee.index].api.state.isEndShow = false;
		}
		if (screens[marquee.index] && position.bottom<0.1 && !screens[marquee.index].api.state.isStartShow) {
			screens[marquee.index].api.state.isStartShow = true;
			screens[marquee.index].block.triggerHandler('startShow');
		} else if (screens[marquee.index] && position.bottom>0.1 && screens[marquee.index].api.state.isStartShow) {
			screens[marquee.index].api.state.isStartShow = false;
		}
		// full show
		if (screens[marquee.index] && position.top>=0 && position.bottom<=0) {
			if (!screens[marquee.index].api.state.isFullShow) {
				screens[marquee.index].api.state.isFullShow = true;
				screens[marquee.index].block.triggerHandler('fullShow');
			};
			for (var i=0; i<screens.length; i++) {
				if (i!=marquee.index) screens[i].api.state.isFullShow = false;
			};
		} else {
			for (var i=0; i<screens.length; i++) {
				screens[i].api.state.isFullShow = false;
			};
		};
		var visible = [Math.floor(marquee.progress), Math.ceil(marquee.progress)];
		// full hide
		for (var i=0; i<screens.length; i++) {
			if (i==visible[0] || i==visible[1]) {
				screens[i].api.state.isFullHide = false;
				if (settings.hideSections) screens[i].block[0].style.display = 'block';
				marquee.section = screens[i].block[0].getAttribute("data-" + (settings.dataAttr ? settings.dataAttr : "marquee"));
				if (settings.activeClass) screens[i].block.addClass(settings.activeClass);
			} else if (!screens[i].api.state.isFullHide) {
				if (settings.hideSections) screens[i].block[0].style.display = 'none';
				screens[i].block.triggerHandler('fullHide');
				screens[i].api.state.isFullHide = true;
				if (settings.activeClass) screens[i].block.removeClass(settings.activeClass);
			}
		}
	};
	// mark nav
	marquee.markNav = function(){
		if (settings.navPrev) settings.navPrev[marquee.progress<=0.5 ? 'addClass' : 'removeClass']('i-disabled');
		if (settings.navNext) settings.navNext[marquee.progress>=screens.length-1.5 ? 'addClass' : 'removeClass']('i-disabled');
	};
	// redraw
	marquee.draw = function(){
		if (!effect.move || screens[marquee.index].ratio*marquee.position >= screens[marquee.index].ratio-1) {
			var position = 1-Math.abs(screens[marquee.index].ratio*marquee.position-screens[marquee.index].ratio);
			if (marquee.index>=0) effect.hide(screens[marquee.index].block, position, marquee.size, screens[marquee.index].ratio);
			if (marquee.index<screens.length-1) effect.show(screens[marquee.index+1].block, position, marquee.size, screens[marquee.index+1].ratio);
			if (position === 0 || position === 1) marquee._execEvent('change');
		} else {
			if (marquee.index>=0) effect.move(screens[marquee.index].block, screens[marquee.index].ratio*marquee.position, marquee.size, screens[marquee.index].ratio);
			if (marquee.index<screens.length-1) effect.show(screens[marquee.index+1].block, 0, marquee.size, screens[marquee.index+1].ratio);
		}
		// hide invisibles
		marquee.hideInvisibles();
		// mark nav buttons
		marquee.markNav();
	};
	// {fn} on scroll start
	marquee.onScrollStart = function(){
		marquee.scrolling = true;
	};
	// {fn} on scroll
	marquee.onScroll = function(){
		index = 0;
		marquee.update();
		marquee.draw();
		marquee.callScreensAPI();
		if (scroll.moved) {
			var position = scroll[settings.vertical ? 'y' : 'x'] - (settings.vertical ? settings.phoneEmulate ? -scroll["distY"] : scroll["pointY"] : scroll["pointX"]);
			for (var i=0; i<screens.length; i++) {
				if (position <= -screens[i].offset && position >= -screens[i].offset-screens[i].size) index = i;
			};
			marquee.setLimits(index);
		} else if (scroll.indicators && scroll.indicators[0].moved) {
			for (var i=0; i<screens.length; i++) {
				if (scroll[settings.vertical ? 'y' : 'x']-marquee.size/2 <= -screens[i].offset && scroll[settings.vertical ? 'y' : 'x']+marquee.size/2 >= -screens[i].offset-screens[i].size) index = i;
			};
			marquee.setLimits(index);
		};
	};
	// interactive
	marquee.grabTimer = false;
	var interactiveStart = function(){
		clearTimeout(marquee.grabTimer);
		if (!marquee.scrolling) {
			//$frame.addClass('i-scrolling');
			marquee.scrolling = true;
		}
	};
	var interactiveEnd = function(){
		if (marquee) clearTimeout(marquee.grabTimer);
		if (marquee && marquee.scrolling) {
			//$frame.removeClass('i-scrolling');
			marquee.scrolling = false;
		}
	};
	scroll.on('beforeWheelSnap', function(){
		index = 0;
		for (var i=0; i<screens.length; i++) {
			if (scroll[settings.vertical ? 'y' : 'x']-marquee.size/2 <= -screens[i].offset && scroll[settings.vertical ? 'y' : 'x']+marquee.size/2 >= -screens[i].offset-screens[i].size) index = i;
		};
		scroll.absStartX = settings.vertical ? 0 : -screens[index].offset;
		scroll.absStartY = -settings.vertical ? -screens[index].offset : 0;
		marquee.setLimits(index);
	})
	// {fn} on scroll end
	marquee.onScrollEnd = function(){
		marquee.refresh();
	};
	// {fn} refresh
	marquee.refresh = function(){
		marquee.update();
		marquee.draw();
		marquee.callScreensAPI();
		marquee.setLimits(marquee.index);
	};
	// {fn} resize
	marquee.resize = function(){
		if (!marquee) return false;
		//$body.addClass('page_resize');
		resize();
		var y = scroll.y;
		scroll.refresh();
		if (y !== scroll.y){
			scroll.scrollBy(0, y - scroll.y, 0);
		}
		marquee.refresh();
		//$body.removeClass('page_resize');
	};
	// {fn} enable
	marquee.enable = function(){
		marquee.enabled = true;
		scroll.enable();
		marquee.enableKeyboard();
	};
	// {fn} disable
	marquee.disable = function(){
		marquee.enabled = false;
		scroll.disable();
		marquee.disableKeyboard();
	};
	// {event} scroll start
	scroll.on('scrollStart', function(){
		if (!marquee) return false;
		marquee.onScrollStart();
	});
	// {event} scroll move
	scroll.on('scroll', function(){
		if (!marquee) return false;
		marquee.onScroll();
		if (scroll.moved) interactiveStart();
	});
	// {event} scroll end
	scroll.on('scrollEnd', function(){
		if (!marquee) return false;
		marquee.onScrollEnd();
		interactiveEnd();
	});
	// {event} grab
	scroll.on('grab', function(){
		if (!marquee) return false;
		// interavtive
		interactiveStart();
		marquee.grabTimer = setTimeout(function(){
			if (scroll) scroll.reset();
			interactiveEnd();
		}, 500);
		// update
		var index = 0,
			position = scroll[settings.vertical ? 'y' : 'x'] - scroll[settings.vertical ? 'pointY' : 'pointX'];
		for (var i=0; i<screens.length; i++) {
			if (position <= -screens[i].offset && position >= -screens[i].offset-screens[i].size) index = i;
		};
		marquee.setLimits(index);
	});
	// {event} window resize
	if (!app.device.isMobile){
		app.$dom.window.on('resize', marquee.resize);
	}
	// set limits on first screen
	marquee.setLimits(0);
	// {fn} scroll to
	marquee.scrollTo = function(index, duration){
		duration = duration === undefined && duration !== 0 ? 550 : duration;
		if (settings.hideSections) screens[index].block[0].style.display = 'block';
		//setTimeout(function(){
			scroll.goToPage(!settings.vertical ? index : 0, settings.vertical ? index : 0, duration, duration == 0 ? false : IScroll.utils.ease.cubicOut);
			//if (duration==0) marquee.refresh();
		//}, 5);
	};
	// {fn} prev
	marquee.prev = function(duration){
		if (marquee.scrolling) return false;
		duration = duration===undefined ? settings.duration : duration;
		var remaining = (-scroll.y - screens[marquee.index].offset);
		if (settings.vertical && remaining) {
			scroll.scrollBy(0, Math.min(remaining, marquee.size), duration, IScroll.utils.ease.cubicOut);
		} else if (settings.vertical && scroll.y<=-marquee.size) {
			scroll.scrollBy(0, marquee.size, duration, IScroll.utils.ease.cubicOut);
		} else if (marquee.index>0) {
			scroll.prev(duration, IScroll.utils.ease.cubicOut);
		}
	};
	// {fn} next
	marquee.next = function(duration){
		if (marquee.scrolling) return false;
		duration = duration===undefined ? settings.duration : duration;
		var remaining = (screens[marquee.index].offset + screens[marquee.index].size) - (-scroll.y + marquee.size)
		if (remaining>marquee.size*0.1 && settings.vertical) {
			scroll.scrollBy(0, -Math.min(remaining, marquee.size), duration, IScroll.utils.ease.cubicOut);
		} else if (marquee.index<screens.length-1) {
			scroll.next(duration, IScroll.utils.ease.cubicOut);
		}
	};
	// {fn} get marquee param
	marquee.get = function(parameter){
		return marquee[parameter];
	};
	marquee.hideScreen = function(index){
		if (settings.controlInvisible && screensVisible[index].enable){
			screensVisible[index].enable = false;
			screensVisible[index].block.css("display", "none");
			screensVisible[index].fake.remove();
			marquee.callScreensVisible();
			marquee.resize();
		}
	};
	marquee.showScreen = function(index){
		if (settings.controlInvisible && !screensVisible[index].enable){
			screensVisible[index].enable = true;
			screensVisible[index].fake = $('<div class="'+settings.spaceClass+'__screen" />');
			$fake.find('.'+settings.spaceClass+'__screen:eq('+(index - 1)+')').after(screensVisible[index].fake);
			marquee.callScreensVisible();
			marquee.resize();
		}
	};
	marquee.callScreensVisible = function(){
		var _screens = [], index = 0;
		for (var i=0; i<screensVisible.length; i++) {
			if (screensVisible[i].enable){
				_screens.push(screensVisible[i]);
				_screens[index].index = index;
				index++;
			}
		}
		if (_screens.length !== screens.length) screens = _screens;
	};
	marquee.destroy = function(){
		$frame.find('.'+settings.spaceClass).remove();
		$frame.removeData('marquee');
		scroll.destroy();
		scroll = null;
		marquee = null;
	};
	// scroll
	if (settings.vertical) {
		var $scroll = $frame.find('.iScrollVerticalScrollbar');
		$scroll.addClass('ui-scroll').prepend('<div class="ui-scroll__bar" />');
		$scroll.find('.iScrollIndicator').addClass('ui-scroll__handle').prepend('<div class="ui-scroll__handle__inner" />');
	};
	// {event} click on prev
	if (settings.navPrev) settings.navPrev.on('click', function(){
		marquee.prev(app.device.isPhone ? 500 : 700);
	});
	// {event} click on next
	if (settings.navNext) settings.navNext.on('click', function(){
		marquee.next(app.device.isPhone ? 500 : 700);
	});
	// {event} enable keyboard
	var keyboardEventName = 'keydown.marquee-' + String(Math.round(new Date().getTime() / 1000)) + (settings.vertical ? 'v' : 'h');
	marquee.enableKeyboard = function(){
		if (!app.device.support.touch) app.$dom.document.on(keyboardEventName, function(e){
			if (!$(e.target).is('input,textarea,select')) {
				if (e.which==(settings.vertical ? 38 : 37)) marquee.prev(app.device.isPhone ? 500 : 700);
				if (e.which==(settings.vertical ? 40 : 39)) marquee.next(app.device.isPhone ? 500 : 700);
			}
		});
	};
	// {event} disable keyboard
	marquee.disableKeyboard = function(){
		if (!app.device.support.touch) app.$dom.document.off(keyboardEventName);
	};

	marquee.scroll = scroll;

	if (settings.controlInvisible){
		var screensVisible = [];
		for (var i=0; i<screens.length; i++) {
			screensVisible.push(screens[i]);
		}
	}

	// api
	$frame.data('marquee', {
		screens: screens,
		onScrollStart: $.noop,
		onScrollEnd: $.noop,
		scrollTo: marquee.scrollTo,
		get: marquee.get,
		scroll: scroll,
		update: marquee.onScroll,
		resize: marquee.resize,
		enable: marquee.enable,
		disable: marquee.disable,
		destroy: marquee.destroy,
		enableKeyboard: marquee.enableKeyboard,
		disableKeyboard: marquee.disableKeyboard
	});

	return marquee;
};
