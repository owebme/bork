(function(){

    app.url = function(){
        return (app.config.domain ? app.config.domain : '') + app.config.api;
    };

    app.fetch = function(methods){
        var listMain = [],
            listSecond = [],
            parts = methods.split(", ");

        return new Promise(function(resolve, reject){
            for (i = 0; i < parts.length; i++) {
                if (_.isFunction(app.fetch.API[parts[i]])) {
                    listMain.push(parts[i]);
                }
            }
            if (parts.length !== listMain.length){
                listSecond = _.difference(parts, listMain);
            }
            Promise.all(listMain.map(app.fetch.API).concat(listSecond.map(app.request)))
            .then(function(results) {
                resolve(results);
            })
        });
    };

    app.requestList = function(methods, params, options){
        var list = [],
            params = params || [],
            options = options || [],
            parts = methods.split(", ");

        return new Promise(function(resolve, reject){
            for (i = 0; i < parts.length; i++) {
                list.push(parts[i]);
            }
            Promise.all(list.map(function(m, i){
                return app.request(m, params[i], options[i]);
            }))
            .then(function(results) {
                resolve(results);
            }, function(err){
                reject(err);
            })
        });
    };

    app.request = function(method, params, opt){
        return new Promise(function(resolve, reject){
            if (!app.config.request || app.config.request.handler && !app.config.request.handler(method)){
                resolve(true); return;
            }
            var url = _.underscored(method)
                        .replace(/^(get|set|add|del)/g, "")
                        .replace(/_/g, "/"),
                type = null,
                options = app.config.request.options();

            if (opt) _.extend(options, opt);

            if (method.match(/^get/)) type = 'GET';
            else if (method.match(/^set/)) type = 'PUT';
            else if (method.match(/^add/)) type = 'POST';
            else if (method.match(/^del/)) type = 'DELETE';

            if (!type) {
                reject('Error type request: ' + method);
                return;
            }
            if (type === "GET" && params){
                url += "/" + params;
                params = null;
            }
            if (options.loader && window.$LoaderAjax){
                $LoaderAjax.show();
            }

            var xhr = new XMLHttpRequest();
            xhr.open(type, app.url() + url, true);
            xhr.setRequestHeader("Accept", "application/json");
            xhr.setRequestHeader("Content-Type", "application/json");

            try {
                if (app.request.list && app.request.list.method === method && app.request.list.params == JSON.stringify(params)) {
                    app.request.list.xhr.abort();
                }
                xhr.send(params ? JSON.stringify(params) : {});
            } catch(e){}

            xhr.onload = function(e) {
                try {
                    if (this.status == 200) {
                        var data = JSON.parse(this.response);
                        if (data.status === "OK" && data.result){
                            resolve(data.result);
                        }
                        else resolve(data);
                    }
                    else {
                        if (options.notify){
                            app.errHandler(this.status);
                        }
                        var error = new Error(this.statusText);
                        error.code = this.status;
                        reject(error);
                    }
                } catch(e){}

                app.request.list = {};

                if (options.loader && window.$LoaderAjax){
                    $LoaderAjax.hide();
                }
            };

            xhr.onerror = function() {
                reject(new Error("Network Error"));

                if (options.loader && window.$LoaderAjax){
                    $LoaderAjax.hide();
                }
            };

            try {
                app.request.list = {
                    method: method,
                    xhr: xhr,
                    params: JSON.stringify(params)
                };
            } catch(e){}
        });
    };

    app.errHandler = function(status){
        if (status == 401){
            if (window.$Notify){
                $Notify.show({
                    color: "info",
                    text: "Авторизируйтесь снова"
                })
            }
            else {
                alert("Авторизируйтесь снова");
            }
        }
        else {
            if (window.$Notify){
                $Notify.show({
                    color: "danger",
                    text: "Ошибка проведения операции повторите ее чуть позже"
                })
            }
            else {
                alert("Ошибка проведения операции повторите ее чуть позже");
            }
        }
    };

    var logger = function(msg, url, line){
        app.request(app.config.logger.method, {
            data: {
                msg: msg,
                line: line,
                url: url
            },
            device: app.device.get(),
            type: "error"
        }, {
            loader: false,
            notify: false
        });
    },
    sendReport = _.debounce(logger, 1000, true),
    lastError = null;

    window.onerror = function(msg, url, line) {
    	if (app && app.config && app.config.logger && app.config.logger.report){
            var hash = msg + "" + url + "" + line;
            if (hash !== lastError){
                sendReport(msg, url, line);
                lastError = hash;
            }
    	}
    };

})();
