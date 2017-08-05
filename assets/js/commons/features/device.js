(function(device){

	var html = document.getElementsByTagName("html")[0];

	/* --- Mobile --- */
	device.support = Modernizr;

	/* --- Mobile --- */
	device.isMobile = device.support.touch;
	html.classList.add(device.isMobile ? 'd-mobile' : 'd-no-mobile');

	/* --- Retina --- */
	device.isRetina = (window.devicePixelRatio && window.devicePixelRatio>1);
	html.classList.add(device.isRetina ? 'd-retina' : 'd-no-retina');

	/* --- sizeCheck --- */
	var sizeCheck = function(){
		var width = document.documentElement.clientWidth || document.body.clientWidth || window.innerWidth;

		device.isPhone = (width < 768);
		device.isTablet = (width < 1025 && width > 767);
		device.orientation = (device.isTablet && width < 1025 && width > 991 || device.isPhone && width > 480 ? "landscape" : "portrait");

		html.classList.add(device.isPhone ? 'd-phone' : 'd-no-phone');
		html.classList.remove(device.isPhone ? 'd-no-phone' : 'd-phone');
		html.classList.add(device.isTablet ? 'd-tablet' : 'd-no-tablet');
		html.classList.remove(device.isTablet ? 'd-no-tablet' : 'd-tablet');

		device.is = device.isPhone ? 'phone' : (device.isTablet ? 'tablet' : 'desktop');
	};
	window.addEventListener((device.isMobile ? 'orientationchange' : 'resize') + '.sizeCheck', sizeCheck);
	sizeCheck();

	device.ua = navigator.userAgent;

	if (navigator.userAgent.match(/(iPhone)/i)) device.isPhone = true;

	/* --- iOS --- */
	if (navigator.userAgent.match(/iPad/i)) {
		html.classList.add('d-ipad');
		device.isIPad = true;
	};
	if (navigator.userAgent.match(/(iPhone|iPod touch)/i)) {
		html.classList.add('d-iphone');
		device.isIPhone = true;
	};
	if (navigator.userAgent.match(/(iPad|iPhone|iPod touch)/i)) {
		html.classList.add('d-ios');
		device.isIOS = true;
		var expr = navigator.userAgent.match(/.*CPU.*OS (\d)_(\d)/i);
		device.verOS = expr && expr[1] ? expr[1] + (expr[2] ? "." + expr[2] : "") : false;
	}
	else {
		html.classList.add('d-no-ios');
	};
	if (navigator.userAgent.match(/.*CPU.*OS 7_\d/i)) {
		html.classList.add('d-ios7');
		device.isIOS7 = true;
	};
	if (navigator.userAgent.match(/Android/i)) {
		html.classList.add('d-android');
		device.isAndroid = true;
		var expr = navigator.userAgent.match(/Android (\d)\.(\d)/i);
		device.verOS = expr && expr[1] ? expr[1] + (expr[2] ? "." + expr[2] : "") : false;
	};

	if (app.device.isMobile){
		device.os = device.isAndroid ? 'android' : (device.isIOS ? 'ios' : 'unknown');
	}

	device.isWin = navigator.platform.indexOf("Win") > -1;
	device.isMac = navigator.platform.indexOf("Mac") > -1;
	device.isLinux = navigator.platform.indexOf("Linux") > -1;

	html.classList.add(device.isMac ? 'd-macOS' : 'd-no-macOS');

	device.platform = device.isWin ? 'win' : (device.isMac ? 'mac' : (device.isLinux ? 'linux' : 'unknown'));

	device.isStorage = Storage !== undefined;

	var _ua = device.ua;
	device.browser = {
	  version: (_ua.match( /.+(?:me|ox|on|rv|it|era|opr|ie)[\/: ]([\d.]+)/ ) || [0,'0'])[1],
	  opera: (/opera/i.test(_ua) || /opr/i.test(_ua)),
	  msie: (/msie/i.test(_ua) && !/opera/i.test(_ua) || /trident\//i.test(_ua)),
	  msie6: (/msie 6/i.test(_ua) && !/opera/i.test(_ua)),
	  msie7: (/msie 7/i.test(_ua) && !/opera/i.test(_ua)),
	  msie8: (/msie 8/i.test(_ua) && !/opera/i.test(_ua)),
	  msie9: (/msie 9/i.test(_ua) && !/opera/i.test(_ua)),
	  mozilla: /firefox/i.test(_ua),
	  chrome: /chrome/i.test(_ua),
	  safari: (!(/chrome/i.test(_ua)) && /webkit|safari|khtml/i.test(_ua)),
	  iphone: /iphone/i.test(_ua),
	  ipod: /ipod/i.test(_ua),
	  iphone4: /iphone.*OS 4/i.test(_ua),
	  ipod4: /ipod.*OS 4/i.test(_ua),
	  ipad: /ipad/i.test(_ua),
	  android: /android/i.test(_ua),
	  bada: /bada/i.test(_ua),
	  mobile: /iphone|ipod|ipad|opera mini|opera mobi|iemobile|android/i.test(_ua),
	  msieMobile: /iemobile/i.test(_ua),
	  safariMobile: /iphone|ipod|ipad/i.test(_ua),
	  operaMobile: /opera mini|opera mobi/i.test(_ua),
	  operaMini: /opera mini/i.test(_ua),
	  mac: /mac/i.test(_ua),
	  searchBot: /(yandex|google|stackrambler|aport|slurp|msnbot|bingbot|twitterbot|ia_archiver|facebookexternalhit)/i.test(_ua)
	};

	/* --- Chrome --- */
	device.isChrome = device.browser.chrome;
	html.classList.add(device.isChrome ? 'd-chrome' : 'd-no-chrome');

	/* --- Safari --- */
	device.isSafari = device.browser.safari;
	html.classList.add(device.isSafari ? 'd-safari' : 'd-no-safari');

	/* --- Firefox --- */
	device.isFirefox = device.browser.mozilla;
	html.classList.add(device.isFirefox ? 'd-firefox' : 'd-no-firefox');

	/* --- IE --- */
	device.isIE = device.browser.msie;
	html.classList.add(device.isIE ? 'd-ie' : 'd-no-ie');

	if (!device.isIE || device.isIE && device.browser.version > 8){
		html.classList.add('m-progressive-image');
	}

	window.progressiveTimeout = setTimeout(function() {
        document.documentElement.classList.remove('m-progressive-image');
    }, 8000);

	device.get = function(){
		var _ = app.utils;
		return _.extend(_.omit(app.device, ['get', 'support', 'browser']), {
			screen: app.sizes
		});
	}

})(app.define("device"));
