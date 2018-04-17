function Background() {
    Sprite.call(this);

    this.backs = [
        this.addChild(new Sprite("background")),
        this.addChild(new Sprite("background2"))
    ];
    for (var i = 1; i < this.backs.length; i++) {
        this.backs[i].alpha = 0;
    }
    this._currentImage = 0;
}

Background.prototype = Object.create(Sprite.prototype, {
    resize: {
        value: function (rect) {

            this.position.set(rect.width / 2, rect.height / 2);

            for (var i = 0; i < this.backs.length; i++) {
                var back = this.backs[i];
                back.scale.set(Math.max(
                    (rect.width / back.texture.width) * 1.4,
                    rect.height / back.texture.height
                ));
            }

            if (rect.width > rect.height) {
                if (this._currentImage === 0) {
                    this.pivot.x = (this.backs[0].width - rect.width) * -0.2;
                }
            }
        }
    },

    setImage: {
        value: function (n) {
            n = Math.max(0, ~~n) % this.backs.length;
            for (var i = 0; i < this.backs.length; i++) {
                TweenLite.to(this.backs[i], 1, {alpha: (n == 1 ? 1 : 0)});
            }
            if (n === 1) {
                TweenLite.to(this.pivot, 1, {x: 0});
            }
            this._currentImage = n;
        }
    },

    tick: {
        value: function (delta) {
        }
    }
});
