(function(app, $, $dom, _){

    app.define("plugins.metrika");

    app.plugins.metrika = function(options){
        if (!options){
            this.get = function(){};
            this.set = function(){};
            return;
        }
        this.state = options.data;
        this.previousState = options.previousData;
        this.visits = options.visits;
        this.device = options.device;
        this.readOnly = options.readOnly;
        this.key = options.key;
        this.report = options.report;
        this.safeMode = !app.device.isStorage;
        this.init();
    };

    app.plugins.metrika.prototype = {

        init: function(){
            if (this.active) return;
            if (!this.key) console.log("Not available key attribute");
            if (!this.state) console.log("Not available data attribute");
            if (!this.key || !this.state) return;

            var _this = this,
                state = this.state,
                key = this.key,
                store = Store.get(key),
                prevDate = this.previousState ? this.previousState.date : null,
                ver = store && store.ver || this.previousState && this.previousState.ver;

            if (!this.readOnly){
                if (ver && ver != state.ver){
                    Store.set(key, {
                        'ver': state.ver
                    });
                }
                else {
                    if (store && !prevDate){
                        _.deepExtend(state, store);
                    }
                    else if (prevDate){
                        if (window.moment && store && store.date){
                            store = moment(prevDate).diff(moment(store.date)) > 0 ? this.previousState : store;
                        }
                        else {
                            store = this.previousState;
                        }
                        _.deepExtend(state, store);
                    }
                }

                if (this.visits > 0 && this.visits != state.visits && state.timer) delete state.timer;
                if (this.visits) state.visits = this.visits;
                if (this.device) state.device = app.device && app.device.get ? app.device.get() : null;
                this.state = new Baobab(state, { autoCommit: true });

                this.state.on("write", function(e){
                    Store.set(key, _this.state.get());
                });
                Store.set(key, this.state.get());

                if (this.report) this.logger();
            }
            else {
                this.state = new Baobab(store || {});
            }

            this.active = true;
        },

        set: function(path, value, options){
            if (!path || !this.active || this.readOnly || this.safeMode) return;
            var options = options || {};

            if (options.action == "inc") {
                var val = this.state.get(path.split(".")) || 0;
                this.state.select(path.split(".")).set(val + value);
            }
            else if (options.action == "dec") {
                var val = this.state.get(path.split(".")) || 0;
                this.state.select(path.split(".")).set(val - value);
            }
            else {
                this.state.select(path.split(".")).set(value);
            }
            if (options.force){
                this.logger.request();
            }
        },

        get: function(path){
            if (!this.active) return;
            if (this.safeMode){
                return true;
            }
            else {
                if (path){
                    return this.state.get(path.split("."));
                }
                else {
                    return this.state.get();
                }
            }
        },

        logger: function(){
            var _this = this,
                method = this.report.method,
                interval = this.report.interval;

            this.logger.request = function(){
                var state = _this.state.get(),
                    stateJSON = JSON.stringify(state);

                if (_this.lastState != stateJSON){
                    _this.lastState = stateJSON;
                    if (_this.timer){
                        state.timer = _this.timer;
                        Store.set(_this.key, state);
                    }
                    app.request(method, state, {
                        loader: false,
                        notify: false
                    });

                    if (state.timer) delete state.timer;
                }
            }

            if (method && interval){

                this.lastState = JSON.stringify(this.state.get());

                setInterval(function(){
                    _this.logger.request();

                }, interval * 1000);

                if (!app.safeMode){
                    this.timer = this.state.get("timer") || {
                        passive: 0,
                        active: 0
                    };
                    setInterval(function(){
                        _this.timer.passive++;
                    }, 1000);

                    if (!app.device.isMobile){
                        var cords = null,
                            lastCords = null;

                        try {
                            app.$dom.document.on("mousemove.metrika", function(e){
                                _.raf(function(){
                                    cords = String(e.pageX + "" + e.pageY);
                                });
                            });

                            setInterval(function(){
                                if (lastCords !== cords){
                                    _this.timer.active++;
                                    lastCords = cords;
                                }
                            }, 1000);

                        } catch(e){}
                    }
                }
            }
        }
    };

})(app, $, app.$dom, app.utils);
