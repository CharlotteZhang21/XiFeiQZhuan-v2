 import * as Atlas from '../atlas/index';
 import * as Util from '../utils/util';
 import * as Animations from '../animations.js';
 import * as FxRenderer from '../utils/fx-renderer.js';
 import * as CustomPngSequencesRenderer from '../utils/custom-png-sequences-renderer.js';
 import * as WinMessages from '../utils/win-messages-util.js';

 class Preloader extends Phaser.State {

     constructor() {
         super();
         this.asset = null;
     }

     preload() {
         //setup loading bar
         // this.asset = this.add.sprite(this.game.width * 0.5 - 110, this.game.height * 0.5 - 10, 'preloader');
         // this.load.setPreloadSprite(this.asset);

         //Setup loading and its events
         this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
         this.loadResources();
         FxRenderer.preloadFx(this.game);
         // CustomPngSequencesRenderer.preloadPngSequences(this.game);
         WinMessages.preloadWinMessages(this.game);
     }

     update() {}

     loadResources() {

         this.game.load.image('logo', PiecSettings.assetsDir + 'logo.png');

         this.game.load.image('arrow', PiecSettings.assetsDir + 'arrow.png');

         this.game.load.image('hand', PiecSettings.assetsDir + 'hand.png');
         this.game.load.image('arrow-disabled', PiecSettings.assetsDir + 'arrow_disabled.png');


         this.game.load.image('cta', PiecSettings.assetsDir + 'cta.png');

         this.game.load.image('gold', PiecSettings.assetsDir + 'gold.png');

         this.game.load.image('girlDialogBg', PiecSettings.assetsDir + 'box_bg.png');
         this.game.load.image('emperorDialogBg', PiecSettings.assetsDir + 'emperor_text_frame.png');

         this.game.load.image('spark-particle', PiecSettings.assetsDir + 'spark-particle.png');
         this.game.load.image('star-particle', PiecSettings.assetsDir + 'star-particle.png');

         this.game.global.animations = {};
         
         PiecSettings.animation = PiecSettings.animation || {};

         var defaultAnimation = {
            frameRate: 60,
            scale: 1
         };

         if(PiecSettings.girls != undefined ) {
             for (var key in PiecSettings.girls) {
                var girls = PiecSettings.girls[key];
                  if(girls.length > 0) {
                    for (var i=0; i< girls.length; i++) {
                        var spriteName = key + "_" +i; 
                        this.game.load.image(spriteName, PiecSettings.assetsDir + spriteName + '.png');
                    }
                  }
             };
         }

         if(PiecSettings.options != undefined) {
            for(var i =0; i < PiecSettings.options.length; i ++) {
                var spriteName = PiecSettings.options[i];
                this.game.load.image(spriteName, PiecSettings.assetsDir +  "btn_" +  spriteName + '.png');
            }
         }



         if(PiecSettings.text != undefined) {
            for(var key in PiecSettings.text)
                if(PiecSettings.text[key].length > 0) {
                    for(var i=0; i < PiecSettings.text[key].length; i ++) {
                        var spriteName = PiecSettings.text[key][i];
                        this.game.load.image(spriteName, PiecSettings.assetsDir +spriteName + '.png');
                    }
                }
         }

         for (var key in Atlas.default) {
            if (Atlas.default.hasOwnProperty(key)) {

                this.game.load.atlasJSONHash(
                    key,
                    PiecSettings.assetsDir + key + '.png',
                    null,
                    Atlas.default[key]);

                this.game.global.animations[key] = Util.extend(
                    defaultAnimation,
                    PiecSettings.animation[key] || {}
                );
            }
        }
         // this.game.load.spritesheet('some-sprite-sheet', PiecSettings.assetsDir + 'some-sprite-sheet.png', 138, 138);
         
     }

     onLoadComplete() {
         this.game.state.start('endcard');
     }
 }

 export default Preloader;
