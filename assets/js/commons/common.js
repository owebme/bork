(function($){

	/* --- App interface --- */
	app.define("page");
	app.define("sections");
	app.define("components");
	app.define("config");
	app.define("effects");
	app.define("sizes");
	app.define("utils");
	app.define("plugins");
	app.define("device");
	app.define("loader");
	app.define("dom");

	/* --- Root blocks --- */
	app.$dom = {
		html: $('html'),
		body: $('body'),
		document: $(document),
		window: $(window),
		root: $('#app')
	};

    app.dom.selectors = {
        ROOT: ".page",
        SECTION: "section,.section",
		SECTION_ACTIVE: false,
		SECTION_ANIMATED: false
    };

    app.dom.attributes = {
        PAGE_TYPE: "data-page-type",
        SECTION_TYPE: "data-section-type",
        JUMP_SECTION_NAME: "data-page-jump-name",
        COMPONENT_LIST: "data-component-list"
    };

	/* --- Keys vars --- */
	app.keys = {
		LEFT: 37,
	    UP: 38,
	    RIGHT: 39,
	    DOWN: 40,
	    DEL: 8,
	    TAB: 9,
	    RETURN: 13,
	    ENTER: 13,
	    ESC: 27,
	    PAGEUP: 33,
	    PAGEDOWN: 34,
	    SPACE: 32
	};

	window.KEY = app.keys;

	/* --- Prefixed styles --- */
	app.prefixed = {
		'transform': Modernizr.prefixed('transform'),
		'transform-origin': Modernizr.prefixed('transformOrigin'),
		'transition': Modernizr.prefixed('transition'),
		'transition-duration': Modernizr.prefixed('transitionDuration')
	};

	$$ = window.jQuery || window.Zepto;

	if (window.moment) moment.locale('ru');

	/*** --- Dataset helper --- ***/
	$.fn.api = function(key){
		return this.data(key) ? this.data(key) : this.data(key, {}).data(key);
	};

	/* --- Fast click onTouch device --- */
	if (app.device.isMobile && window.FastClick && 'addEventListener' in document) {
		document.addEventListener('DOMContentLoaded', function() {
			FastClick.attach(document.body);
		}, false);
	}

})($);
