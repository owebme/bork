app.plugins.marqueeStatic = function($frame, options){
	var settings = {
		index: 0,
		vertical: true,
		screens: '.screen',
		mousewheel: true,
		//nextClass: 'screen__next',
		duration: 550,
		prev: false,
		next: false
	};

	var $screens = $frame.find(settings.screens),
		screens = [],
		effect = app.plugins.marqueeEffects({
			method: "static",
			isPhone: options.phoneEmulate
		}),
		screensFixed = $frame.data('fixed'),
		overlayed = false,
		name = $frame.data('name');

	// marquee
	var marquee = {
		$block: $frame,
		index: 0,
		prevIndex: 0,
		progress: 0,
		size: 0,
		scrolling: false,
		enabled: true,
		duration: settings.duration
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
			isFullHide: (settings.index==i) ? false : true
		};
		// screen
		var screen = {
			index: i,
			$block: $block,
			api: api,
			ratio: 1
		};
		// save screen
		screens.push(screen);
		// decor
		if (i && settings.nextClass) $block.addClass(settings.nextClass);
	});

	// {fn} resize fake
	var resize = function(){
		var offset = 0;
		marquee.size = settings.vertical ? $frame.height() : app.sizes.width;
		$.each(screens, function(i, screen){
			if (settings.vertical){
				screen.$block.removeClass('screen__long').height(marquee.size);
				var $frame = screen.$block.find('.screen__content'),
				    height = $frame.length ? Math.max(marquee.size, $frame.length ? $frame.outerHeight() : 0) : 0;
				if (!screensFixed && height > marquee.size) {
					screen.$block.addClass('screen__long');
					screen.size = height;
					screen.$block.height(height);
				} else {
					screen.size = marquee.size;
				}
			} else {
				screen.size = app.sizes.width;
			}
			screen.offset = offset;
			screen.ratio = screen.size/marquee.size;
			offset += screen.size;
		});
	};
	//app.$dom.root.addClass('root_resize');
	resize();

	// scroll
	var scroll = new IScrollStatic($frame[0], {
		disableMouse: true,
		mouseWheel: settings.mousewheel,
		invertWheelDirection: true,
		scrollX: !settings.vertical,
		scrollY: settings.vertical,
		bounce: true,
		snap: '.screen',
		eventPassthrough: settings.vertical ? 'horizontal' : true,
		probeType: 3,
		tap: false,
		click: false,
		snapSpeed: 350,
		// bounceEasing: 'circOut',
		preventDefault: true,
		scrollbars: settings.vertical ? 'custom' : false,
		interactiveScrollbars: settings.vertical && !app.device.support.touch,
		// fake: true,
		prevTrigger: settings.prev,
		nextTrigger: settings.next
	});
	scroll.disable();
	//app.$dom.root.removeClass('root_resize');

	// update state
	marquee.updateState = function(){
		if (scroll.scrollerHeight > scroll.wrapperHeight) {
			marquee.enable();
		} else {
			marquee.disable();
		}
	};

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
		// for (var i=0; i<screens.length; i++) {
		// 	if (i!=marquee.index && i!=marquee.index+1) {
		// 		if (i>marquee.index+1) effect.show(screens[i].$block, 0, marquee.size, screens[i].ratio);
		// 		if (i<marquee.index) effect.hide(screens[i].$block, 1, marquee.size, screens[i].ratio);
		// 		screens[i].$block[0].style.display = 'none';
		// 	}
		// };
	};

	// {fn} hide invisibles
	marquee.callScreensAPI = function(){
		var isLast = marquee.index>=screens.length-1,
		    ratio = 1 / screens[marquee.index].ratio,
		    position = { top:0, bottom:0 };
		// position
		position.top = marquee.position / ratio;
		position.bottom = marquee.position*screens[marquee.index].ratio - (screens[marquee.index].ratio - 1);
		if (app.device.isMobile) {
			// show and hide
			if (position.bottom>0.6) {
				if (screens[marquee.index].api.state.isVisible) {
					screens[marquee.index].api.state.isVisible = false;
					screens[marquee.index].$block.triggerHandler('hide');
				}
				if (!isLast && !screens[marquee.index+1].api.state.isVisible) {
					screens[marquee.index+1].api.state.isVisible = true;
					screens[marquee.index+1].$block.triggerHandler('show');
				}
			} else if (position.top>0.4) {
				if (screens[marquee.index] && !screens[marquee.index].api.state.isVisible) {
					screens[marquee.index].api.state.isVisible = true;
					screens[marquee.index].$block.triggerHandler('show');
				}
				if (!isLast && screens[marquee.index+1].api.state.isVisible) {
					screens[marquee.index+1].api.state.isVisible = false;
					screens[marquee.index+1].$block.triggerHandler('hide');
				}
			}
			// show start and end of next screen
			if (!isLast) {
				if (position.bottom>0.1 && !screens[marquee.index+1].api.state.isStartShow) {
					screens[marquee.index+1].api.state.isStartShow = true;
					screens[marquee.index+1].$block.triggerHandler('startShow');
				} else if (position.bottom<0.1 && screens[marquee.index+1].api.state.isStartShow) {
					screens[marquee.index+1].api.state.isStartShow = false;
				}
				if (position.bottom>0.9 && !screens[marquee.index+1].api.state.isEndShow) {
					screens[marquee.index+1].api.state.isEndShow = true;
					screens[marquee.index+1].$block.triggerHandler('endShow');
				} else if (position.bottom<0.9 && screens[marquee.index+1].api.state.isEndShow) {
					screens[marquee.index+1].api.state.isEndShow = false;
				}
			}
			// show start and end of current screen
			if (screens[marquee.index] && position.bottom<0.9 && !screens[marquee.index].api.state.isEndShow) {
				screens[marquee.index].api.state.isEndShow = true;
				screens[marquee.index].$block.triggerHandler('endShow');
			} else if (screens[marquee.index] && position.bottom>0.9 && screens[marquee.index].api.state.isEndShow) {
				screens[marquee.index].api.state.isEndShow = false;
			}
			if (screens[marquee.index] && position.bottom<0.1 && !screens[marquee.index].api.state.isStartShow) {
				screens[marquee.index].api.state.isStartShow = true;
				screens[marquee.index].$block.triggerHandler('startShow');
			} else if (screens[marquee.index] && position.bottom>0.1 && screens[marquee.index].api.state.isStartShow) {
				screens[marquee.index].api.state.isStartShow = false;
			}
		}
		// full show
		if (screens[marquee.index] && position.top>=0 && position.bottom<=0) {
			if (!screens[marquee.index].api.state.isFullShow) {
				screens[marquee.index].api.state.isFullShow = true;
				if (!app.device.isMobile) screens[marquee.index].$block.triggerHandler('show');
				screens[marquee.index].$block.triggerHandler('fullShow');
			};
			for (var i=0; i<screens.length; i++) {
				if (i!=marquee.index && screens[i].api.state.isFullShow) screens[i].api.state.isFullShow = false;
			};
		} else {
			for (var i=0; i<screens.length; i++) {
				if (screens[i].api.state.isFullShow) {
					screens[i].api.state.isFullShow = false;
				}
			};
		};
		var visible = [Math.floor(marquee.progress), Math.ceil(marquee.progress)];
		// full hide
		if (marquee.animated) return false;
		for (var i=0; i<screens.length; i++) {
			if (i==visible[0] || i==visible[1]) {
				screens[i].api.state.isFullHide = false;
				// screens[i].$block[0].style.display = 'block';
				if (options.activeClass) screens[i].$block.addClass(options.activeClass);
			} else if (!screens[i].api.state.isFullHide) {
				// screens[i].$block[0].style.display = 'none';
				if (!app.device.isMobile) screens[marquee.index].$block.triggerHandler('hide');
				screens[i].$block.triggerHandler('fullHide');
				screens[i].api.state.isFullHide = true;
				if (options.activeClass) screens[i].$block.removeClass(options.activeClass);
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
		if (marquee.animated) return false;
		if (!effect.move || screens[marquee.index].ratio*marquee.position >= screens[marquee.index].ratio-1) {
			var position = 1-Math.abs(screens[marquee.index].ratio*marquee.position-screens[marquee.index].ratio);
			if (marquee.index>=0) effect.hide(screens[marquee.index].$block, position, marquee.size, screens[marquee.index].ratio);
			if (marquee.index<screens.length-1) effect.show(screens[marquee.index+1].$block, position, marquee.size, screens[marquee.index+1].ratio);
		} else {
			if (marquee.index>=0) effect.move(screens[marquee.index].$block, screens[marquee.index].ratio*marquee.position, marquee.size, screens[marquee.index].ratio);
			if (marquee.index<screens.length-1) effect.show(screens[marquee.index+1].$block, 0, marquee.size, screens[marquee.index+1].ratio);
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

	// var triggerScrollEvent = function(){
	// 	$frame.triggerHandler('scroll', {
	// 		index: marquee.index,
	// 		position: marquee.position,
	// 		progress: marquee.progress,
	// 		size: marquee.size,
	// 		y: scroll.y
	// 	});
	// };

	// {fn} on scroll
	marquee.onScroll = function(){
		index = 0;
		marquee.update();
		// marquee.draw();
		if (app.device.isMobile) marquee.callScreensAPI();
		if (scroll.moved) {
			var position = scroll[settings.vertical ? 'y' : 'x'] - scroll[settings.vertical ? 'pointY' : 'pointX'];
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
		// triggerScrollEvent();
	};

	// interactive
	marquee.grabTimer = false;
	var interactiveStart = function(){
		clearTimeout(marquee.grabTimer);
		if (!marquee.scrolling) {
			//$frame.addClass('i-drag');
			marquee.scrolling = true;
		}
	};
	var interactiveEnd = function(){
		if (marquee) clearTimeout(marquee.grabTimer);
		if (marquee && marquee.scrolling) {
			//$frame.removeClass('i-drag');
			marquee.scrolling = false;
		}
	};

	// {event} before wheel snap
	scroll.on('beforeWheelSnap', function(){
		index = 0;
		for (var i=0; i<screens.length; i++) {
			if (scroll[settings.vertical ? 'y' : 'x']-marquee.size/2 <= -screens[i].offset && scroll[settings.vertical ? 'y' : 'x']+marquee.size/2 >= -screens[i].offset-screens[i].size) index = i;
		};
		scroll.absStartX = settings.vertical ? 0 : -screens[index].offset;
		scroll.absStartY = -settings.vertical ? -screens[index].offset : 0;
		marquee.setLimits(index);
	});

	// {fn} on scroll end
	marquee.onScrollEnd = function(){
		// marquee.refresh();
		marquee.onScroll();
		app.utils.raf(marquee.refresh);
		// triggerScrollEvent();
	};

	// {fn} refresh
	marquee.refresh = function(){
		marquee.update();
		// marquee.draw();
		marquee.callScreensAPI();
		marquee.setLimits(marquee.index);
	};

	// {fn} resize
	marquee.resize = function(){
		if (!marquee) return false;
		//app.$dom.root.addClass('root_resize');
		resize();
		if (marquee.enabled) screens[marquee.index].$block.triggerHandler('endShow');
		var y = scroll.y;
		scroll.refresh();
		if (y !== scroll.y){
			scroll.scrollBy(0, y - scroll.y, 0);
		}
		marquee.refresh();
		marquee.updateState();
		//app.$dom.root.removeClass('root_resize');
	};

	// {fn} enable
	marquee.enable = function(){
		//$frame.addClass('marquee_enabled');
		marquee.enabled = true;
		scroll.enable();
		marquee.enableKeyboard();
		$frame.on('dragstart.marquee', function(){
			return false;
		});
	};

	// {fn} disable
	marquee.disable = function(){
		//$frame.removeClass('marquee_enabled');
		marquee.enabled = false;
		scroll.disable();
		marquee.disableKeyboard();
		$frame.off('dragstart.marquee');
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

	// {event} scroll end
	scroll.on('animate', function(){
		screens[marquee.index].$block.triggerHandler('leave');
	});

	// {event} window resize
	if (!app.device.isMobile){
		app.$dom.window.on('resize', marquee.resize);
	}

	// set limits on first screen
	marquee.setLimits(0);

	// {fn} scroll to
	marquee.scrollTo = function(index, duration){
		duration = duration===undefined ? settings.duration : duration;
		scroll.goToPage(!settings.vertical ? index : 0, settings.vertical ? index : 0, duration, IScrollStatic.utils.ease.cubicOut);
		if (duration==0) marquee.refresh();
	};

	// {fn} prev
	marquee.prev = function(duration){
		if (marquee.scrolling) return false;
		duration = duration===undefined ? settings.duration : duration;
		var remaining = (-scroll.y - screens[marquee.index].offset);
		if (settings.vertical && remaining) {
			scroll.scrollBy(0, Math.min(remaining, marquee.size), duration, IScrollStatic.utils.ease.cubicOut);
		} else if (settings.vertical && scroll.y<=-marquee.size) {
			scroll.scrollBy(0, marquee.size, duration, IScrollStatic.utils.ease.cubicOut);
		} else if (marquee.index>0) {
			scroll.prev(duration, IScrollStatic.utils.ease.cubicOut);
		}
	};

	// {fn} next
	marquee.next = function(duration){
		if (marquee.scrolling) return false;
		duration = duration===undefined ? settings.duration : duration;
		var remaining = (screens[marquee.index].offset + screens[marquee.index].size) - (-scroll.y + marquee.size)
		if (remaining>marquee.size*0.1 && settings.vertical) {
			scroll.scrollBy(0, -Math.min(remaining, marquee.size), duration, IScrollStatic.utils.ease.cubicOut);
		} else if (marquee.index<screens.length-1) {
			scroll.next(duration, IScrollStatic.utils.ease.cubicOut);
		}
	};

	// {fn} get marquee param
	marquee.get = function(parameter){
		return marquee[parameter];
	};

	// {fn} destroy marquee
	marquee.destroy = function(){
		marquee.disable();
		screens[marquee.index].$block.triggerHandler('fullHide');
		$frame.removeData('marquee');
		scroll.destroy();
		$frame = null;
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
		marquee.prev();
	});

	// {event} click on next
	if (settings.navNext) settings.navNext.on('click', function(){
		marquee.next();
	});

	// {event} enable keyboard
	var keyboardEventName = 'keydown.marquee-' + (name ? name : '') + (settings.vertical ? 'v' : 'h');
	marquee.enableKeyboard = function(){
		if (!app.device.support.touch) app.$dom.document.on(keyboardEventName, function(e){
			if (!$(e.target).is('input,textarea,select')) {
				if (e.which==(settings.vertical ? 38 : 37)) marquee.prev();
				if (e.which==(settings.vertical ? 40 : 39)) marquee.next();
			}
		});
	};

	// {event} disable keyboard
	marquee.disableKeyboard = function(){
		if (!app.device.support.touch) app.$dom.document.off(keyboardEventName);
	};

	marquee.activate = function(){
		var $screen = screens[marquee.index].$block;
		$frame.triggerHandler('init', { marquee: marquee });
		$screen.triggerHandler('show');
		$screen.triggerHandler('fullShow');
		marquee.updateState();
		if (settings.index) {
			marquee.scrollTo(settings.index=='last' ? screens.length-1 : settings.index, 0);
			scroll._execEvent('scrollEnd');
			settings.index = false;
		}
	};

	// api
	marquee.scroll = scroll;
	marquee.screens = screens;
	$frame.data('marquee', {
		screens: screens,
		scrollTo: marquee.scrollTo,
		get: marquee.get,
		scroll: scroll,
		updateState: marquee.updateState,
		update: marquee.onScroll,
		resize: marquee.resize,
		activate: marquee.activate,
		enable: marquee.enable,
		disable: marquee.disable,
		destroy: marquee.destroy,
		enableKeyboard: marquee.enableKeyboard,
		disableKeyboard: marquee.disableKeyboard
	});

	return marquee;
};
