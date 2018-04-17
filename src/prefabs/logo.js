class Logo extends Phaser.Group {
	constructor(game) {
		super(game);

		this.logo = this.game.add.sprite(0, 0, 'logo');
		this.add(this.logo);
		this.logo.anchor.set(0.5);

		this.logo.alpha = 0;

		this.fitInContainer();

	}

	fitInContainer(){
		this.container = document.getElementById("logo");
		var containerWidth = this.container.offsetWidth * window.devicePixelRatio;
		var containerHeight = this.container.offsetHeight * window.devicePixelRatio;
		var containerX = this.container.getBoundingClientRect().left * window.devicePixelRatio;
		var containerY = this.container.getBoundingClientRect().top * window.devicePixelRatio;
		
		this.initialLogoWidth = this.logo.width;
		this.logo.scale.x = containerWidth / this.initialLogoWidth;
		this.logo.scale.y = this.logo.scale.x;
		this.logo.x = containerX + containerWidth / 2;
		this.logo.y = containerY + containerHeight / 2;

		this.game.add.tween(this.logo).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 0);
	}

	//Animates from "logo" container to "final-logo" container
	animate() {
		var finalContainer = document.getElementById("logo-final");
		var finalContainerWidth = finalContainer.offsetWidth * window.devicePixelRatio;
		var finalContainerHeight = finalContainer.offsetHeight * window.devicePixelRatio;
		var finalContainerX = finalContainer.getBoundingClientRect().left * window.devicePixelRatio + finalContainerWidth / 2;
		var finalContainerY = finalContainer.getBoundingClientRect().top * window.devicePixelRatio + finalContainerHeight /2;

		var newScale = finalContainerWidth/this.initialLogoWidth;

		var positionTween = this.game.add.tween(this.logo).to({x: finalContainerX, y: finalContainerY}, 1000, Phaser.Easing.Quadratic.InOut, true, 0);
		var scaleTween = this.game.add.tween(this.logo.scale).to({x: newScale, y: newScale}, 1000, Phaser.Easing.Quadratic.InOut, true, 0);
		var rotationTween = this.game.add.tween(this.logo).to({angle: 360}, 1000, Phaser.Easing.Back.InOut, true, 0);
	}
}

export default Logo;