import * as AnimationsUtil from '../utils/slot-animations-util.js';

export function preload(game) {
	game.load.spritesheet('emperor-walking', PiecSettings.assetsDir + 'emperor-walking.png', 262, 482, 5);
	game.load.spritesheet('emperor-reward', PiecSettings.assetsDir + 'emperor-reward.png', 257, 474, 5);
}

export function play(game, layer, animationsName, containerName) {

	console.log(animationsName);

	var container = document.getElementById(containerName);
	var xPositions = [0]; //expressed as relative percentages to coin effect area
	var yPositions = [50]; //expressed as relative percentages to coin effect area
	var delays = [0];
	var loops = [1];
	var scales = [100];

	// var animationsName = 'changed_' + animations;

	var animations = AnimationsUtil.playAnimations(animationsName, xPositions, yPositions, delays, loops, 0.5, 10, scales, true, container, game, layer);
	return animations;
}