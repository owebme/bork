var path = require('path'),
    glob = require('glob'),
	riot = require('riot'),
    blackList = ['player', 'product'];

module.exports = function(){

    gulp.task('app.compile', function(done) {
        var tags = [], i = 0;
    	glob(path.join(process.cwd(), '/assets/templates/', '**', '*.html'), function(err, items) {
    		items.forEach(function(tag) {
    			var name = tag.replace(/.+\/(.+)\.html/g, "$1");
    			if (blackList.indexOf(name) === 0) return;

    			fs.readFile(tag, "utf8", function(err, data){
    				if (!err){
                        i++;
    					var filename = process.cwd() + '/public/tags/' + name + "" + i + ".tag";
    					fs.writeFile(filename, data, "utf8", function(err, data){
    						if (!err) tags[name] = require(filename);
    					});
    				}
    			});
    		})
    	});

    	setTimeout(function(){
    		var html = riot.render(tags.root),
    			filename = process.cwd() + '/public/compile.html';

    		fs.readFile(process.cwd() + '/public/template.html', "utf8", function(err, output){
    			if (!err){
    				output = output.replace(/<body>/g, "<body>" + html);
    				fs.writeFile(filename, output, "utf8", function(err, data){
    					if (!err){
    						console.log("well done"); done();
    					}
    				});
    			}
    		});
    	}, 1000);
    });
}
