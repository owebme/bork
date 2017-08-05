(function(app, $, $dom, _){

    app.define("plugins.animate");

    app.plugins.animate = function(scope, options){
        var _this = this;

        this.groups = [];

        this.active = false;

        this.options = options;

        this.scope = $(scope);

        this.scope.find("*").each(function(){
            var attr = this.getAttribute("class");
            if (attr && attr.match(/anim-group/)){
                var num = attr.match(/anim-group(\d+)/)[1],
                    delay = attr.match(/anim-delay-(\w+)/),
                    group = _.findWhere(_this.groups, {"num": num}),
                    item = {
                        elem: this,
                        delay: delay && delay.length && delay[1] ? _this.delay.getNumByTitle(delay[1]) : "0"
                    };

                if (!group) {
                    _this.groups.push({
                        num: num,
                        items: [item]
                    })
                }
                else {
                    group.items.push(item);
                }
            }
        });
    };

    app.plugins.animate.prototype = {

        show: function(callback){
            var _this = this;

            if (this.groups.length){
                if (this.groups.length > 1){
                    _.each(_.sortArray(this.groups, "num"), function(group, i){
                        (function(){
                            if (_this.groups[i + 1]){
                                var items = null,
                                    lastElem = null;

                                if (_this.options && _this.options.showAfter){
                                    items = _.sortArray(group.items, "delay", "asc");
                                    lastElem = items[_this.options.showAfter - 1].elem;
                                }
                                else {
                                    items = _.sortArray(group.items, "delay", "desc");
                                    lastElem = items[0].elem;
                                }
                                if (lastElem){
                                    _.onEndTransition(lastElem, function(){

                                        _this.scope.addClass("showAnim-group" + (group.num * 1 + 1));

                                        if (_this.groups.length == (group.num * 1 + 1) && _.isFunction(callback)){
                                            callback();
                                        }
                                    });
                                }
                            }
                        })(group, i);

                        if (i == 0) _this.scope.addClass("showAnim-group" + group.num);
                    });
                }
                else {
                    _this.scope.addClass("showAnim-group1");

                    if (_.isFunction(callback)){
                        var items = _.sortArray(this.groups[0].items, "delay", "desc"),
                            lastElem = items[0].elem;

                        if (lastElem){
                            _.onEndTransition(lastElem, function(){
                                callback();
                            });
                        }
                    }
                }
                this.active = true;
            }
        },

        hide: function(callback){
            var _this = this;

            if (this.groups.length){
                if (this.options && this.options.hide && this.options.hide == "noanimate"){
                    this.scope.addClass("transitionAll-none");
                    setTimeout(function(){
                        _this.scope.removeClass("transitionAll-none");
                    }, 50);
                }
                this.scope.removeClass(
                    _.map(_.pluck(this.groups, "num"), function(num){
                        return "showAnim-group" + num;
                    }).join(" ")
                );
                if (_.isFunction(callback)){

                    var lastElem = _.sortArray(this.groups[0].items, "delay", "desc")[0].elem;

                    _.onEndTransition(lastElem, function(){
                        callback();
                    });
                }

                this.active = false;
            }
        },

        delay: {

            items: [
                {
                    title: "xs",
                    num: "1"
                },
                {
                    title: "s",
                    num: "2"
                },
                {
                    title: "m",
                    num: "3"
                },
                {
                    title: "l",
                    num: "4"
                },
                {
                    title: "xl",
                    num: "5"
                }
            ],

            getNumByTitle: function(title){
                return _.findWhere(this.items, {"title": title}).num;
            }
        }
    };

})(app, $, app.$dom, app.utils);
