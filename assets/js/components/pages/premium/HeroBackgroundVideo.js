(function(app, $, $dom, _){

    var device = app.device,
        sizes = app.sizes,
        dom = app.dom,
        math = app.math,
        prefixed = app.prefixed;

    var selectors = {
        video: "hero__video"
    };

    app.component.register("HeroBackgroundVideo", {
        init: function(){
            this.isPlaying = false;
            this.videoPath = this.element.getAttribute("data-video-path");
            this.injectHeroBackgroundVideo();
        },

        injectHeroBackgroundVideo: function(){
            this.video = document.createElement("video");
            this.video.classList.add(selectors.video);
            this.video.loop = true;
            this.video.muted = true;
            this.video.src = this.videoPath;
            this.element.appendChild(this.video);
        },

        setupEvents: function(){
            if (device.isMobile){
                this.onCanPlayThrough();
            }
            else {
                this.onCanPlayThrough = this.onCanPlayThrough.bind(this);
                this.video.addEventListener("canplaythrough", this.onCanPlayThrough);
            }
        },

        onCanPlayThrough: function() {
            this.video.play();
            this.isPlaying = true;
            setTimeout(function(){
                RAF(function(){
                    this.element.setAttribute("data-play", true);
                }.bind(this));
            }.bind(this), 200);
        },

        onSectionWillAppear: function() {
            if (this.isPlaying){
                this.video.play()
            }
        },
        onSectionWillDisappear: function() {
            if (this.isPlaying){
                this.video.pause()
            }
        }
    },
    function(){
        return true;
    });

})(app, $, app.$dom, app.utils);
