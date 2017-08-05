(function(app, $, $dom, _){

    app.define("plugins.imagesLoaded.Queue");

    var j = app.plugins.imagesLoaded.QueueItem;

    function k() {
        this._items = []
    }
    var l = k.prototype;
    l.enqueue = function(a, c) {
        if (c === undefined) {
            c = k.PRIORITY_DEFAULT
        }
        var b = new j(a, c);
        return this.enqueueQueueItem(b)
    };
    l.enqueueQueueItem = function(a) {
        if (this._items.indexOf(a) === -1) {
            this._items.push(a)
        }
        return a
    };
    l.dequeue = function() {
        this._heapSort();
        var a = this._items.length - 1;
        var b = this._items[0];
        this._items[0] = this._items[a];
        this._items.pop();
        return b
    };
    l.dequeueQueueItem = function(a) {
        var b = this._items.indexOf(a);
        if (b > -1) {
            this._items.splice(b, 1)
        }
        return a
    };
    l.peek = function() {
        if (this.count() == 0) {
            return null
        }
        this._heapSort();
        return this._items[0]
    };
    l.isEmpty = function() {
        return this._items.length === 0
    };
    l.count = function() {
        return this._items.length
    };
    l.toString = function() {
        var a = ["Queue total items: " + this.count() + "\n"];
        for (var b = 0; b < this.count(); ++b) {
            a.push(this._items[b].toString() + "\n")
        }
        return a.join("")
    };
    l._heapSort = function() {
        var d = 0;
        for (var a = this._items.length - 1; a >= 0; a--) {
            var f = a;
            while (f > 0) {
                d++;
                var c = Math.floor((f - 1) / 2);
                if (this._items[f].compareTo(this._items[c]) >= 0) {
                    break
                }
                var b = this._items[f];
                this._items[f] = this._items[c];
                this._items[c] = b;
                f = c
            }
        }
    };
    k.PRIORITY_LOW = 10;
    k.PRIORITY_DEFAULT = 5;
    k.PRIORITY_HIGH = 1;

    app.plugins.imagesLoaded.Queue = k;

})(app, $, app.$dom, app.utils);
