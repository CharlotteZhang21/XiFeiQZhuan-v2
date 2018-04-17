import * as Utils from '../utils/util';

class Tooltip extends Phaser.Group {
	constructor(game) {
		super(game);

		this.hand = new Phaser.Sprite(this.game, 0, 0, "hand");
		Utils.fitInContainer(this.hand, "option1");
		this.add(this.hand);
		this.hand.anchor.set(0.5);
		this.hand.alpha = 0;
		// this.hand.x = ;
	}

	moveHandToItem(item) {
		Utils.display(this.game, this.hand, 1000);
		this.hand.y = item.getPosition().y + item.getHeight()/2.8;
		var moveTween = this.game.add.tween(this.hand).to({
			x: item.getPosition().x + item.getWidth() / 2,
		}, 1000, Phaser.Easing.Quadratic.InOut, true);

		var tween = this.game.add.tween(this.hand).to({
			angle: [-15, 0]
		}, 300, Phaser.Easing.Quadratic.InOut, true, 0, 500, -1);

		tween.yoyo(true, 100);


		moveTween.onComplete.add(function(){
					this.game.add.tween(this.hand).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true, 1000);
				},this);

	}

	moveHandToManyItems(items){

		Utils.display(this.game, this.hand, 800);

		var handMoveDuration = 800;
		var handTapDuration = 300;

		var tween = this.game.add.tween(this.hand).to({
			angle: [-15, 0]
		}, handTapDuration, Phaser.Easing.Quadratic.InOut, true, 0, 500, -1);


		tween.yoyo(true, handMoveDuration);

		for(var i = 0; i < items.length; i++) {
			var targetX = items[i].getPosition().x + items[i].getWidth() / 2,
			targetY = items[i].getPosition().y + items[i].getHeight() / 2;
			var moveTween = this.game.add.tween(this.hand).to({x: targetX, y: targetY}, handMoveDuration, Phaser.Easing.Quadratic.InOut, true, handMoveDuration * i + handTapDuration );
			this.hand.x = targetX;
			this.hand.y = targetY;

			if(i == (items.length - 1)) 
				moveTween.onComplete.add(function(){
					this.game.add.tween(this.hand).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true, 200);
				},this);
		}

		

		

	}
}

export default Tooltip;