import * as Utils from '../utils/util';


class Chair extends Phaser.Group {
	constructor(game, chairName, containerName) {
		super(game);

		this.container = document.getElementById("chair");
		this.chair = this.game.add.sprite(0,0, chairName);
		this.add(this.chair);
		this.chair.alpha = 0;

		this.stars = [];


		Utils.fitInContainer(this.chair, containerName, 0.5, 0.5);

		this.initialScale = this.chair.scale.x;
		this.initialYPos = this.chair.y;
		this.initialWidth = this.chair.width;
		this.initialHeight = this.chair.height;

		Utils.display(game, this.chair, 100);

	}

	hide(delay, duration){
		var initScale = this.chair.scale.x;
		var scaleTween = this.game.add.tween(this.chair.scale).to({x: [initScale * 1.2, 0], y: [initScale * 1.2, 0]}, duration, Phaser.Easing.Quadratic.In, true, delay);
	
		scaleTween.onComplete.add(function(){
			this.chair.alpha  = 0;
		},this);
	}
	

	popUp(delay, duration, shaking = false, i = 0){

		// Utils.display(this.game, this.chair, 100);

		// var scaleFinal = this.chair.scale.x;

		this.chair.scale.x = 0;
		this.chair.scale.y = 0;

		var scaleTween = this.game.add.tween(this.chair.scale).to({x: [this.initialScale * 1.2, this.initialScale], y: [this.initialScale * 1.2, this.initialScale]}, duration, Phaser.Easing.Quadratic.In, true, delay);
		
		if(shaking)
			scaleTween.onComplete.add(function(){
				this.shaking(i);
			}, this);
		else {
	       // scaleTween.onComplete.add(function(){
	       this.game.time.events.add(200,function(){
	       		this.spawnStars();
	       },this); 
		}


	}

	shaking(i) {
		var initialScale = this.initialScale;
		this.chair.scale.x = initialScale;
		this.chair.scale.y = initialScale;
		this.chair.idleScaleTween = this.game.add.tween(this.chair.scale).to({
			x: [initialScale * 0.95, initialScale * 1.05, initialScale],
			y: [initialScale * 1.05, initialScale * 0.95, initialScale],
		}, 450 + 10*i, Phaser.Easing.Quadratic.InOut, true, 0, -1);

		this.chair.idleScaleTween.repeatDelay(800 + 10 * i);
	}



	getPosition(){
		var location = {};
		location.x = this.chair.x;
		location.y = this.chair.y;
		return location;
	}

	getWidth() {
		return this.chair.width;
	}

	getHeight() {
		return this.chair.height;
	}

	setOption(i){
		this.chair.optionNum = i;

		this.chair.inputEnabled = true;
		this.chair.input.useHandCursor = true;
		this.chair.events.onInputDown.add(function(button) {
			console.log("input" + i);
			this.chair.inputEnabled = false;
			this.game.global.selection = i;
			this.game.onChange.dispatch();
		}, this);
	}

	disableOption() {
		this.chair.inputEnabled = false;
	}

	getOption(){
		return this.chair.optionNum;
	}

	spawnStars() {
		console.log("stars");
        for (var i = 0; i < 80; i++) {

            var scaleMultiplier = .5;

            var particleName = Math.random() > 0.7? "spark-particle" : "star-particle";
            if (particleName == "spark-particle") {
                scaleMultiplier = 0.3;
            }

            var star = new Phaser.Sprite(this.game, 0, 0, particleName);
            this.add(star);
            this.stars.push(star);
            star.anchor.set(0.5);

            if (this.game.global.windowWidth > this.game.global.windowHeight) {
                star.scale.x = this.initialWidth / star.width * (Math.random() * .18) * scaleMultiplier;
                star.scale.y = star.scale.x;
            } else {
                star.scale.x = this.initialWidth / star.width * (Math.random() * .3) * scaleMultiplier;
                star.scale.y = star.scale.x;
            }

            star.x = this.chair.x + this.initialWidth / 2.5 * Math.random();
            star.y = this.chair.y + this.initialHeight * .45 / 2;
            star.angle = Math.random() * 45;


            star.alpha = 0;

            var initialScale = star.scale.x;
            var initialY = star.y;
            var initialX = star.x;

            var finalXMultiplier = 0.3;
            if (this.game.global.windowWidth > this.game.global.windowHeight) {
                finalXMultiplier = 0.2;
            }
            //     if (this.game.global.windowWidth >= 768) {
            //         finalXMultiplier = 0.5;
            //     }
            // }

            var finalX = initialX + this.initialWidth * finalXMultiplier * (Math.random() > 0.5 ? 1 : -1);
            var finalYMultiplier = 5;
            if (this.game.global.windowWidth > this.game.global.windowHeight) {
                finalYMultiplier = 2.5;
            }
            var finalY = initialY - Math.random() * this.initialHeight * finalYMultiplier;
            var finalScale = initialScale * Math.random();

            var delay = i * 5;
            var duration = Math.random() * 1000 + 2000;

            Utils.starFloatWithDelayCustom2(this.game, star, finalX, finalY, finalScale, duration, delay, Phaser.Easing.Quadratic.Out);
            // this.chair.bringToTop();
        }
    }

}

export default Chair;