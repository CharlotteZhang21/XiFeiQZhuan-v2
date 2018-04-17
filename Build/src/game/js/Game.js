var app;

var AD_TIMEOUT = ~~CONFIG.AD_TIMEOUT * 1000 || Infinity;
var INACTIVE_TIMEOUT = ~~CONFIG.INACTIVE_TIMEOUT * 1000 || Infinity;
var CLOSE_TIMEOUT = ~~CONFIG.CLOSE_TIMEOUT * 1000 || Infinity;
var AUTOPLAY_INTERVAL = CONFIG.AUTOPLAY_INTERVAL * 1000 || Infinity;
var HINT_DURATION = CONFIG.HINT_DURATION * 1000 || 2000;

var LEVEL = CONFIG.LEVEL;

function CTAButton() {
    Sprite.call(this);
    this._btn = this.addChild(new Sprite("cta"));
    this.interactive = true;
    this.buttonMode = true;

    this.on("pointerdown", function(){
        doSomething("download");
    });

    this.on("pointerover", function(){
        TweenLite.to(this._btn.scale, 0.1, {x: 1.1, y: 1.1});
    });
    this.on("pointerout", function(){
        TweenLite.to(this._btn.scale, 0.3, {x: 1, y: 1});
    });
}

CTAButton.prototype = Object.create(Sprite.prototype, {
    pulse: {
        value: function(){
            var timeline = new TimelineMax();
            timeline
                .to(this._btn.scale, 0.3, {x: 1.1, y: 1.1})
                .to(this._btn.scale, 0.5, {x: 1.0, y: 1.0})
                .repeatDelay(1)
                .repeat(-1)
            ;
            return timeline;
        }
    }
});

function Game(container) {
    PIXI.Application.call(this, {
        autoStart: false,
        width: 960,
        height: 960,
        antialias: true,
        transparent: true
    });

    Game.instance = this;
    window.app = this;

    this.view.style.display = "block";
    container.appendChild(this.view);
    this.view.className = "playable-view";

    this.stage.interactive = true;

    this.back = this.stage.addChild(new Background());
    this.field = this.stage.addChild(new Field());
    this.final = this.stage.addChild(new FinalScreen());
}

Object.assign(Game, {
    instance: null,
    ready: false,
    preload: function (callback) {
        ASSETS.forEach(function (asset) {
            PIXI.loader.add(asset.name, asset.src);
        });
        PIXI.loader.load(function (loader, res) {
            ASSETS.forEach(function (asset) {
                res[asset.name].asset = asset;
            });
            Game.ready = true;
            return callback();
        });
    }
});

Game.prototype = Object.create(PIXI.Application.prototype, {
    width: {
        get: function () {
            return this.renderer.width / this.stage.scale.x;
        }
    },
    height: {
        get: function () {
            return this.renderer.height / this.stage.scale.y;
        }
    },
    scale: {
        get: function () {
            return this.stage.scale.x;
        },
        set: function (val) {
            return this.stage.scale.set(val);
        }
    },
    run: {
        value: function () {
            // this.stage.removeChildren();
            var now = (new Date).getTime();
            this.ticker.add(this.tick.bind(this));

            this.field.once("complete", this.complete.bind(this));
            this.field.runLevel(LEVEL);

            this.resize({
                x: 0, y: 0,
                width: window.innerWidth || this.view.parentNode.clientWidth,
                height: window.innerHeight || this.view.parentNode.clientHeight
            });

            this.start();

            setTimeout(function(){
                document.querySelector("#vungle-close").style.display = "";
            }, CLOSE_TIMEOUT);
        }
    },

    resize: {
        value: function (rect) {
            if (!this.view || !rect.width || !rect.height) return;

            var scale = Math.min(rect.width / 960, rect.height / 960);
            var portrait = rect.height > rect.width;

            // this.stage.rotation = portrait ? 0 : Math.PI / 2;
            var width = rect.width;
            var height = rect.height;

            this.view.style.width = width + "px";
            this.view.style.height = height + "px";
            this.renderer.resize(width, height);

            this.back.resize(rect);
            this.field.resize(rect);
            this.final.resize(rect);
        }
    },
    tick: {
        value: function () {
            var delta = this.ticker.elapsedMS;
            this.back.tick(delta);
            this.field.tick(delta);
            this.final.tick(delta);
        }
    },
    complete: {
        value: function () {
            this.back.setImage(1);
            this.field.complete();
            this.final.show(this.field);
        }
    }
});
