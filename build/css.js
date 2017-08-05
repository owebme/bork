module.exports = function(){

    gulp.task('css', function(callback) {
        fs.readFile('./build/pages/home.json', "utf8", function(err, data){
            if (!err){
                var path = JSON.parse(data),
                    output = path.output;

                if (path.css){
                    combiner(
                		gulp.src('assets/css/' + path.css),
                		sass(),
                		autoprefixer({
                			browsers: ['last 2 versions'],
                			cascade: false
                		}),
                        rename('main.css'),
                        gulp.dest('./public/build/' + output + '/css'),
                		browserSync.stream()
                	).on('error', notify.onError({
                		"sound": false,
                	}));
                }
                callback();
            }
        });
    });

    gulp.task('css-build', function() {
    	return combiner(
            gulp.src('assets/css/style.scss'),
    		sass(),
            purify(['assets/js/sections/**/*.js', 'public/compile.html'], {
                minify: true,
                whitelist: ['d-mobile', 'd-no-mobile', 'd-phone', 'd-no-phone', 'd-tablet', 'd-no-tablet', 'animated', 'player', 'player__container', 'player__screen', 'player__close']
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
            rename('style.min.css'),
    		gulp.dest('assets/css'),
    		browserSync.stream()
    	).on('error', notify.onError({
    		"sound": false,
    	}));
    });

    gulp.task('css-gs', function() {
        return combiner(
            gulp.src(['assets/css/style.min.css', 'public/compile.html']),
            gs.run({}, {
                classes: ['d-mobile', 'd-no-mobile', 'd-phone', 'd-no-phone', 'd-tablet', 'd-no-tablet', '-loading', '-ready', '-active', '-currentSlide', 'no-scroll', 'player'],
                ids: '*'
            }),
            gulp.dest('public/dist'),
            browserSync.stream()
        ).on('error', notify.onError({
            "sound": false,
        }));
    });

}
