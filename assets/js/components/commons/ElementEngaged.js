(function(app, $, $dom, _){

    var attributes = {
        ENGAGEMENT: "data-engaged"
    };
    var selectors = {
        ENGAGEMENT: "engaged"
    };

    app.component.register("ElementEngaged", {
        init: function(){
            this.timeToEngage = 300;
            this.inViewThreshold = 0.75;
            if (this.element.hasAttribute(attributes.ENGAGEMENT)) {
                try {
                    this._overwriteElementEngagementProps()
                } catch (i) {
                    console.error("ElementEngaged::_overwriteElementEngagementProps bad JSON in data-attribute!", i)
                }
            }
            this.trackedElement = this.section.elementEngagement.addElement(this.element, {
                timeToEngage: this.timeToEngage,
                inViewThreshold: this.inViewThreshold
            })
        },
        setupEvents: function() {
            this._onElementEngaged = this._onElementEngaged.bind(this);
            this.trackedElement.once("engaged", this._onElementEngaged)
        },
        _overwriteElementEngagementProps: function() {
            var a = this.element.getAttribute(attributes.ENGAGEMENT);
            var b = JSON.parse(a);
            this.timeToEngage = b.timeToEngage === undefined ? this.timeToEngage : parseFloat(b.timeToEngage);
            this.inViewThreshold = b.inViewThreshold === undefined ? this.inViewThreshold : parseFloat(b.inViewThreshold)
        },
        _onElementEngaged: function(a) {
            this.element.classList.add(selectors.ENGAGEMENT)
        }
    });

})(app, $, app.$dom, app.utils);
