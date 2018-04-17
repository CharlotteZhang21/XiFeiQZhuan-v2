function HotMeter(maxValue) {
    Sprite.call(this, "hotmeter");

    this._maxValue = ~~maxValue;

    this.barContainer = this.addChild(new Sprite());
    this.bar = this.barContainer.addChild(new Sprite("hotmeter_fill"));

    this.arrows = this.addChild(new Sprite);
    this.arrows.addChild(new Sprite("hotmeter_arrow"));
    this.arrows.addChild(new Sprite("hotmeter_arrow"));

    var arrowDistance = this.texture.width * 0.5;
    this.arrows.children[0].anchor.set(1, 0.5);
    this.arrows.children[0].position.set(-arrowDistance, 0);
    this.arrows.children[1].anchor.set(1, 0.5);
    this.arrows.children[1].scale.set(-1, 1);
    this.arrows.children[1].position.set(arrowDistance, 0);

    this.barContainer.position.set(0, this.height / 2 - 6);
    this.barContainer.mask = this.barContainer.addChild(new PIXI.Graphics);
    this.bar.anchor.set(0.5, 1);
    this._value = -1;
    this.value = 0;
}

HotMeter.prototype = Object.create(Sprite.prototype, {
    value: {
        get: function () {
            return this._value;
        },
        set: function (val) {
            this._value = Math.max(0, Math.min(this._maxValue, val));
            this._update();
        }
    },
    _update: {
        value: function(){
            var k = this._value / this._maxValue;
            var h = this.bar.height * k;
            this.barContainer.mask.clear();
            if (h > 0) this.barContainer.mask.beginFill(0xFFFFFF).drawRoundedRect(
                -this.bar.width * 0.5 + 1, -h + 3,
                this.bar.width - 2, h,
                this.bar.width * 0.5
            );
            this.arrows.y = this.texture.height / 2 - Math.max(h, 6);
        }
    },
    complete: {
        get: function () {
            return this._value >= this._maxValue;
        },
        set: function (val) {
            this.value = val ? this._maxValue : this._value;
        }
    }
});

function TextBox() {
    Sprite.call(this, "text_frame");

    this.texts = this.addChild(new Sprite());
    for (var i = 0; i < 3; i++) {
        this.texts.addChild(new Sprite("text/" + i));
    }

    this._value = -1;
    this.value = 0;

    this.alpha = 0;
}

TextBox.prototype = Object.create(Sprite.prototype, {
    value: {
        get: function () {
            return this._value;
        },
        set: function (val) {
            this._value = Math.min(this.texts.children.length, Math.max(val, this._value));
            for (var i = 0; i < this.texts.children.length; i++) {
                this.texts.children[i].visible = (i === ~~this._value);
            }
        }
    },

    show: {
        value: function () {
            return TweenLite.fromTo(this, 0, {alpha: 0}, {alpha: 1});
        }
    }
});

function Select() {
    var choiseBg = this.addChild(new Sprite);
    this.choice = 
}

function Dressup() {
    Sprite.call(this);

    var i;
    this.items = this.addChild(new Sprite);
    this.bounds = new PIXI.Rectangle(0, 0, 1, 1);
    for (i = 0; i < 7; i++) {
        var item = this.items.addChild(new Sprite("girl/" + i));
        item.alpha = 0;
        this.bounds.width = Math.max(this.bounds.width, item.texture.width);
        this.bounds.height = Math.max(this.bounds.height, item.texture.height);
    }
    this.bounds.x = -this.bounds.width * 0.5;
    this.bounds.y = -this.bounds.height * 0.5;

    this.arrows = this.addChild(new Sprite);
    this.arrows.position.set(0, this.bounds.top);
    for (i = 0; i < 2; i++) {
        var arrow = this.arrows.addChild(new Sprite("arrow"));
        arrow.interactive = true;
        arrow.buttonMode = true;
        arrow.anchor.set(1, 0.5);
        arrow.position.set(0, 0);
        arrow.on("pointerdown", this.change.bind(this, -1 + (i * 2), arrow));
        if (i === 1) {
            arrow.scale.x = -1;
        }
    }
    this.alpha = 0;

    this._value = -1;
    this.value = 0;

    this.disabled = true;
}

