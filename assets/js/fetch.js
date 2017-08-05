app.fetch.API = function(method){
    return app.fetch.API[method]();
};

app.fetch.API.getDataInit = function(){
    return new Promise(function(resolve, reject){
        app.request('getDataInit').then(function(res){

            $account = $store.account;
            $store.account.set(res.account);
            $store.data.set(res.data ? res.data : []);
            $store.inbox.set(res.inbox ? res.inbox : []);

            var likes = [];
            _.each(res.data, function(item){
                if (item.likes){
                    likes.push({
                        _id: item.id,
                        plan: item.plan,
                        post: item.post,
                        color: item.config.color,
                        likes: item.likes
                    })
                }
            });

            $store.likes.set(likes ? likes : []);

            if (app.config.metrika && app.config.metrika.active){
                var report = false;

                if (app.config.metrika.report){
                    report = {
                        method: app.config.metrika.report.method,
                        interval: app.config.metrika.report.interval
                    }
                }
                app.metrika = new app.plugins.metrika({
                    key: $account.get("_id"),
                    data: app.metrics.private,
                    previousData: res.metrika,
                    visits: $account.get("visits"),
                    device: true,
                    report: report
                });
                app.metrikaPublic = new app.plugins.metrika({
                    key: "public",
                    data: app.metrics.public,
                    readOnly: true
                });
            }
            else {
                app.metrika = new app.plugins.metrika();
                app.metrikaPublic = new app.plugins.metrika();
            }

            resolve(res);
        });
    });
};
