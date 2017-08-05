(function(app, $, $dom, _){

    app.define("plugins.share");

    app.plugins.share = function(scope, options){
        if (!scope || !options) return;

        this.scope = $(scope);
        this.options = options;
        this.init();
    };

    app.plugins.share.prototype = {

        init: function(){
            var _this = this,
            options = this.options;

            if (this.active) return;

            this.scope.on("click", options.buttons, function(e){
                var item = e.currentTarget,
                    dataAttr = options.dataAttr ? "data-" + options.dataAttr : "data-social",
                    attr = item.getAttribute(dataAttr);

                if (attr){
                    var title = item.getAttribute("data-title") || options.share && options.share.title || document.title,
            		    url = item.getAttribute("data-url") || options.url || window.location.href;

            		if (attr == "fb") _this.fb(url, (_.isFunction(title) ? title() : title));
            		else if (attr == "vk") _this.vk(url, (_.isFunction(title) ? title() : title));
            		else if (attr == "gl") _this.gl(url, (_.isFunction(title) ? title() : title));
            		else if (attr == "dk") _this.dk(url, (_.isFunction(title) ? title() : title));
            		else if (attr == "tw") _this.tw(url, (_.isFunction(title) ? title() : title));
                }
            });

            this.active = true;
        },

        vk: function(purl, ptitle, pimg, text) {
    		url  = 'http://vkontakte.ru/share.php?';
    		url += 'url='          + encodeURIComponent(purl);
    		url += '&title='       + encodeURIComponent(ptitle);
    		if (pimg) url += '&image='       + encodeURIComponent(pimg);
            if (text) url += '&description=' + encodeURIComponent(text);
    		url += '&noparse=true';
    		this.popup(url);
    	},

    	dk: function(purl, text) {
    		url  = 'http://www.odnoklassniki.ru/dk?st.cmd=addShare&st.s=1';
    		url += '&st.comments=' + encodeURIComponent(text);
    		url += '&st._surl='    + encodeURIComponent(purl);
    		this.popup(url);
    	},

    	fb: function(purl, ptitle, pimg, text) {
    		url  = 'http://www.facebook.com/sharer.php?';
    		url += '&p[title]='     + encodeURIComponent(ptitle);
    		url += '&p[url]='       + encodeURIComponent(purl);
    		if (pimg) url += '&p[images][0]=' + encodeURIComponent(pimg);
            if (text) url += '&p[summary]='   + encodeURIComponent(text);
    		this.popup(url);
    	},

    	tw: function(purl, ptitle) {
    		url  = 'http://twitter.com/share?';
    		url += 'text='      + encodeURIComponent(ptitle);
    		url += '&url='      + encodeURIComponent(purl);
    		url += '&counturl=' + encodeURIComponent(purl);
    		this.popup(url);
    	},

    	ml: function(purl, ptitle, pimg, text) {
    		url  = 'http://connect.mail.ru/share?';
    		url += 'url='          + encodeURIComponent(purl);
    		url += '&title='       + encodeURIComponent(ptitle);
            if (pimg) url += '&imageurl='    + encodeURIComponent(pimg);
    		if (text) url += '&description=' + encodeURIComponent(text);
    		this.popup(url)
    	},

        gl: function(purl) {
    		url  = 'https://plus.google.com/share?';
    		url += 'url=' + encodeURIComponent(purl);
    		this.popup(url);
    	},

    	popup: function(url) {
    		window.open(url,"","width=600,height=400,left=350,top=170,status=no,toolbar=no,menubar=no");
    	},

        destroy: function(){
            this.scope.off();
            this.active = false;
        }
    };

})(app, $, app.$dom, app.utils);