Dressup.prototype = Object.create(Sprite.prototype, {
    value: {
        get: function () {
            return ~~this._value;
        },
        set: function (val) {
            var len = this.items.children.length;
            val = ~~val;
            while (val < 0) val += len;
            val = val % len;

            if (this._value != val) {
                var arrow = this.arrows.children[this._value > val ? 0 : 1];
                this._value = val;

                var timeline = new TimelineMax();
                for (var i = 0; i < this.items.children.length; i++) {
                    if (i === val) {
                        timeline.to(this.items.children[i], 2, {alpha: 1, ease: Power2.easeOut}, 0);
                    }
                    else {
                        timeline.to(this.items.children[i], 2, {alpha: 0, ease: Power2.easeOut}, 0);
                    }
                }

                this.arrows.children[0].interactive = val > 0;
                this.arrows.children[1].interactive = val < 6;

                var ax = (this.bounds.left + this.bounds.width) * (val >= 3 ? 0.75 : 0.4);
                var ay = val >= 3
                    ? this.bounds.height * 0.1
                    : this.bounds.top * 0.75
                ;

                var timeline = new TimelineMax();
                timeline.to(this.arrows, 0.3, {y: ay}, 0);
                for (var i = 0; i < this.arrows.children.length; i++) {
                    timeline.to(this.arrows.children[i], 0.3, {x: -ax + ax * (i * 2)}, 0);
                    this.arrows.children[i].textures = this.arrows.children[i].interactive ? "arrow" : "arrow_disabled";
                }
                if (val == 3) {
                    timeline.call(app.field.showHint, [], app.field);
                }

                var s = arrow.scale.x > 0 ? 1 : -1;
                timeline.to(arrow.scale, 0.1, {x: s * 0.9, y: 0.9}, 0).to(arrow.scale, 0.3, {x: s * 1, y: 1}, 0.1);

                this.emit("change", val);
            }
        }
    },
    disabled: {
        get: function () {
            return !this.arrows.visible;
        },
        set: function (val) {
            this.arrows.visible = !val;
        }
    },
    change: {
        value: function (diff, arrow) {
            this.value += ~~diff;
        }
    },
    resize: {
        value: function (rect) {
            var portrait = rect.height > rect.width;

            var scale = (rect.height / this.bounds.height) * (portrait ? 0.5 : 0.8);
            this.scale.set(scale);
            if (portrait) {
                this.position.set(0, 100 * scale);
            }
            else {
                this.position.set(rect.width * 0.1, 50 * scale);
            }
            //this.scale.set(rect.height / 800); // XXX
        }
    },

    show: {
        value: function () {
            return TweenLite.fromTo(this, 1, {alpha: 0}, {alpha: 1, ease: Power3.easeIn});
        }
    }

});

function Emperor() {
    Sprite.call(this);

    this.bodyContainer = this.addChild(new Sprite);
    this.body = this.bodyContainer.addChild(new Sprite([
        "emperor/0",
        "emperor/1",
        "emperor/2",
        "emperor/3",
        "emperor/4",
        "emperor/3",
        "emperor/2",
        "emperor/1"
    ].map(function(tx) {
        return PIXI.utils.TextureCache[tx];
    })));
    this.body._timeline.timeScale(0.1);
    this.body.alpha = 0;
    this.body.pivot.y = 50;

    this.textFrame = this.addChild(new Sprite("emperor/text_frame"));
    this.textFrame.addChild(new Sprite("emperor/text/0"));
    this.textFrame.addChild(new Sprite("emperor/text/1"));

    this.textFrame.position.set(-240, 0);
    this.alpha = 0;
}

