import * as FxRenderer from '../utils/fx-renderer.js';

class Character extends Phaser.Group {
	constructor(game, fxEffectsLayer) {
		super(game);

		this.fxEffectsLayer = fxEffectsLayer;


		this.sadCharacter();


	}

	//sad character intro
	sadCharacter(){
		 this.sadAni = FxRenderer.playFx(this.game, this.fxEffectsLayer, "sad");
	}

	//happy character

	changeToHappy(){
		console.log("happy yo");
		this.sadAni[0].visible = false;

		 var happyAni = FxRenderer.playFx(this.game, this.fxEffectsLayer, "congrats");
	}

	createDialog(){

		this.dialogBg = this.game.add.sprite(0, 0, 'dialogBg');
		this.add(this.dialogBg);
		this.fitInContainer(this.dialogBg, 'dialog');
		this.createText("Is that my chair?!");

	}

	fitInContainer(el, divName) {

		var container = document.getElementById(divName);
		var containerWidth = container.offsetWidth * window.devicePixelRatio;
		var containerHeight = container.offsetHeight * window.devicePixelRatio;
		var containerX = container.getBoundingClientRect().left * window.devicePixelRatio;
		var containerY = container.getBoundingClientRect().top * window.devicePixelRatio;

		el.scale.x = containerWidth / el.width;
		el.scale.y = el.scale.x;

		el.x = containerX;
		el.y = containerY;
	}

	createText(text) {

		var container = document.getElementById('dialog-text');
		var containerWidth = container.offsetWidth * window.devicePixelRatio;
		var containerHeight = container.offsetHeight * window.devicePixelRatio;
		var containerX = container.getBoundingClientRect().left * window.devicePixelRatio;
		var containerY = container.getBoundingClientRect().top * window.devicePixelRatio;

		this.fontSize = containerHeight * .7;

		var style = {
			font: "bold " + this.fontSize + "px " + PiecSettings.fontFamily,
		};

		this.textField = new Phaser.Text(this.game, containerWidth/2, containerHeight/2, text, style);
		this.add(this.textField);
		this.textField.anchor.set(0.5, 0.5);
		this.textField.align = 'center';
		this.textField.padding.set(this.fontSize/2, 0);
		// this.textField.y += this.fontSize/2;

		if (PiecSettings.fontColor != null) {
			this.textField.stroke = "black";
			this.textField.strokeThickness = 2;
			this.textField.fill = PiecSettings.fontColor;
			this.textField.setShadow(2,3,'rgb(0,0,0)', 0);
		} else {
			this.textField.stroke = "#ff9d1b";
			this.textField.strokeThickness = 5;

			// var gradient = this.textField.context.createLinearGradient(0, 0, 0, this.textField.height);
			// gradient.addColorStop(0, '#fffea5');
			// gradient.addColorStop(1, '#ffab02');

			// this.textField.fill = gradient;
		}
	}

	hide() {
		this.spinButton.button.inputEnabled = false;
		// if (this.dissapearing || PiecSettings.spins.length == this.game.global.spin){
		// 	var tween = this.game.add.tween(this).to({alpha: 0}, 3000, Phaser.Easing.Quadratic.In, true, 0);
		// }
	}

	fade() {

		var tween = this.game.add.tween(this).to({alpha: 0}, 800, Phaser.Easing.Quadratic.In, true, 0);

	}

	show() {
		this.spinButton.button.inputEnabled = true;
		if (this.dissapearing && PiecSettings.spins.length != this.game.global.spin){
			var tween = this.game.add.tween(this).to({y: 0}, 300, Phaser.Easing.Quadratic.In, true, 0);
		}
	}
}

export default Character;