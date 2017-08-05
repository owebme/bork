window.$afterlag = {
    run: function(callback, options){
        var opt = {
            delay: 0,
            iterations: 1
        };

        if (options) _.extend(opt, options);

        var afterlag = new Afterlag(opt);

        afterlag.run(callback);

        return afterlag;
    },
    xs: function(callback, options){
        var opt = { iterations: 2, timeout: 200 };
        if (options) _.extend(opt, options);
        return $afterlag.run(callback, opt);
    },
    s: function(callback, options){
        var opt = { iterations: 3, timeout: 300 };
        if (options) _.extend(opt, options);
        return $afterlag.run(callback, opt);
    },
    m: function(callback, options){
        var opt = { iterations: 5, timeout: 500 };
        if (options) _.extend(opt, options);
        return $afterlag.run(callback, opt);
    },
    l: function(callback, options){
        var opt = { iterations: 7, timeout: 700 };
        if (options) _.extend(opt, options);
        return $afterlag.run(callback, opt);
    },
    xl: function(callback, options){
        var opt = { iterations: 10, timeout: 1000 };
        if (options) _.extend(opt, options);
        return $afterlag.run(callback, opt);
    }
};
