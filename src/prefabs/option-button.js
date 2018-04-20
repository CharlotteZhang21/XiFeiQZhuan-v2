import * as Utils from '../utils/util';


class OptionButton extends Phaser.Group {
	constructor(game, optionName, containerName, i) {
		super(game);

		this.button = this.game.add.sprite(0,0, optionName);
		this.add(this.button);
		this.button.alpha = 0;

		this.stars = [];


		Utils.fitInContainer(this.button, containerName, 0.5, 0.5);

		this.initialScale = this.button.scale.x;
		this.initialYPos = this.button.y;
		this.initialWidth = this.button.width;
		this.initialHeight = this.button.height;

		Utils.display(game, this.button, 100);


		var delay = 200;
		var duration = 500;

		this.popUp(this.button, delay * i, duration, true, i);

		this.shaking(this.button, i);


	}

	hide(delay, duration){
		var initScale = this.button.scale.x;
		var scaleTween = this.game.add.tween(this.button.scale).to({x: [initScale * 1.2, 0], y: [initScale * 1.2, 0]}, duration, Phaser.Easing.Quadratic.In, true, delay);
	
		scaleTween.onComplete.add(function(){
			this.button.alpha  = 0;
		},this);
	}


	shaking(obj, i) {

		var initialScale = this.buttonScale;
		obj.scale.x = initialScale;
		obj.scale.y = initialScale;
		var idleScaleTween = this.game.add.tween(obj.scale).to({
			x: [initialScale * 0.95, initialScale * 1.05, initialScale],
			y: [initialScale * 1.05, initialScale * 0.95, initialScale],
		}, 450 + 10*i, Phaser.Easing.Quadratic.InOut, true, 0, -1);

		idleScaleTween.repeatDelay(800 + 10 * i);
	}

	


	popUp(obj, delay, duration, shaking = false, i = 0){

		var initialScale = obj.scale.x;

		this.buttonScale = initialScale;

		obj.scale.x = 0;
		obj.scale.y = 0;

		var scaleTween = this.game.add.tween(obj.scale).to({x: [initialScale * 1.02, initialScale], y: [initialScale * 1.02, initialScale]}, duration, Phaser.Easing.Quadratic.In, true, delay);


	}


	getPosition(){
		var location = {};
		location.x = this.button.x;
		location.y = this.button.y;
		return location;
	}

	getWidth() {
		return this.button.width;
	}

	getHeight() {
		return this.button.height;
	}

	setOption(parent, i){
		this.button.optionNum = i;

		this.button.inputEnabled = true;
		this.button.input.useHandCursor = true;
		this.button.events.onInputDown.add(function(button) {
			console.log("input" + i);
			this.game.global.selectedStyle = i;
			parent.hideOptions();
			this.button.inputEnabled = false;
			this.game.onInteract.dispatch();
		}, this);
	}

	disableOption() {
		this.button.inputEnabled = false;
	}

	getOption(){
		return this.button.optionNum;
	}

}

export default OptionButton;