Emperor.prototype = Object.create(Sprite.prototype, {
    resize: {
        value: function (rect) {
            var portrait = rect.height > rect.width;

            this.textFrame.scale.copy(app.field.dressup.scale);
            if (portrait) {
                this.toLocal({x: -app.field.x + this.textFrame.width / 2, y: 0}, app.field, this.textFrame.position);
            }
            else {
                var cta = app.field.cta || app.final && app.final.cta;
                if (cta) this.toLocal({x: cta.x, y: 0}, cta.parent, this.textFrame.position);
            }

            this.bodyContainer.position.copy(app.field.dressup.position);
            this.bodyContainer.scale.copy(app.field.dressup.scale);

            this.bodyContainer.scale.x *= 1.2;
            this.bodyContainer.scale.y *= 1.2;

            this.body.pivot.x = 80;
            if (this.body.pivot.y) {
                this.body.pivot.y = portrait ? 100 : 50;
            }
            // for (var i = 0; i < this.body.children.length; i++) {
            //     this.body.children[i].y = portrait ? -200 + 50 * i : -100 + 25 * i;
            //     this.body.children[i].scale.set(1 + i * 0.1);
            // }
        }
    },

    show: {
        value: function () {
            var delay = 1;
            var timeline = new TimelineMax();
            timeline.call(function () {
                this.textFrame.children[0].visible = true;
                this.textFrame.children[1].visible = false;
            }, [], this);

            timeline.fromTo(this, 1, {alpha: 0}, {alpha: 1});

            // timeline.to(this.body.children[0], 1.0, {alpha: 1}, 1);
            timeline.set(this.body.scale, {x: 0.8, y: 0.8});
            timeline.to(this.body, 1.0, {alpha: 1}, 1);
            timeline.call(this.body.play, [0], this.body, 2);
            timeline.fromTo(this.body.scale, 3, {x: 0.8, y: 0.8}, {x: 1, y: 1}, 2);
            timeline.to(this.body.pivot, 3, {y: 0}, 2);
            timeline.call(function(){
                this.body.stop(0);
            }, [], this);
            return timeline;
        }
    },

    reward: {
        value: function () {
            var timeline = new TimelineMax();
            timeline.call(function () {

                this.body.textures = [
                    "emperor/gold/0",
                    "emperor/gold/1",
                    "emperor/gold/2",
                    "emperor/gold/3",
                    "emperor/gold/4",
                    "emperor/gold/5",
                    "emperor/gold/6"
                ].map(function(tx) {
                    return PIXI.utils.TextureCache[tx];
                });
                this.body._timeline.repeat(0).timeScale(0.3).seek(0).play();

                this.textFrame.children[0].visible = false;
                this.textFrame.children[1].visible = true;
            }, [], this, 0);
            return timeline;
        }
    }
});

function Hint() {
    Sprite.call(this);
    this.alpha = 0;
    this.interactive = false;
    this.interactiveChildren = false;
    this.target = null;

    this.shader = this.addChild(new PIXI.Graphics());
    this.handWrapper = this.addChild(new Sprite());
    this.hand = this.handWrapper.addChild(new Sprite("hand"));
    this.hand.anchor.set(0.4, 0.1);

    this.handTimeline = new TimelineMax({repeat: -1, repeatDelay: 3});
    this.handTimeline.fromTo(this.handWrapper.scale, 0.5, {x: 1.0, y: 1.0}, {x: 1.1, y: 1.1});
    this.handTimeline.to(this.handWrapper.scale, 0.2, {x: 0.9, y: 0.9});
    this.handTimeline.to(this.handWrapper.scale, 0.5, {x: 1.0, y: 1.0});

    this.fadeTimeline = (new TimelineMax({paused: true}))
        .fromTo(this, 0.5, {alpha: 0}, {alpha: 1})
    ;

    this._hideTime = Infinity;
    this.hide();
}

