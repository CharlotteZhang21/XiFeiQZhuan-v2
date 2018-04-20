import * as AnimationsUtil from '../utils/slot-animations-util.js';

export function preload(game) {
	game.load.spritesheet('original', PiecSettings.assetsDir + 'character_move.png', 202, 349, 27);
}

export function play(game, layer,containerName) {

	var container = document.getElementById(containerName);
	var xPositions = [0]; //expressed as relative percentages to coin effect area
	var yPositions = [50]; //expressed as relative percentages to coin effect area
	var delays = [0];
	var loops = [0];
	var scales = [100];

	var animations = AnimationsUtil.playAnimations("original", xPositions, yPositions, delays, loops, 0.5, 10, scales, false, container, game, layer);

	return animations;
}