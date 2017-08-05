(function(app, utils){

	utils.random = function(min,max){
		return Math.floor(Math.random()*(max-min+1)+min);
	};

	utils.copyArray = function(arr) {
	  var newObj = arr === null ? null : (!utils.isObject(arr) ? [] : {});
	  for (var i in arr) {
	    if (typeof(arr[i]) === 'object' && i !== 'prototype') {
	      newObj[i] = utils.copyArray(arr[i]);
	    } else {
	      newObj[i] = arr[i];
	    }
	  }
	  return newObj;
    };

	utils.sortArray = function(arr, field, direction){
		var data = _.sortBy(arr, function(item){
			return item[field];
		});
		if (direction === "desc"){
			return data.reverse();
		}
		else {
			return data;
		}
	};

	utils.sortByDate = function(arr, field, direction){
		if (!window.moment) return arr;
		var data = _.sortBy(arr, function(item){
			return moment(item[field]).format("X");
		});
		if (direction === "desc"){
			return data.reverse();
		}
		else {
			return data;
		}
	};

	utils.isArray = function(arr){
		if (arr && Object.prototype.toString.call(arr) === '[object Array]'){
		    return true;
		}
	};

	utils.isFunction = function(fn){
		if (fn && typeof fn === 'function'){
		    return true;
		}
	};

	utils.isNodeList = function(g) {
		var f = /^\[object (HTMLCollection|NodeList|Object)\]$/;
		if (!g) {
			return false
		}
		if (typeof g.length !== "number") {
			return false
		}
		if (typeof g[0] === "object" && (!g[0] || !g[0].nodeType)) {
			return false
		}
		return f.test(Object.prototype.toString.call(g));
	};

	utils.fixTouchScroll = function($container, $scroll){
		var touchY = null,
			scrollY = null;

		$container.on('touchmove MSPointerMove', function(e){
			if (scrollY === 0){
				var lastTouchY = e.changedTouches[0].clientY;
				if (lastTouchY < touchY){
					touchY = 0;
					e.preventDefault();
				}
				else {
					if (app.device && app.device.isIOS){
						setTimeout(function(){
							touchY = lastTouchY;
						}, 1000);
					}
					else {
						touchY = lastTouchY;
					}
				}
			}
		});

		$scroll.on('scroll', function(){
			scrollY = this.scrollTop;
		});
	};

	utils.raf = function(callback){
		var func = window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.oRequestAnimationFrame ||
			window.msRequestAnimationFrame;
		if (func) {
			return func(callback);
		} else {
			return window.setTimeout(callback, 1000 / 60);
		}
	};

	utils.caf = function(frame){
		var func = window.cancelAnimationFrame ||
			window.webkitCancelRequestAnimationFrame ||
			window.mozCancelRequestAnimationFrame ||
			window.oCancelRequestAnimationFrame ||
			window.msCancelRequestAnimationFrame ||
			clearTimeout;
		func(frame);
		frame = null;
	};

	utils.support = {transitions: Modernizr.csstransitions},
	utils.transEndEventNames = {'WebkitTransition': 'webkitTransitionEnd', 'MozTransition': 'transitionend', 'OTransition': 'oTransitionEnd', 'msTransition': 'MSTransitionEnd', 'transition': 'transitionend'};
	utils.transEndEventName = utils.transEndEventNames[Modernizr.prefixed('transition')];
	utils.animEndEventNames = {'WebkitAnimation': 'webkitAnimationEnd', 'MozAnimation': 'animationend', 'OAnimation': 'oAnimationEnd', 'msAnimation': 'MSAnimationEnd', 'animation': 'animationend'};
	utils.animEndEventName = utils.animEndEventNames[Modernizr.prefixed('animation')];

	utils.onEndTransition = function(el, callback){
		var el = _.isElement(el) ? el : el[0];
		var onEndCallbackFn = function( ev ) {
			if ( utils.support.transitions ) {
				if( ev.target != this ) return;
				this.removeEventListener( utils.transEndEventName, onEndCallbackFn );
			}
			if( callback && typeof callback === 'function' ) { callback.call(this); }
		};
		if( utils.support.transitions ) {
			el.addEventListener( utils.transEndEventName, onEndCallbackFn );
		}
		else {
			onEndCallbackFn();
		}
	};

	utils.onEndAnimation = function(el, callback){
		var el = _.isElement(el) ? el : el[0];
		var onEndCallbackFn = function( ev ) {
			if ( utils.support.transitions ) {
				if( ev.target != this ) return;
				this.removeEventListener( utils.animEndEventName, onEndCallbackFn );
			}
			if( callback && typeof callback === 'function' ) { callback.call(this); }
		};
		if( utils.support.transitions ) {
			el.addEventListener( utils.animEndEventName, onEndCallbackFn );
		}
		else {
			onEndCallbackFn();
		}
	};

	utils.onLoadImage = function(url, callback) {
		var img = new Image(),
			loaded = false;

	    function loadHandler() {
	        if (loaded) return;
	        loaded = true;
			if (callback) callback(true);
	    }
		function errHandler() {
	        if (callback) callback(false);
	    }
		img.src = url;
		img.onerror = errHandler;
		img.onload = loadHandler;
	    if (img.complete) loadHandler();
	};

	utils.getSizeImage = function(url, callback) {
	    var img = new Image(),
			loaded = false;

	    function loadHandler() {
	        if (loaded) return;
	        loaded = true;
			if (callback) callback(img.naturalWidth, img.naturalHeight);
	    }
		function errHandler() {
	     	if (callback) callback(false);
	    }
		img.src = url;
		img.onerror = errHandler;
		img.onload = loadHandler;
	    if (img.complete) loadHandler();
	};

	utils.getBgImage = function(img) {
		var style = img.currentStyle;
		if (!style) {
			style = window.getComputedStyle(img, false)
		}
		if (style.backgroundImage.indexOf("url(") === 0) {
			return style.backgroundImage.slice(4, -1).replace(/"/g, "")
		}
		return null
	};

	utils.getBoundingClientRect = function(elem){
		var a = elem.getBoundingClientRect();
		return {
			top: a.top,
			right: a.right,
			bottom: a.bottom,
			left: a.left,
			width: a.width || a.right - a.left,
			height: a.height || a.bottom - a.top
		}
	};

	utils.getScroll = function(scroll) {
        var x = scroll.x * -1,
            y = scroll.y * -1,
			maxX = scroll.maxScrollX * -1,
			maxY = scroll.maxScrollY * -1;
        return {x: x, y: y, maxX: maxX, maxY: maxY};
    };

	utils.throttle = function(fn, delay) {
		var allowSample = true;

		return function(e) {
			if (allowSample) {
				allowSample = false;
				setTimeout(function() { allowSample = true; }, delay);
				fn(e);
			}
		};
	};

	utils.debounce = function(fn, timeout, invokeAsap, ctx) {
		if (arguments.length == 3 && typeof invokeAsap != 'boolean') {
			ctx = invokeAsap;
			invokeAsap = false;
		}

		var timer;

		return function() {

			var args = arguments;
            ctx = ctx || this;

			invokeAsap && !timer && fn.apply(ctx, args);

			clearTimeout(timer);

			timer = setTimeout(function() {
				!invokeAsap && fn.apply(ctx, args);
				timer = null;
			}, timeout);

		};
	};

	utils.indexOf = function(arr, value, from) {
		for (var i = from || 0, l = (arr || []).length; i < l; i++) {
			if (arr[i] == value) return i;
		}
		return -1;
  	};

	utils.inArray = function(arr, value) {
		return utils.indexOf(arr, value) != -1;
	};

	utils.trim = function(text) {
		return (text && String(text) || '').replace(/^\s+|\s+$/g, '');
	};

	utils.underscored = function(str) {
		return utils.trim(str).replace(/([a-z\d])([A-Z]+)/g, '$1_$2').replace(/[-\s]+/g, '_').toLowerCase();
	};

	utils.deepExtend = function(target, source) {
	    for (var prop in source) {
	        if (source.hasOwnProperty(prop)) {
	            if (target[prop] && typeof source[prop] === 'object') {
	                utils.deepExtend(target[prop], source[prop]);
	            }
	            else {
	                target[prop] = source[prop];
	            }
	        }
	    }
	    return target;
	};

	utils.deepFindWhere = function(obj, p, v, result){
	    if (obj instanceof Array) {
	        for (var i = 0; i < obj.length; i++) {
	            result = utils.deepFindWhere(obj[i], p, v, result);
	        }
	    }
	    else {
	        for (var prop in obj) {
	            if (prop == p) {
	                if (obj[prop] == v) {
	                    result = obj;
	                }
	            }
	            if (obj[prop] instanceof Object || obj[prop] instanceof Array){
	                result = utils.deepFindWhere(obj[prop], p, v, result);
				}
	        }
	    }
	    return result;
	};

	utils.numberFormat = function(number, dec, dsep, tsep) {
		if (isNaN(number) || number == null) return '';

		number = parseInt(number).toFixed(~~dec);
		tsep = typeof tsep == 'string' ? tsep : ',';

		var parts = number.split('.'),
			fnums = parts[0],
			decimals = parts[1] ? (dsep || '.') + parts[1] : '';

		return fnums.replace(/(\d)(?=(?:\d{3})+$)/g, '$1' + tsep) + decimals;
	};

	utils.clean = function(field, def) {
		field = utils.trim(field);
		return field ? field : (def !== undefined ? def : null);
	};

	utils.isObject = function(obj) { return Object.prototype.toString.call(obj) === '[object Object]'};

	utils.isEmail = function(str){
		return str.match(/.+@.+\..+/i);
	};

	utils.newId = function(){
		return String(Math.round(new Date().getTime() / 1000));
	};

	utils.isJSON = function(str){
	    try {
	        JSON.parse(str);
	    } catch (e) {
	        return false;
	    }
	    return true;
	};

	utils.opener = function(url){
		var otherWindow = window.open();
		otherWindow.opener = null;
		otherWindow.location = url;
	};

	utils.emailLinkProvider = function(value){
		if (value && value.length){
				 if (value.match(/gmail\.com/i)) return 'https://mail.google.com/mail/';
			else if (value.match(/[mail|inbox|list|bk]\.ru/i)) return 'https://e.mail.ru/messages/inbox/';
			else if (value.match(/[yandex|ya]\.ru/i)) return 'https://mail.yandex.ru/';
			else if (value.match(/rambler\.ru/i)) return 'https://mail.rambler.ru/';
		}
	};

	utils.getDateNow = function(){
		var d = new Date();
		var hour = d.getHours();
		var minute = d.getMinutes();
		var seconds = d.getSeconds();
		var month = d.getMonth() + 1;
		var day = d.getDate();
		var year = d.getFullYear();
		if (hour < 10) hour = "0"+hour;
		if (minute < 10) minute = "0"+minute;
		if (seconds < 10) seconds = "0"+seconds;
		if (month < 10) month = "0"+month;
		if (day < 10) day = "0"+day;

		return year+"-"+month+"-"+day+" "+hour+":"+minute+":"+seconds;
	};

	Date.prototype.addDays = function(days) {
	    var date = new Date(this.valueOf());
	    date.setDate(date.getDate() + days);
	    return date;
	};

	utils.getDates = function(startDate, stopDate) {
	    var dateArray = new Array();
	    var currentDate = startDate;
	    while (currentDate <= stopDate) {
	        dateArray.push(new Date(currentDate));
	        currentDate = currentDate.addDays(1);
	    }
	    return dateArray;
	};

	utils.hexToRgb = function(hex, opacity) {
		var h = hex.replace('#', '');
		h = h.match(new RegExp('(.{'+h.length/3+'})', 'g'));

		for(var i=0; i<h.length; i++)
		h[i] = parseInt(h[i].length==1? h[i]+h[i]:h[i], 16);

		if (typeof opacity !== undefined) h.push(opacity);

		return 'rgba('+h.join(',')+')';
	};

	utils.supportClipboard = function(){
		if (window.clipboardData && window.clipboardData.setData || document.queryCommandSupported && document.queryCommandSupported("copy")) {
			return true;
		}
		else {
			return false;
		}
	};

	utils.copyToClip = function(text){
	    if (window.clipboardData && window.clipboardData.setData) {
	        // IE specific code path to prevent textarea being shown while dialog is visible.
	        return clipboardData.setData("Text", text);

	    } else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
	        var textarea = document.createElement("textarea");
	        textarea.textContent = text;
	        textarea.style.position = "fixed";  // Prevent scrolling to bottom of page in MS Edge.
	        document.body.appendChild(textarea);
	        textarea.select();
	        try {
	            return document.execCommand("copy");  // Security exception may be thrown by some browsers.
	        } catch (ex) {
	            console.warn("Copy to clipboard failed.", ex);
	            return false;
	        } finally {
	            document.body.removeChild(textarea);
	        }
	    }
	};

	utils.bbUpdate = function(obj, callback){
		obj.on("update", function(e){
	        var prop = e.data && e.data.transaction && e.data.transaction.length && e.data.transaction[0].path ? e.data.transaction[0].path[0] : null,
	            value = e.data && e.data.transaction && e.data.transaction.length ? e.data.transaction[0].value : null;

	        callback(prop, value, e);
		});
    };

	utils.getCookie = function(name){
		var matches = document.cookie.match(new RegExp(
			"(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
		));
		return matches ? decodeURIComponent(matches[1]) : undefined;
	};

	utils.setCookie = function(name, value, options){
	  options = options || {};

	  var expires = options.expires;

	  if (typeof expires == "number" && expires) {
	    var d = new Date();
	    d.setTime(d.getTime() + expires * 1000);
	    expires = options.expires = d;
	  }
	  if (expires && expires.toUTCString) {
	    options.expires = expires.toUTCString();
	  }

	  value = encodeURIComponent(value);

	  var updatedCookie = name + "=" + value;

	  for (var propName in options) {
	    updatedCookie += "; " + propName;
	    var propValue = options[propName];
	    if (propValue !== true) {
	      updatedCookie += "=" + propValue;
	    }
	  }

	  document.cookie = updatedCookie;
    };

	if (window.moment) utils.moment = window.moment;

	if (window._) _.extend(_, utils);
	else window._ = utils;

	app.utils = window._;

})(app, app.utils);
