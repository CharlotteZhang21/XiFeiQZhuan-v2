import * as AnimationsUtil from '../utils/slot-animations-util.js';

export function preload(game) {
	game.load.spritesheet('congrats', PiecSettings.assetsDir + 'congrats.png', 302, 302, 27);
}

export function play(game, layer) {

	var container = document.getElementById("character");
	var xPositions = [20]; //expressed as relative percentages to coin effect area
	var yPositions = [30]; //expressed as relative percentages to coin effect area
	var delays = [0];
	var loops = [0];
	var scales = [100];

	var animations = AnimationsUtil.playAnimations("congrats", xPositions, yPositions, delays, loops, 0.5, 10, scales, false, container, game, layer);

	return animations;
}