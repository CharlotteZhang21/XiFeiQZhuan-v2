import Logo from '../prefabs/logo';
import CtaButton from '../prefabs/cta-button';
import Character from '../prefabs/character';
import DialogBox from '../prefabs/dialog';
import Chair from '../prefabs/chair';
import * as FxRenderer from '../utils/fx-renderer.js';

 class Endcard extends Phaser.State {

     constructor() {
         super();
     }

     create() {

        this.game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
        this.game.scale.setUserScale((1 / window.devicePixelRatio), (1 / window.devicePixelRatio), 0, 0);

        // this.tooltip = new Tooltip(this.game, this.darkOverlay, this.spinOverlay.spinButton);
        // this.game.add.existing(this.tooltip);


        this.dialogBox = new DialogBox(this.game);
        this.game.add.existing(this.dialogBox);


       
        this.currentChair = new Chair(this.game, 'armchair_old', "chair");
        this.game.add.existing(this.currentChair);


        //this furniture in the house
        this.options = [];

        for(var i = 0; i < PiecSettings.options.length; i++){
            var option = new Chair(this.game, PiecSettings.options[i], "chair");
            this.game.add.existing(option);
            this.options.push(option);
            option.alpha = 0;
            // this.options[i].alpha = 0;
        }

        
        this.logo = new Logo(this.game);
        this.game.add.existing(this.logo);


        this.fxEffectsLayer = this.game.add.group();

        this.character = new Character(this.game, this.fxEffectsLayer);
        this.game.add.existing(this.character);

        this.cta = new CtaButton(this.game);
        this.game.add.existing(this.cta);


        this.game.onChange.add(this.onChange, this);

        this.game.onGameComplete.add(this.onChangeComplete, this);

        this.game.time.events.add(PiecSettings.timer, function(){

            document.getElementById('vungle-close').className = 'visible';
        }, this)


     }

     render() {
        // render code here
     }

     onChange() {
        document.getElementById('vungle-close').className = 'visible';

        for(var i = 0; i < this.options.length; i++ ) {
            this.options[i].disableOption();
        }

        var selectedItem = this.options[this.game.global.selection];
        selectedItem.alpha = 1;
        var hideDelay = 0, hideDuration = 300;
        this.currentChair.hide(hideDelay, hideDuration);
        var popUpDelay = 300, popUpDuration = 500;
        selectedItem.popUp(popUpDelay, popUpDuration);
        this.dialogBox.hideOptions(popUpDelay);


        this.character.changeToHappy();


        this.game.time.events.add(2000, function(){
            this.game.onGameComplete.dispatch();
        }, this);
       
     }



     onChangeComplete() {

        this.game.add.tween(this.dialogBox).to({y: -100, alpha: 0}, 500, Phaser.Easing.Back.In, true, 800);
            this.game.time.events.add(1000, function() {
                this.logo.animate();
                this.cta.animate();
            }, this);
        // }

     }

     onLoop() {
        console.log("looping");
     }
 }

 export default Endcard;
