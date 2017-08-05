app.plugins.marqueeEffects = function(options){
	var effects = {},
		options = options || {},
		prefixed = app.prefixed,
		isPhone = options.isPhone === true || app.device.isPhone;

	if (options.method == "static"){
		effects.show = function($block, position, size, ratio, offset){
			$block[0].style[prefixed.transform] = 'translateY(' + Math.round( (offset || 0) + size-position*size) + 'px) translateZ(0)';
		};
		effects.hide = function($block, position, size, ratio, offset){
			$block[0].style[prefixed.transform] = 'translateY(' + Math.round( (offset || 0) + -(ratio-1)*size - (position*size)) + 'px) translateZ(0)';
		};
		effects.move = function($block, position, size){
			$block[0].style[prefixed.transform] = 'translateY(' + Math.round(-position*size) + 'px) translateZ(0)';
		};
	}
	else {
		// light effect
		effects.light = {};
		effects.light.show = function($block, position, size, ratio){
			$block[0].style.opacity = 1;
			$block[0].style[prefixed.transform] = 'translateY(' + Math.round(size-position*size) + 'px) translateZ(0)';
			if (position==0) $block[0].style[prefixed.transform] = 'translateY(110%)';
		};
		effects.light.hide = function($block, position, size, ratio){
			$block[0].style.opacity = (1-position*0.4).toFixed(3);
			$block[0].style[prefixed.transform] = 'translateY(' + Math.round(-(ratio-1)*size - (position*size*0.5)) + 'px) translateZ(0)';
			if (position==1) $block[0].style[prefixed.transform] = 'translateY(-110%)';
			if (position==0) $block[0].style[prefixed.transform] = 'translateY(' + Math.round(-(ratio-1)*size) + 'px) translateZ(0)';
		};
		effects.light.move = function($block, position, size){
			$block[0].style.opacity = 1;
			$block[0].style[prefixed.transform] = 'translateY(' + Math.round(-position*size) + 'px) translateZ(0)';
		};
		// space effect
		effects.space = {};
		effects.space.show = function($block, position){
			$block[0].style.opacity = 0.33+position*0.67;
			var transform = '';
			if (position==0) {
				transform = 'translate3d(110%, 0, 0)';
			} else if (isPhone) {
				transform = 'perspective(500px) translate3d(' + (-8+8*position) + '%, 0, 0) rotateY(' + (-6+position*6) + 'deg) scale(' + (0.8+position*0.2) + ')';
			} else {
				transform = 'perspective(500px) translate3d(' + (-4+4*position) + '%, 0, 0) scale(' + (0.9+position*0.1) + ')';
				if (!app.device.isFirefox) transform = transform + 'rotateY(' + (-4+position*4) + 'deg)';
			}
			$block[0].style[prefixed.transform] = transform;
		};
		effects.space.hide = function($block, position){
			$block[0].style.opacity = 1;
			$block[0].style[prefixed.transform] = 'translate3d(' + (-100*position) + '%, 0, 0)';
			if (position==1) $block[0].style[prefixed.transform] = 'translate3d(-110%, 0, 0)';
		};
		// fold effect
		effects.fold = {};
		effects.fold.show = function($block, position){
			$block[0].style.opacity = 1;
			$block[0].style[prefixed.transform] = 'translateY(' + (100-position*100) + '%)';
		};
		effects.fold.hide = function($block, position){
			$block[0].style.opacity = 1-position*0.67;
			$block[0].style[prefixed.transform] = 'perspective(500px) translateY(' + (4*position) + '%) rotateX(' + (-position*3) + 'deg) scale(' + (1-position*0.05) + ')';
			if (position==1) $block[0].style[prefixed.transform] = 'translateY(-101%)';
		};
	}

	return effects;
};
