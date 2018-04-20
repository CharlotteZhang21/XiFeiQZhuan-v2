import Logo from '../prefabs/logo';
import CtaButton from '../prefabs/cta-button';
import Character from '../prefabs/character';
import DialogBox from '../prefabs/dialog';
import Girl from '../prefabs/girl';
import * as FxRenderer from '../utils/fx-renderer.js';
import Arrow from '../prefabs/arrows';
import * as Utils from '../utils/util';

 class Endcard extends Phaser.State {

     constructor() {
         super();
     }

     create() {

        this.game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
        this.game.scale.setUserScale((1 / window.devicePixelRatio), (1 / window.devicePixelRatio), 0, 0);
        this.game.global.windowHeight = document.body.clientHeight;
        this.game.global.windowWidth = document.body.clientWidth;


        this.dialogBox = new DialogBox(this.game, 'girlDialog', true);
        this.game.add.existing(this.dialogBox);


        this.girlsAllStyles = []; 

        this.fxEffectsLayer = this.game.add.group();

        this.emperor = new Character(this.game, 'emperor', this.fxEffectsLayer);
        this.game.add.existing(this.emperor);
        this.emperor.alpha = 0;

        this.character = new Character(this.game, 'girl', this.fxEffectsLayer);
        this.character.initCharacter('original');
        this.game.add.existing(this.character);


        this.emperorDialog = new DialogBox(this.game, 'emperorDialog', false);
        this.game.add.existing(this.emperorDialog);
        this.emperorDialog.alpha = 0;


        this.arrow_L = new Arrow(this.game, 'arrow_L', 1);
        this.arrow_R = new Arrow(this.game, 'arrow_R', -1);
        this.game.add.existing(this.arrow_L);
        this.game.add.existing(this.arrow_R);

        this.arrow_L.alpha = 0;
        this.arrow_R.alpha = 0;

        
        this.logo = new Logo(this.game);
        this.game.add.existing(this.logo);

        this.cta = new CtaButton(this.game);
        this.game.add.existing(this.cta);


        this.game.onInteract.add(this.onInteract, this);

        this.game.onGameComplete.add(this.onChangeComplete, this);

        this.game.time.events.add(PiecSettings.timer, function(){

            document.getElementById('vungle-close').className = 'visible';
        }, this)

        this.initFlag = false;




     }

     render() {
        // render code here
     }

     onStyleChose(styleName) {
        this.styleArray = PiecSettings.girls.styleName;
     }

     onInteract() {
        if(document.getElementById('vungle-close').className != 'visible');
            document.getElementById('vungle-close').className = 'visible';

        this.arrow_R.setActive(false);
        this.arrow_L.setActive(false);

        var selectedStyle; //innocent or naughty
        var currentOutfit = this.game.global.currentOutfit; //which outfit is it now?
        
        if(!this.initFlag){
            this.initFlag = true;
            selectedStyle = this.game.global.selectedStyle;
            var currentStyleArray = PiecSettings.girls[selectedStyle];
            this.currentStyleArray = currentStyleArray;
            this.initGirl(selectedStyle, currentStyleArray);

            var hideDelay = 0, hideDuration = 300;
            this.character.hide(hideDelay, hideDuration);

        }else{
            var previousGirl = this.girlsAllStyles[this.previousOutfit];
            previousGirl.alpha = 0;

            var currentGirl = this.girlsAllStyles[currentOutfit];
            currentGirl.alpha = 1;
            currentGirl.spawnStars();

            this.game.time.events.add(1000, function(){

                this.arrow_R.setActive(true);
                this.arrow_L.setActive(true);
            },this);
            this.previousOutfit = currentOutfit;
            if(currentOutfit == (this.girlsAllStyles.length-1)){
                this.arrow_R.setActive(false);
                this.game.add.tween(this.dialogBox).to({y: -100, alpha: 0}, 500, Phaser.Easing.Back.In, true, 0);
        
                this.game.time.events.add(1000, function(){
                    this.game.add.tween(this.arrow_L).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true, 0);
                    
                    this.game.add.tween(this.arrow_R).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true, 0);
                   
                   

                    currentGirl.hideWithTween(0, 120);
                    this.game.onGameComplete.dispatch();

                }, this);

                
                // this.character.
            }
            else{
                if (currentOutfit == 0)
                  this.arrow_L.setActive(false);
            } 
        }
            

        var popUpDelay = 300, popUpDuration = 500;
        // selectedItem.popUp(popUpDelay, popUpDuration);
        // var text = "换件衣服试试";
        var text_num = currentOutfit + 1; 
        console.log("text: " + text_num);
        if(text_num != PiecSettings.text.length)
             this.dialogBox.changeTextTo(text_num, popUpDelay, false);
        
       
     }

     initGirl(selectedStyle, currentStyleArray) {
        //init girl outfits array
        for(var i = 0; i < currentStyleArray.length; i++ ){
            var girl = new Girl(this.game, selectedStyle+"_"+currentStyleArray[i]);  
            this.girlsAllStyles.push(girl);
            this.game.add.existing(girl);
         
            girl.alpha = 0;
            
        }
        this.previousOutfit = 0;
        
        this.girlsAllStyles[0].spawnStars();
        this.girlsAllStyles[0].alpha = 1;

        this.arrow_L.alpha = 1;
        this.arrow_R.alpha = 1;
        this.arrow_R.setActive(true);
        this.arrow_R.showToolTip();

        this.arrow_L.setListener(-1);
        this.arrow_R.setListener(1);
     }



     onChangeComplete() {
        this.character.alpha = 1;
        this.character.changeToHappy(this.game.global.selectedStyle);
        this.character.animate(100, 800);


        var emperorDialogTween = this.game.add.tween(this.emperorDialog).to({alpha: 1}, 500, Phaser.Easing.Linear.In, true, 100);
        this.emperorDialog.popUp(100, 1000);

        this.game.time.events.add(1000, function(){
            this.emperor.initCharacter('emperor-walking');
            this.emperor.animate(300, 1000);
            
            this.game.time.events.add(1200, function(){
                this.emperorDialog.changeTextTo(1, 1000, false);

                this.emperor.changeToHappy('emperor-reward');
                this.emperor.spawnGold()

            },this);


            this.game.time.events.add(3500, function(){
                this.game.add.tween(this.emperorDialog).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true, 0);
                // this.logo.alpha = 1;
                this.logo.animate();
                this.cta.animate();

                if(PiecSettings.ASOI == 'HIGH')
                    this.game.time.events.add(1200, function(){
                        doSomething('download');
                    },this);
            },this);            


        },this);
       



     }

     onLoop() {
        console.log("looping");
     }
 }

 export default Endcard;