Hint.prototype = Object.create(Sprite.prototype, {
    resize: {
        value: function (rect) {
            this.shader.clear();

            if (!this.target) return;
            this.parent.toLocal({x:0, y:0}, app.stage, this.position);

            var arrows = this.target.arrows.children;
            var scale = this.target.scale.x;

            this.toLocal({x: 20 * arrows[1].scale.x, y: 0}, arrows[1], this.handWrapper.position);
            this.hand.scale.copy(app.field.dressup.scale);

            var bounds = this.target.arrows.getBounds(), p = new PIXI.Point();
            scale = this.target.scale.x;
            // find left-top
            this.toLocal({x: arrows[0].x - arrows[0].width * 2, y: 0}, this.target, p);
            bounds.x = p.x;

            // find right-bottom
            this.toLocal({x: arrows[1].x + arrows[1].width * 2, y: 0}, this.target, p);
            bounds.width = p.x - bounds.x;

            if (app.field.text.value < 2) {
                bounds.y -= bounds.height * 0.5;
                bounds.height *= 2;
            }
            else {
                bounds.y -= bounds.height * 2;
                bounds.height *= 5;
            }

            this.shader.beginFill(0x000000, 0.5)
                .drawRect(0, 0, app.renderer.width, bounds.y)
                .drawPolygon([
                    0, bounds.top,
                    bounds.left, bounds.top,
                    bounds.left, bounds.bottom,
                    bounds.right, bounds.bottom,
                    bounds.right, bounds.top,
                    app.renderer.width, bounds.top,
                    app.renderer.width, app.renderer.height,
                    0, app.renderer.height,
                    0, bounds.top
                ])
                .endFill()
            ;

            for (var w = 1, n = 20, i = 0; i < n; i++) {
                this.shader
                    .lineStyle(w, 0x000000, Math.max(0, 0.5 * (n - i) / n))
                    .drawRect(bounds.x + (i + 0.5) * w, bounds.y + (i + 0.5) * w, bounds.width - (i * 2 + 1) * w, bounds.height - (i * 2 + 1) * w)
                ;
            }

        }
    },
    hide: {
        value: function (saveTarget) {
            this._hideTime = Infinity;
            if (!saveTarget) {
                this.target = null;
            }
            var timeline = new TimelineMax();
            timeline.to(this, 0.5, {alpha: 0});
        }
    },

    show: {
        value: function (target) {
            this._hideTime = Infinity;

            this.target = target || this.target;
            if (!this.target || !this.parent || !this.target.parent) return;

            this.resize();

            this.handTimeline.progress(0);

            this._hideTime = HINT_DURATION;

            var timeline = new TimelineMax();
            timeline.to(this, 0.5, {alpha: 1});
        }
    },
    tick: {
        value: function(delta) {
            if (this._hideTime > 0) {
                this._hideTime -= delta;
                if (this._hideTime <= 0) {
                    this.hide();
                }
            }
        }
    }
});

function Field() {
    Sprite.call(this);
    this.interactive = true;

    this.level = null;

    this.completeTimeout = AD_TIMEOUT || Infinity;
    this.inactiveTimeout = INACTIVE_TIMEOUT || Infinity;
    this.autoplayTimeout = Infinity;
    this.hintCount = 0;
}

