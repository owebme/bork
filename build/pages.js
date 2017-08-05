var _path = require('path'),
    glob = require('glob');
    
module.exports = function(){

    gulp.task('pages', function(callback) {
    	glob(_path.join(process.cwd(), '/build/pages/', '**', '*.json'), function(err, items) {
    		var count = 0,
    			cnt = items.length;

    		items.forEach(function(file) {
    			fs.readFile(file, "utf8", function(err, data){
    		        if (!err){
    					var path = JSON.parse(data),
    						output = path.output;

    					console.log("start: " + output);

    					if (path.css){
    						var js = [];
    						if (path.js){
    							js = path.js;
    							if (path.riot){
    								js = js.concat(path.riot);
    							}
    						}
    						combiner(
    							gulp.src('assets/css/' + path.css),
    							sass(),
    				            purify(js, {
    				                minify: true,
    				                whitelist: ['d-mobile', 'd-no-mobile', 'd-phone', 'd-no-phone', 'd-tablet', 'd-no-tablet', 'm-touch', 'm-no-touch', 'viewport-emitter']
    				            }),
    				    		csso(),
    				            autoprefixer({
    				    			browsers: ['last 2 versions'],
    				    			cascade: false
    				    		}),
    				            base64({
    				                baseDir: './',
    				                extensions: ['svg', 'png', 'jpg'],
    				                maxImageSize: 16*1024, // bytes
    				                debug: false
    				            }),
    							rename('main.css'),
    							gulp.dest('./public/build/' + output + '/css'),
    							browserSync.stream()
    						).on('error', notify.onError({
    							"sound": false,
    						}));
    					}
    					async.waterfall([
    						function(fn){
    							if (path.riot){
    								gulp.src(path.riot)
    								.pipe(riot())
    								.pipe(concat('templates.js'))
    								.pipe(uglify())
    								.pipe(gulp.dest('./public/build/' + output + '/js'))
    								.on('end', function(){
    									fn(null, true);
    								})
    							}
    						},
    						function(arg, fn){
    							if (path.js){
    								if (path.riot){
    									path.js.push('public/build/' + output + '/js/templates.js');
    								}
    								gulp.src(path.js)
    									.pipe(concat('main.js'))
    									.pipe(uglify())
    									.pipe(gulp.dest('./public/build/' + output + '/js'));
    							}
    							fn(null, true);
    						}
    					],
    					function(err, results){
    						count++;
    						console.log("build: " + output);
    						if (cnt == count){
    							console.log("Building finish");
    							callback();
    						}
    					});
    				}
    		    });
    		});
    	});
    });
}
