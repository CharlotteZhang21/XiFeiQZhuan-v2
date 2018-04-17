import * as Util from '../utils/util';

import * as Congrats from '../animations/congrats.js';
import * as Sad from '../animations/sad.js';
// import * as CoinLineBurst02 from '../animations/coin-line-burst-02.js';

export function preloadFx(game) {


    Congrats.preload(game);
    Sad.preload(game);    
}

export function playFx(game, layer, animationName) {

    
    switch (animationName) {
        case "congrats" : 
            var conAni = Congrats.play(game, layer);
            return conAni;
            break;
        case "sad" : 
            var sadAni = Sad.play(game, layer);  
            return sadAni; 
            break; 
    }
}
