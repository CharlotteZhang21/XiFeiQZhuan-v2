import * as Utils from '../utils/util';


class Girl extends Phaser.Group {
	constructor(game, girlName) {
		super(game);

		this.container = document.getElementById("girl");
		this.girl = this.game.add.sprite(0,0, girlName);
		this.add(this.girl);
		this.girl.alpha = 0;

		this.stars = [];


		Utils.fitInContaineByHeight(this.girl, 'girl', 0.5, 0.5);

        // if(!Utils.isPortrait()){
        //     this.girl.scale.x *= window.devicePixelRatio* 0.45;
        //     this.girl.scale.y = this.girl.scale.x;
        // }

		this.initialScale = this.girl.scale.x;
		this.initialYPos = this.girl.y;
		this.initialWidth = this.girl.width;
		this.initialHeight = this.girl.height;

		Utils.display(game, this.girl, 100);

	}

	hideWithTween(delay, duration){
		var initScale = this.girl.scale.x;
		var scaleTween = this.game.add.tween(this.girl.scale).to({x: [initScale, 0], y: [initScale, 0]}, duration, Phaser.Easing.Quadratic.In, true, delay);
	
		scaleTween.onComplete.add(function(){
			this.girl.alpha  = 0;
		},this);
	}	




	getPosition(){
		var location = {};
		location.x = this.girl.x;
		location.y = this.girl.y;
		return location;
	}

	getWidth() {
		return this.girl.width;
	}

	getHeight() {
		return this.girl.height;
	}

	

	getOption(){
		return this.girl.optionNum;
	}

	spawnStars() {

        for (var i = 0; i < 40; i++) {

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

            star.x = this.girl.x + this.initialWidth * .1 * Math.random();
            star.y = this.girl.y + this.initialHeight / 2;
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
            var duration = Math.random() * 1000 + 1000;

            Utils.starFloatWithDelayCustom2(this.game, star, finalX, finalY, finalScale, duration, delay, Phaser.Easing.Quadratic.Out);
            // this.girl.bringToTop();
        }
    }

}

export default Girl;