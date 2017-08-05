(function(loader){
	// history
	loader.history = [];
	// {fn} load resources
	loader.resources = function(resources, complete, callback){
		// check callbacks
		complete = complete || $.noop;
		callback = callback || $.noop;
		// unchached resources
		var unchached = [];
		for (var i=0; i<resources.length; i++) {
			if (loader.history.indexOf(resources[i])<0) unchached.push(resources[i]);
		};
		// if resources is empty
		if (!unchached.length) return complete();
		// load
		Modernizr.load({
			load: unchached,
			callback: function(url){
				loader.history.push(url);
				callback();
			},
			complete: complete
		});
	};
	// {fn} load images
	loader.images = function($scope, complete, callback){
		var loaded = 0;
		// check callbacks
		complete = complete || $.noop;
		callback = callback || $.noop;
		// init plugin
		$scope.imagesLoaded({ background: '.bg-cover' }).always(complete).progress(function(instance){
			loaded++;
			callback(loaded, instance.images.length)
		});
	}
})(app.loader);
