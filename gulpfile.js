global.gulp = require('gulp');
global.fs = require('fs');
global.async = require('async');
global.sass = require('gulp-sass');
global.csso = require('gulp-csso');
global.base64 = require('gulp-base64');
global.autoprefixer = require('gulp-autoprefixer');
global.notify = require('gulp-notify');
global.rename = require('gulp-rename');
global.uglify = require('gulp-uglify');
global.uncss = require('gulp-uncss');
global.purify = require('gulp-purifycss');
global.gs = require('gulp-selectors');
global.riot = require('gulp-riot');
global.concat = require('gulp-concat');
global.GulpSSH = require('gulp-ssh');
global.combiner = require('stream-combiner2').obj;
global.browserSync = require('browser-sync').create();
global.reload = browserSync.reload;

require('./build/commons/scripts')();
require('./build/css')();
require('./build/pages')();
require('./build/html')();
require('./build/sftp')();

gulp.task('serve', function() {
	browserSync.init({
		open: false,
		notify: false,
		watchOptions: {
	        usePolling: true
	    },
		// proxy: "http://localhost:8080/"
		server: {
			baseDir: "./"
		}
	});
});

gulp.task('watch', function() {
	browserSync.watch([
		'assets/js/*.js',
		'assets/js/**/*.js',
		'assets/templates/*.html',
		'assets/templates/**/*.html'
	]).on('change', reload);

	gulp.watch([
		'assets/css/style.scss',
		'assets/css/**/*.scss',
		'assets/templates/**/*.scss'
	], gulp.parallel('css'));
});

gulp.task('dev', gulp.series(
	gulp.parallel('css'),
	gulp.parallel('serve', 'watch')
));

gulp.task('sftp', gulp.parallel('sftp.js', 'sftp.css'));

gulp.task('build', gulp.series(
	gulp.parallel('css', 'commons.features', 'commons.vendors', 'commons.components', 'commons.plugins.parallax', 'commons.plugins.animation')
	// gulp.series(gulp.parallel('app.templates.partials', 'app.templates.sections', 'app.templates.modules', 'app.templates.ui'), 'app.templates'),
	// 'app.build', 'app.compile', 'css-build'
));