Field.prototype = Object.create(Sprite.prototype, {
    clear: {
        value: function () {
            this.level = null;
            this.removeChildren();
        }
    },

    initLevel: {
        value: function (level) {
            this.clear();
            this.level = level;

            this.text = this.addChild(new TextBox());
            this.hotmeter = this.addChild(new HotMeter(6));
            this.emperor = this.addChild(new Emperor());
            this.dressup = this.addChild(new Dressup());

            this.particlesContainer = this.addChild(new PIXI.Sprite());
            this.goldEmitter = new PIXI.particles.Emitter(
                this.particlesContainer, [PIXI.Texture.fromFrame('gold')],
                {
                    "alpha": {
                        "start": 1.0,
                        "end": 1.0
                    },
                    "scale": {
                        "start": 1,
                        "end": 1.2,
                        "minimumScaleMultiplier": 0.5
                    },
                    "color": {
                        "start": "#ffffff",
                        "end": "#ffffff"
                    },
                    "speed": {
                        "start": 100,
                        "end": 100,
                        "minimumSpeedMultiplier": 1
                    },
                    "acceleration": {
                        "x": 0,
                        "y": 0
                    },
                    "maxSpeed": 0,
                    "startRotation": {
                        "min": 80,
                        "max": 100
                    },
                    "noRotation": false,
                    "rotationSpeed": {
                        "min": 50,
                        "max": 150
                    },
                    "lifetime": {
                        "min": 15,
                        "max": 15
                    },
                    "blendMode": "normal",
                    "frequency": 0.5,
                    "emitterLifetime": -1,
                    "maxParticles": 50,
                    "pos": {
                        "x": 0,
                        "y": 0
                    },
                    "addAtBack": false,
                    "spawnType": "rect",
                    "spawnRect": {
                        "x": 0,
                        "y": 0,
                        "w": 660,
                        "h": 20
                    }
                }
            );
            this.goldEmitter.emit = false;

            this.logo = this.addChild(new Sprite("logo"));
            this.cta = this.addChild(new CTAButton());

            this.hint = this.addChild(new Hint());
        }
    },

    updateTimeouts: {
        value: function () {
            this.inactiveTimeout = Infinity;
            if (this.autoplayTimeout < Infinity) {
                this.autoplayTimeout = this.hotmeter.complete ? Infinity : AUTOPLAY_INTERVAL;
            }
        }
    },

    runLevel: {
        value: function (level) {
            this.initLevel(level);

            this.once("pointerdown", this.updateTimeouts.bind(this));

            this.dressup.on("change", (function(val){
                TweenLite.to(this.hotmeter, 1, {value: val});
                this.hint.hide();
                if (val === 0) {
                    this.text.value = 0;
                }
                else if (val < 3) {
                    this.text.value = 1;
                }
                else {
                    this.text.value = 2;
                }
            }).bind(this));

            var timeline = new TimelineMax();
            timeline.add(this.dressup.show());
            timeline.add(this.text.show(), 1);
            timeline.call(function(){
                this.text.value = 1;
                this.dressup.disabled = false;
                this.showHint();
            }, [], this, 3);
        }
    },

    resize: {
        value: function (rect) {
            var portrait = rect.height > rect.width;
            this.position.set(rect.width * 0.5, rect.height * 0.5);

            this.goldEmitter.updateSpawnPos(0, -Math.max(rect.width, rect.height) * 0.55);
            this.goldEmitter.spawnRect.x = -rect.width * 0.5;
            this.goldEmitter.spawnRect.width = rect.width * 1.0;

            this.dressup.resize(rect);
            this.emperor.resize(rect);
            this.hint.resize(rect);

            if (!this.cta || !this.logo) return;

            var ctaBounds;
            if (portrait) {
                this.cta.scale.set(Math.min(1, Math.min(rect.width, rect.height) * 0.5 / this.cta._btn.texture.width));
                ctaBounds = this.cta.getBounds();
                this.cta.position.set(0, (rect.height - ctaBounds.height) * 0.45);

                this.logo.position.set(this.cta.x, -this.cta.y);
                this.logo.width = ctaBounds.width;
                this.logo.scale.y = this.logo.scale.x * 1;

                this.text.width = rect.width * 0.8;
                this.text.scale.y = this.text.scale.x * 1;
                this.text.position.set(this.dressup.x, this.logo.y + (this.logo.height + this.text.height * 1.1) / 2);

                this.hotmeter.height = rect.height * 0.6;
                this.hotmeter.scale.x = this.hotmeter.scale.y * 1;
                this.hotmeter.position.set(rect.width * 0.5 - this.hotmeter.width * 1.5, 0);

            }
            else {
                this.cta.scale.set(Math.min(1, Math.min(rect.width, rect.height) * 0.4 / this.cta._btn.texture.width));
                ctaBounds = this.cta.getBounds();
                this.cta.position.set((-rect.width + ctaBounds.width) * 0.45, (rect.height - ctaBounds.height) * 0.45);

                this.logo.position.set(this.cta.x, -this.cta.y);
                this.logo.width = ctaBounds.width;
                this.logo.scale.y = this.logo.scale.x * 1;

                this.text.width = rect.width * 0.5;
                this.text.scale.y = this.text.scale.x * 1;
                this.text.position.set(this.dressup.x, this.logo.y);

                this.hotmeter.height = rect.height * 0.8;
                this.hotmeter.scale.x = this.hotmeter.scale.y * 1;
                this.hotmeter.position.set(rect.width * 0.5 - this.hotmeter.width * 1.5, 0);
            }
        }
    },

    showHint: {
        value: function () {
            this.hintCount++;
            if (this.hintCount > 2) return;
            this.hint.show(this.dressup);
            this.autoplayTimeout = AUTOPLAY_INTERVAL;
        }
    },

    autoplay: {
        value: function(){
            this.dressup.value++;
            this.updateTimeouts();
        }
    },

    reward: {
        value: function () {
            this.interactive = false;
            this.interactiveChildren = false;
            this.autoplayTimeout = Infinity;
            this.dressup.disabled = true;
            this.hint.hide();
            app.back.setImage(1);

            this.dressup.value = 6;

            var tx = ["girl/final/8"];
            for (var i = 7; i >= 1; i--) {
                tx.unshift("girl/final/" + i);
                tx.push("girl/final/" + i);
            }
            // tx.unshift("girl/final/0");
            this.dressup.items.children[this.dressup.value].textures = tx.map(function(tx) {
                return PIXI.utils.TextureCache[tx];
            });
            this.dressup.items.children[this.dressup.value]._timeline.timeScale(0.15).seek(0).play();

            var emperorTimeline = new TimelineMax();
            emperorTimeline.add(this.emperor.show());
            emperorTimeline.add(this.emperor.reward());
            emperorTimeline.set(this.goldEmitter, {emit: 1});
            emperorTimeline.to(this.emperor.textFrame, 1, {alpha: 0}, "+=2");

            var timeline = new TimelineMax();
            timeline.to(this.dressup.pivot, 1, {x: -160});
            timeline.to(this.hotmeter, 2, {alpha: 0}, 0);
            timeline.to(this.text, 2, {alpha: 0}, 0);
            timeline.add(emperorTimeline, 0);
            timeline.call(this.emit, ["complete"], this);
        }
    },

    complete: {
        value: function () {
            this.interactive = false;
        }
    },

    tick: {
        value: function (delta) {

            this.goldEmitter.update(delta * 0.001);

            this.completeTimeout -= delta;
            this.inactiveTimeout -= delta;
            if (this.inactiveTimeout <= 0 || this.completeTimeout <= 0) {
                this.emit("complete");
                return;
            }

            this.hint.tick(delta);

            this.autoplayTimeout -= delta;
            if (this.autoplayTimeout <= 0) {
                this.autoplay();
            }

            if (this.interactive && this.hotmeter.complete) {
                this.reward();
            }
        }
    }
});

function resize(width, height) {
    back.width = Math.max(width, height);
    back.scale.y = back.scale.x * 1;
    // TODO: update tutorial rect according to back here...
    var portrait = height > width;
    var scale = Math.max(width, height) / Math.max(960, 640);
    mainContainer.scale.set(scale);
    mainContainer.x = (width - (portrait ? 640 : 960)) / 2;
}
