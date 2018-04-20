import * as Util from '../utils/util';

import * as Original from '../animations/original.js';
import * as Changed from '../animations/changed.js';
import * as Emperor from '../animations/emperor.js';
// import * as CoinLineBurst02 from '../animations/coin-line-burst-02.js';

export function preloadFx(game) {


    Original.preload(game);
    Changed.preload(game);    
    Emperor.preload(game);
}

export function playFx(game, layer, animationName) {
    console.log("playFX" + animationName);
    switch(animationName){
        case 'original':
            var ani = Original.play(game, layer, 'girl');
            return ani;
            break;
        case 'emperor-walking':
            var loop = 3;
            var persistent = false;
            var ani = Emperor.play(game, layer, animationName, 'emperor', loop, persistent);
            return ani;
            break;  
        case 'emperor-reward' : 
            var loop = 0;
            var persistent = true;
            var ani = Emperor.play(game, layer, animationName, 'emperor-final', loop, persistent);
            return ani;
            break;
        default:
            var ani = Changed.play(game, layer, animationName, 'girl');  
            return ani;
            break;
    }
}
