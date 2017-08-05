(function(dom, _){

    app.define("commons.RAF.EmitterIDGenerator");

    var currentID = 0

    app.commons.RAF.EmitterIDGenerator.getNewID = function() {
        currentID++;
        return "raf:" + currentID;
    };

})(app.dom, app.utils);
