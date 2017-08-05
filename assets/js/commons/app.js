var app = app || {};

app.define = function (namespace) {
    var parts = namespace.split("."),
        parent = app,
        i;

    if (parts[0] == "app") {
        parts = parts.slice(1);
    }

    for (i = 0; i < parts.length; i++) {

        if (typeof parent[parts[i]] == "undefined") {
            parent[parts[i]] = {};
        }

        parent = parent[parts[i]];
    }
    return parent;
}

app.tag = function(name, callback){
    if (window.riot){
        if (callback && window.$afterlag){
            var tag = app.tag(name);
            if (tag && tag.isMounted){
                callback(tag);
            }
            else {
                $afterlag.run(function(){
                    var tag = app.tag(name);
                    if (tag){
                        if (tag.isMounted){
                            callback(tag);
                        }
                        else {
                            app.tag(name).one("updated", function(){
                                callback(tag);
                            })
                        }
                    }
                })
            }
        }
        else {
            return _.filter(riot.vdom ? riot.vdom : riot.util.vdom, function(tag){
                if (tag.root.nodeName.toLowerCase() == name){
                    return tag;
                }
            })[0];
        }
    }
}

app.domain = function(){
    return location.protocol + "//" + location.hostname;
}

app.store = {};
