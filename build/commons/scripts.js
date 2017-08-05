module.exports = function(){

    gulp.task('commons.features', function() {
        return gulp.src(['assets/js/libs/modernizr.custom.js',
            'assets/js/commons/app.js',
            'assets/js/commons/features/features.js',
            'assets/js/commons/features/device.js'])
            .pipe(concat('features.js'))
            .pipe(uglify())
            .pipe(gulp.dest('./public/build/commons/js'));
    });

    gulp.task('commons.vendors', function() {
    	return gulp.src(['assets/js/libs/jquery-3.2.1.min.js',
            'assets/js/libs/riot-3.6.0/riot+compiler.update.js',
            'assets/js/libs/underscore-min.js',
            'assets/js/libs/afterlag-js/dist/afterlag.min.js',
            'assets/js/libs/fastclick.js'])
    		.pipe(concat('vendors.js'))
    		.pipe(uglify())
    		.pipe(gulp.dest('./public/build/commons/js'));
    });

    gulp.task('commons.components', function() {
    	return gulp.src(['assets/js/commons/common.js',
            'assets/js/commons/utils.js',
            'assets/js/commons/modules/dom/*.js',
            'assets/js/commons/modules/dom/**/*.js',
            'assets/js/commons/modules/events/EventEmitter.js',
            'assets/js/commons/modules/events/EventEmitterMicro.js',
            'assets/js/commons/modules/events/RAF/RAF.Executor.js',
            'assets/js/commons/modules/events/RAF/RAF.ExecutorShared.js',
            'assets/js/commons/modules/events/RAF/RAF.EmitterIDGenerator.js',
            'assets/js/commons/modules/events/RAF/RAF.Emitter.js',
            'assets/js/commons/modules/events/RAF/RAF.Throttled.js',
            'assets/js/commons/modules/events/RAF/RAF.Controller.js',
            'assets/js/commons/modules/easing/easing.Ease.js',
            'assets/js/commons/modules/easing/easing.KeySpline.js',
            'assets/js/commons/modules/easing/easing.createBezier.js',
            'assets/js/commons/modules/easing/easing.createStep.js',
            'assets/js/commons/modules/easing/easing.cssAliases.js',
            'assets/js/commons/modules/easing/easing.fn.js',
            'assets/js/commons/modules/easing/easing.createPredefined.js',
            'assets/js/commons/modules/clock/clock.js',
            'assets/js/commons/modules/clock/clockShared.js',
            'assets/js/commons/modules/clock/clip.js',
            'assets/js/commons/modules/*.js',
            'assets/js/commons/modules/events/TrackedElement.js',
            'assets/js/commons/modules/events/ElementTracker.js',
            'assets/js/commons/modules/events/ElementEngagement.js',
            'assets/js/commons/modules/events/ViewportEmitter.js',
            'assets/js/plugins/imagesLoaded/imagesLoaded.Queue.js',
            'assets/js/plugins/imagesLoaded/imagesLoaded.QueueItem.js',
            'assets/js/plugins/imagesLoaded/imagesLoaded.LiveQueue.js',
            'assets/js/plugins/imagesLoaded/imagesLoaded.js',
            'assets/js/plugins/define.js',
            'assets/js/commons/base/component.js',
            'assets/js/commons/base/componentRegister.js',
            'assets/js/commons/base/section.js',
            'assets/js/commons/base/page.js',
            'assets/js/components/commons/*.js'])
    		.pipe(concat('components.js'))
    		.pipe(uglify())
    		.pipe(gulp.dest('./public/build/commons/js'));
    });

    gulp.task('commons.plugins.parallax', function() {
        return gulp.src(['assets/js/plugins/scroll/parallax/scroll.ScrollTracker.js',
            'assets/js/plugins/scroll/parallax/scroll.PooledScrollTracker.js',
            'assets/js/plugins/scroll/parallax/scroll.SmoothScrollTracker.js',
            'assets/js/plugins/scroll/parallax/scroll.ElementScrollTracker.js',
            'assets/js/plugins/scroll/parallax/scroll.ParallaxElement.js',
            'assets/js/plugins/scroll/parallax/scroll.ParallaxController.js'])
            .pipe(concat('scroll.Parallax.build.js'))
            .pipe(uglify())
            .pipe(gulp.dest('./assets/js/plugins/scroll'));
    });

    gulp.task('commons.plugins.animation', function() {
        return gulp.src(['assets/js/plugins/scroll/animation/scroll.BaseComponent.js',
            'assets/js/plugins/scroll/animation/scroll.MotionEmitter.js',
            'assets/js/plugins/scroll/animation/scroll.ScrollMotionEmitter.js',
            'assets/js/plugins/scroll/animation/scroll.Animation.js',
            'assets/js/plugins/scroll/animation/scroll.AnimationStarter.js',
            'assets/js/plugins/scroll/animation/scroll.AnimationController.js'])
            .pipe(concat('scroll.Animation.build.js'))
            .pipe(uglify())
            .pipe(gulp.dest('./assets/js/plugins/scroll'));
    });

    gulp.task('app.templates.partials', function() {
    	return gulp.src(['assets/templates/root.html',
            'assets/templates/partials/**/*.html',
            'assets/templates/pages/**/*.html'])
    		.pipe(riot())
    		.pipe(concat('app.templates.partials.js'))
    		.pipe(uglify())
    		.pipe(gulp.dest('./public/build/templates/js'));
    });

    gulp.task('app.templates.sections', function() {
    	return gulp.src(['assets/templates/sections/**/*.html'])
    		.pipe(riot())
    		.pipe(concat('app.templates.sections.js'))
    		.pipe(uglify())
    		.pipe(gulp.dest('./public/build/templates/js'));
    });

    gulp.task('app.templates.modules', function() {
    	return gulp.src(['assets/templates/modules/**/*.html'])
    		.pipe(riot())
    		.pipe(concat('app.templates.modules.js'))
    		.pipe(uglify())
    		.pipe(gulp.dest('./public/build/templates/js'));
    });

    gulp.task('app.templates.ui', function() {
    	return gulp.src(['assets/templates/ui/*.html'])
    		.pipe(riot())
    		.pipe(concat('app.templates.ui.js'))
    		.pipe(uglify())
    		.pipe(gulp.dest('./public/build/templates/js'));
    });

    gulp.task('app.templates', function() {
    	return gulp.src(['assets/js/app.templates.partials.js',
            'assets/js/app.templates.sections.js',
            'assets/js/app.templates.modules.js',
            'assets/js/app.templates.ui.js'])
    		.pipe(concat('app.templates.js'))
    		.pipe(gulp.dest('./public/build/templates/js'));
    });
}
