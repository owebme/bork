(function(app, $, $dom, _){

    app.define("plugins.imagesLoaded.QueueItem");

    var j = 0;

    function k(a, b) {
        this.priority = b;
        this.data = a;
        this.insertionOrder = j++
    }
    var l = k.prototype;
    l.compareTo = function(a) {
        if (this.priority < a.priority) {
            return -1
        } else {
            if (this.priority > a.priority) {
                return 1
            } else {
                return (this.insertionOrder < a.insertionOrder) ? -1 : 1
            }
        }
    };
    l.toString = function() {
        return "QueueItem {priority:" + this.priority + ",\tdata:" + this.data + "\tinsertionOrder:" + this.insertionOrder + "}"
    };

    app.plugins.imagesLoaded.QueueItem = k;

})(app, $, app.$dom, app.utils);
