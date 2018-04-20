import * as Utils from '../utils/util';

class Arrow extends Phaser.Group {
	constructor(game, containerName, scale) {
		super(game);

		this.active = false;

		var arrow_active = new Phaser.Sprite(this.game, 0, 0, "arrow");
		var arrow_disable = new Phaser.Sprite(this.game, 0, 0, "arrow-disabled");
		

		this.arrow_active = arrow_active;
		this.arrow_disable = arrow_disable;


		this.arrow_active.scale.x *= scale;
		this.arrow_disable.scale.x *= scale;

		Utils.fitInContainer(arrow_active, containerName, 0.5, 0.5);
		Utils.fitInContainer(arrow_disable,containerName, 0.5, 0.5);
		this.add(this.arrow_active);
		this.add(this.arrow_disable);

		// this.arrow_disable.inputEnabled = false;
		this.arrow_active.inputEnabled = true;

		this.setActive(this.active);

		// this.hand.x = ;
	}

	popUp(obj, delay, duration, pulsing = false, i = 0){

		var initialScale = obj.scale.x;

		this.buttonScale = initialScale;

		obj.scale.x = 0;
		obj.scale.y = 0;

		var scaleTween = this.game.add.tween(obj.scale).to({x: [initialScale * 1.02, initialScale], y: [initialScale * 1.02, initialScale]}, duration, Phaser.Easing.Quadratic.In, true, delay);


	}

	setActive(active){

		if(active){
			this.arrow_active.alpha = 1;
			this.arrow_disable.alpha = 0;
			this.arrow_active.inputEnabled = true;
		}else{
			this.arrow_disable.alpha = 1;
			this.arrow_active.alpha = 0;
			this.arrow_active.inputEnabled = false;
		}
	}

	setListener(i){

		// this.arrow_active.inputEnabled = true;
		this.arrow_active.input.useHandCursor = true;
		this.arrow_active.events.onInputDown.add(function(button) {
			console.log("input" + i);
			this.game.global.currentOutfit += i;
			if(this.hand)
				this.hideToolTip();
			// this.game.global.selection = i;
			this.game.onInteract.dispatch();
		}, this);
	}

	hide() {}

	showToolTip(){
		var hand = new Phaser.Sprite(this.game, 0, 0, "hand");
		hand.x = this.arrow_active.x;
		hand.y = this.arrow_active.y;
		hand.scale.x = this.arrow_active.width * 1.5/ hand.width;
		hand.scale.y = hand.scale.x;

		var scale = hand.scale.x;
		this.add(hand);

		this.hand = hand;

		var tween = this.game.add.tween(hand.scale).to({x: [scale*1.2, scale], y:[scale * 1.2, scale]}, 500, Phaser.Easing.Back.In, true, 0, -1);
		tween.repeatDelay(500);


	}	

	hideToolTip(){
		var tween = this.game.add.tween(this.hand.scale).to({x: [0], y:[0]}, 500, Phaser.Easing.Back.In, true, 0, -1);
		this.game.add.tween(this.hand).to({alpha: 0}, 100, Phaser.Easing.Linear.None, true, 0);

		tween.onComplete.add(function(){
			this.hand.destroy();
		},this);
	}


}

export default Arrow;