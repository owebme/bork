(function(app, $, $dom, _){

    var imagesLoaded = app.plugins.imagesLoaded,
        Events = {
            ImageLoad: "progressive-image-load",
            Complete: "progressive-image-complete"
        };

    app.component.register("ProgressiveImage", {
        init: function(){
            if (this.section.getComponentByName(this.componentName)) {
                throw new Error("Each Jetpack Section can only contain one ProgressiveImageComponent. Mark progressive images with the [data-progressive-image] attribute, or use [data-progressive-image-group] to distinctly load multiple groups of images in a section")
            }
            try {
                this._loadOptions = JSON.parse(this.element.getAttribute("data-progressive-image-options"))
            } catch (i) {
                this._loadOptions = null
            }
            this.imageLoader = new imagesLoaded({
                container: this.element,
                includeContainer: true
            })
        },
        setupEvents: function() {
            this._onImageLoad = this._onImageLoad.bind(this);
            this._onComplete = this._onComplete.bind(this);
            this.imageLoader.on(imagesLoaded.Events.ImageLoad, this._onImageLoad);
            this.imageLoader.on(imagesLoaded.Events.Complete, this._onComplete)
        },
        onSectionWillAppearWithPadding: function() {
            this.imageLoader.load(this._loadOptions)
        },
        destroy: function() {
            this.imageLoader.destroy();
            this.imageLoader = null;
        },
        _onImageLoad: function(a) {
            this.section.trigger(Events.ImageLoad, a)
        },
        _onComplete: function() {
            this.section.trigger(Events.Complete)
        }
    },
    function(){
        var a = document.getElementsByTagName("html")[0];
        return a.classList.contains("m-progressive-image");
    });

})(app, $, app.$dom, app.utils);
