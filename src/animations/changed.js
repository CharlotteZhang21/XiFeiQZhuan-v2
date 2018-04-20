import * as AnimationsUtil from '../utils/slot-animations-util.js';

export function preload(game) {
	game.load.spritesheet('changed_innocent', PiecSettings.assetsDir + 'character_move_1.png', 202, 349, 27);

	game.load.spritesheet('changed_naughty', PiecSettings.assetsDir + 'character_move_2.png', 202, 349, 27);
}

export function play(game, layer, animation, containerName) {

	var container = document.getElementById(containerName);
	var xPositions = [0]; //expressed as relative percentages to coin effect area
	var yPositions = [50]; //expressed as relative percentages to coin effect area
	var delays = [0];
	var loops = [0];
	var scales = [100];

	console.log("play"+animation);

	var animationsName = 'changed_' + animation;

	var ani = AnimationsUtil.playAnimations(animationsName, xPositions, yPositions, delays, loops, 0.5, 10, scales, false, container, game, layer);

	return ani;
}