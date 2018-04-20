import * as FxRenderer from '../utils/fx-renderer.js';
import * as Utils from '../utils/util';

class Character extends Phaser.Group {
	constructor(game, characterName, fxEffectsLayer) {
		super(game);

		this.fxEffectsLayer = fxEffectsLayer;
		this.characterName = characterName;

	}

	//character intro
	initCharacter(name){

		this.originalAni = FxRenderer.playFx(this.game, this.fxEffectsLayer, name);
		this.happyAni = this.originalAni[0];
		this.happyAni.sendToBack();

	}

	//happy character

	changeToHappy(name){

		this.hide(50);
		console.log(name);
		var happyAni = FxRenderer.playFx(this.game, this.fxEffectsLayer, name);
		this.happyAni = happyAni[0];
		this.happyAni.sendToBack();
	}


	animate(delay = 300, duration = 1000){
		
		var id = this.characterName + '-final';
		var container = document.getElementById(id);
		var finalX = Utils.getContainerX(id) + Utils.getContainerWidth(id)/2;
		var finalY = Utils.getContainerY(id) + Utils.getContainerHeight(id)/2;
		var finalWidth = Utils.getContainerWidth(id);
		var finalHeight = Utils.getContainerHeight(id);
		 this.game.time.events.add(delay, function(){
		 	Utils.display(this.game, this, 100);
		 	this.game.add.tween(this.happyAni).to({x: finalX, y: finalY}, duration, Phaser.Easing.Linear.None, true, 0);
		 	// this.game.add.tween(this.happyAni.scale).to({x: finalWidth, y: finalHeight}, duration, Phaser.Easing.Linear.None, true, 0);
		 
		 },this);


	}


	
	spawnGold(){
		 for (var i = 0; i < 10; i++) {

            var scaleMultiplier = .2;

            var gold = new Phaser.Sprite(this.game, 0, 0, 'gold');
            this.add(gold);
            // this.golds.push(gold);
            gold.anchor.set(0.5);

            if (this.game.global.windowWidth > this.game.global.windowHeight) {
                gold.scale.x = this.happyAni.width / gold.width * scaleMultiplier;
                gold.scale.y = gold.scale.x;
            } else {
                gold.scale.x = this.happyAni.width / gold.width * scaleMultiplier;
                gold.scale.y = gold.scale.x;
            }

            gold.x = this.happyAni.x + this.happyAni.width * .5 / (i+1);
            // console.log(this.happyAni.y);
            gold.y = this.happyAni.y;
            gold.angle = Math.random() * 45;


            gold.alpha = 0;

            var initialScale = gold.scale.x;
            var initialY = gold.y;
            var initialX = gold.x;

            var finalXMultiplier = 0.3;
            if (this.game.global.windowWidth > this.game.global.windowHeight) {
                finalXMultiplier = 0.2;
            }
            //     if (this.game.global.windowWidth >= 768) {
            //         finalXMultiplier = 0.5;
            //     }
            // }

            var finalX = this.happyAni.x + this.happyAni.width * .4 / (i+1);
            var finalYMultiplier = 5;
            if (this.game.global.windowWidth > this.game.global.windowHeight) {
                finalYMultiplier = 2.5;
            }
            var finalY = this.happyAni.y + this.happyAni.height / 2;
            var finalScale = initialScale * .2;

            var delay = i * 100 * Math.random() ;
            var duration = Math.random() * 1000 + 800;

            Utils.starFloatWithDelayCustom2(this.game, gold, finalX, finalY, finalScale, duration, delay, Phaser.Easing.Quadratic.Out)

            // Utils.goldFloatWithDelayCustom2(this.game, gold, finalX, finalY, finalScale, duration, delay, Phaser.Easing.Quadratic.Out);
            // this.girl.bringToTop();
        }
	}




	hide(delay = 100) {
		this.game.time.events.add(delay, function(){
			this.originalAni[0].visible = false;

		},this);
	}

	fade() {

		var tween = this.game.add.tween(this).to({alpha: 0}, 800, Phaser.Easing.Quadratic.In, true, 0);

	}

}

export default Character;