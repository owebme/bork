(function(sizes, $dom){
	// {fn} update sizes
	var updateSizes = function(){
		sizes.width = $dom.window.width();
		sizes.height = parseInt(window.innerHeight,10);
	};
	// {event} window resize
	$dom.window.on('resize.app orientationchange.app', updateSizes);
	// init
	updateSizes();
})(app.sizes, app.$dom);
