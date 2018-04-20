  import * as Util from '../utils/util';
  import * as CustomPngSequencesRenderer from '../utils/custom-png-sequences-renderer.js';

class LifeBar extends Phaser.Group{
	constructor(game){
		super(game);
		this.createLifeBar();
		this.amount = 100;
		this.initialWidth;
	}

	setCta(cta) {
		this.cta = cta;
	}

	createLifeBar() {
		var barBg = this.game.add.sprite(0,0,'bar-bg');
		this.add(barBg);

		var barFilling = this.game.add.sprite(0,0,'bar-fill');
		this.add(barFilling);

		barFilling.x = this.width/100;
		barFilling.y = this.height/100 * 7;

		barFilling.scale.x = (this.width - this.width/100 * 2) / barFilling.width;
		barFilling.scale.y = barBg.height / barFilling.height * 0.79;

		this.fullWidthFilling = barFilling.scale.x;
		this.initialWidth = this.width;


		this.barFilling = barFilling;
	}

	decreaseLifeBar(value) {
		if (this.amount - value > 0)
			this.amount -= value;
		else
			this.amount = 0;

		var scaleTween = this.game.add.tween(this.barFilling.scale).to(
			{x:this.fullWidthFilling * (this.amount/100)}, 300, Phaser.Easing.Quadratic.InOut, true, 0);

		var delay = Math.random() * 500;
		this.game.time.events.add(delay, function() {
			this.cta.playTrail();
			var bloodAnim = CustomPngSequencesRenderer.playPngSequence(this.game, PiecSettings.pngAnimations[0], this);
			bloodAnim.anchor.set(0.5);
			bloodAnim.scale.x = (this.initialWidth/5) / bloodAnim.width;
			bloodAnim.scale.y = bloodAnim.scale.x;
			bloodAnim.x = this.initialWidth * window.devicePixelRatio / 100 * (Math.random() * 100) * 0.2;
		}, this);
	}

}

export default LifeBar;