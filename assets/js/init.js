$(document).ready(function(){

    var start = new Date().getTime();
    console.time("process");

    window.RAF = app.commons.RAF.Controller("draw");

    riot.compile(function(e){

        riot.mount("*");

        app.mounted = true;

        app.sections.init();

        //app.$page = new app.page.BasePage();

        console.timeEnd("process");

        var elapsed = new Date().getTime() - start;
        //alert(elapsed + "ms");

    });

    clearTimeout(window.progressiveTimeout);
});
