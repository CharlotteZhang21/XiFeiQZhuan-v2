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


         this.game.load.image('cta', PiecSettings.assetsDir + 'cta.png');

         this.game.load.image('character', PiecSettings.assetsDir + 'character.png');

         this.game.load.image('armchair_old', PiecSettings.assetsDir + 'armchair_old.png');
         this.game.load.image('armchair_blue', PiecSettings.assetsDir + 'armchair_blue.png');
         this.game.load.image('armchair_orange', PiecSettings.assetsDir + 'armchair_orange.png');
         this.game.load.image('armchair_yellow', PiecSettings.assetsDir + 'armchair_yellow.png');

         this.game.load.image('dialogBg', PiecSettings.assetsDir + 'box_bg.png');

         this.game.load.image('hand', PiecSettings.assetsDir + 'hand.png');

         this.game.load.image('spark-particle', PiecSettings.assetsDir + 'spark-particle.png');
         this.game.load.image('star-particle', PiecSettings.assetsDir + 'star-particle.png');

         this.game.global.animations = {};
         
         PiecSettings.animation = PiecSettings.animation || {};

         var defaultAnimation = {
            frameRate: 60,
            scale: 1
         };

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
