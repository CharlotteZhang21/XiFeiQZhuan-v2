function FinalScreen() {
    PIXI.Sprite.call(this);
    this.visible = false;

    this.shader = this.addChild(new PIXI.Graphics());
    this.shader.alpha = 0;

    this.showTimeline = null;
}

FinalScreen.prototype = Object.create(PIXI.Sprite.prototype, {
    show: {
        value: function (field) {

            if (this.visible) return;

            this.logo = this.addChild(field.logo);
            this.cta = this.addChild(field.cta);

            field.logo = null;
            field.cta = null;

            var logo = [this.logo.x, this.logo.y, this.logo.scale.x];
            var cta = [this.cta.x, this.cta.y, this.cta.scale.x];

            var rect = this.shader.getLocalBounds(), portrait = rect.height > rect.width;
            this.visible = true;
            this.resize(rect);

            var timeline = new TimelineMax();
            this.showTimeline = timeline;

            this.showTimeline.fromTo(this.shader, 5, {alpha: 0}, {alpha: 0.2}, 0);

            this.showTimeline.fromTo(this.logo, 0.7,
                {x: logo[0], y: logo[1]},
                {x: this.logo.x, y: this.logo.y},
                0
            );
            this.showTimeline.fromTo(this.logo.scale, 1,
                {x: logo[2], y: logo[2]},
                {x: this.logo.scale.x, y: this.logo.scale.y, ease: Back.easeOut},
                0
            );

            this.showTimeline.fromTo(this.cta, 0.5,
                {x: cta[0], y: cta[1]},
                {x: this.cta.x, y: this.cta.y, ease: Back.easeIn},
                0
            );
            this.showTimeline.fromTo(this.cta.scale, 0.5,
                {x: cta[2], y: cta[2]},
                {x: this.cta.scale.x, y: this.cta.scale.y, ease: Back.easeIn},
                0
            );

            this.showTimeline.call(function(){
                this.cta.pulse();
            }, [], this, 0);

            this.showTimeline.eventCallback("onComplete", function(){
                this.showTimeline = null;
            }, [], this);

            this.showTimeline.play();

            return this.showTimeline;
        }
    },
    resize: {
        value: function (rect) {
            if (this.showTimeline) {
                var timeline = this.showTimeline;
                this.showTimeline = null;
                timeline.progress(1);
                timeline.kill();
                timeline = null;
            }

            this.position.set(rect.width / 2, rect.height / 2);
            this.shader.clear().beginFill(0x000000, 0.5).drawRect(-rect.width / 2, -rect.height / 2, rect.width, rect.height);

            if (!this.visible) {
                return;
            }

            var portrait = rect.height > rect.width;

            var ctaBounds;
            if (portrait) {
                this.cta.scale.set(Math.min(1, Math.min(rect.width, rect.height) * 0.6 / this.cta._btn.texture.width));
                ctaBounds = this.cta.getBounds();
                this.cta.position.set(0, (rect.height - ctaBounds.height) * 0.4);

                this.logo.position.set(this.cta.x, -this.cta.y * 0.9);
                this.logo.width = ctaBounds.width * 1.2;
                this.logo.scale.y = this.logo.scale.x * 1;
            }
            else {
                this.cta.scale.set(Math.min(1, Math.min(rect.width, rect.height) * 0.6 / this.cta._btn.texture.width));
                ctaBounds = this.cta.getBounds();
                this.cta.position.set((-rect.width + ctaBounds.width) * 0.45, (rect.height - ctaBounds.height) * 0.45);

                this.logo.position.set(this.cta.x, -this.cta.y * 0.9);
                this.logo.width = ctaBounds.width;
                this.logo.scale.y = this.logo.scale.x * 1;
            }


            // if (portrait) {
            //     this.logo.scale.set(Math.min(
            //         rect.width * 0.9 / this.logo.texture.width,
            //         rect.height * 0.5 / this.logo.texture.height
            //     ));
            //     this.logo.position.set(0, -rect.height * 0.5 + this.logo.texture.height);
            //
            //     this.cta.position.set(0, rect.height * 0.3);
            //     this.cta.scale.set(Math.min(1, rect.height * 0.25 / this.cta.texture.height));
            // }
            // else {
            //     this.logo.scale.set(Math.min(
            //         rect.width * 0.9 / this.logo.texture.width,
            //         rect.height * 0.5 / this.logo.texture.height
            //     ));
            //     this.logo.position.set(0, -rect.height * 0.2);
            //
            //     this.cta.scale.set(Math.min(1, rect.height * 0.3 / this.cta.texture.height));
            //     this.cta.position.set(
            //         0,
            //         rect.height * 0.3
            //     );
            // }
        }
    },
    tick: {
        value: function (delta) {
        }
    }
});
