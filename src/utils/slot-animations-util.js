export function onLoop(sprite, animation) {
	if (animation.loopCount != 0 && animation.loopCount === sprite.numberOfLoops){
		if (!sprite.persistent) {
			animation.loop = false;
			sprite.alpha = 0;
		}
	}
}

export function playAnimation (game, sprite, delay, speed) {
	game.time.events.add(delay, function() {
		sprite.alpha = 1;
		sprite.animations.play('animation', speed, !sprite.persistent);
	});
}

export function playAnimations(spritesheet, xPositions, yPositions, delays, loops, anchor, speed, scale, persistent, container, game, layer) {
	var containerWidth = container.offsetWidth * window.devicePixelRatio;
	var containerHeight = container.offsetHeight * window.devicePixelRatio;
	var containerX = container.offsetLeft * window.devicePixelRatio;
	var containerY = container.offsetTop * window.devicePixelRatio;

	var hUnit = containerWidth/100;
	var vUnit = containerHeight/100;

	var animations = [];

	for (var i = 0; i < xPositions.length; i++) {
		var sprite = game.add.sprite( containerX + xPositions[i] * hUnit, containerY + yPositions[i] * vUnit, spritesheet);
		layer.add(sprite);
		sprite.anchor.set(anchor);
		sprite.animations.add('animation');
		sprite.alpha = 0;
		sprite.persistent = persistent;
		playAnimation(game, sprite, delays[i], speed);
		sprite.scale.x = (containerWidth * scale[i] / 100) / sprite.width;
		sprite.scale.y = sprite.scale.x;
		animations.push(sprite);
		if (loops != null) {
			sprite.numberOfLoops = loops[i];
			sprite.animations.currentAnim.onLoop.add(onLoop, this);
		}
	}

	return animations;
}