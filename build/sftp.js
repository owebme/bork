module.exports = function(){

    var path = "/var/www/resume/data/app.resumekraft.ru",
        gulpSSH = new GulpSSH({
    	ignoreErrors: false,
    	sshConfig: {
        	host: '5.101.124.21',
        	port: 22,
        	username: 'root',
        	password: '6T9Qxia2XyrrD68W'
        }
    })

    gulp.task('sftp.css', function () {
    	return gulp.src(['assets/css/style.css'])
        .pipe(gulpSSH.dest(path + '/assets/css/'));
    });
    gulp.task('sftp.js', function () {
    	return gulp.src(['assets/js/app.build.js'])
        .pipe(gulpSSH.dest(path + '/assets/js/'));
    });

}
