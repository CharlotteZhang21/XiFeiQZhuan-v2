import * as FxRenderer from '../utils/fx-renderer.js';
import * as Utils from '../utils/util';
import Girl from '../prefabs/girl';
import OptionButton from '../prefabs/option-button';

class Dialog extends Phaser.Group {
	constructor(game, containerName, showOptions) {
		super(game);

		this.container = containerName;
		var spriteName = containerName + 'Bg';

		this.createDialogBg(spriteName, showOptions);
		

	}

	createDialogBg(spriteName, showOptions){

		this.dialogBg = this.game.add.sprite(0, 0, spriteName);
		this.add(this.dialogBg);
		Utils.display(this.game, this.dialogBg, 100);
		
		Utils.fitInContainer(this.dialogBg, this.container, 0.5, 0.5);
		
		this.createText(showOptions);
	}

	createText(showOptions) {

		var character = this.container;

		this.texts = [];
		for(var i = 0; i < PiecSettings.text[character].length; i++) {
			var text = this.game.add.sprite(0, 0, PiecSettings.text[character][i]);
			Utils.fitInContainer(text, this.container, 0.5, 0.5);

			this.texts.push(text); 
			this.add(text);
			text.alpha = 0;
		}
		this.game.time.events.add(100,function(){

			this.currentText = 0;
			this.changeTextTo(0, 100, showOptions);

		},this);

	}

	displayText(i, duration){

		

		var previousText = this.texts[this.currentText];
		
		var textHidingTween = this.hideText(previousText, duration);
		// var duration = 100;
	if (this.texts[i] != undefined)
		textHidingTween.onComplete.add(function(){
			var displayTween = this.game.add.tween(this.texts[i]).to( {alpha: 1}, duration, Phaser.Easing.Linear.None, true, 200);
			this.currentText = i;
			return displayTween;
		}, this);
	}

	hideText(text, duration){
		var duration = 100;
		var textTween = this.game.add.tween(text).to( {alpha: 0}, duration, Phaser.Easing.Linear.None, true, 0);
		return textTween;
	}

	changeTextTo(value, duration, showOptions) {
		
		
		var displayTween = this.displayText(value, duration);


		
		if(showOptions){

			this.game.time.events.add(2000, function(){
				var textTween = this.hideText(this.texts[value], 300);
		
				textTween.onComplete.add(function(){
					this.createOptions();
				},this);

			},this);
					
			
		}
		
	}


	createOptions() {
		this.options = [];
		var totalDelay = 0;

        for(var i = 0; i < PiecSettings.options.length; i++){
        	var divName = "option" + (i+1);
        	
            var option = new OptionButton(this.game, PiecSettings.options[i], divName, i);

            option.setOption(this, PiecSettings.options[i]);
			
			this.buttonScale = option.scale.x;

            this.add(option);
            this.options.push(option);
          
            // totalDelay += delay * i;

        }

	}

	popUp(delay, duration, shaking = false, i = 0){

		var initialScale = this.scale.x;

		this.buttonScale = initialScale;

		this.scale.x = 0;
		this.scale.y = 0;

		var scaleTween = this.game.add.tween(this.scale).to({x: [initialScale * 1.02, initialScale], y: [initialScale * 1.02, initialScale]}, duration, Phaser.Easing.Quadratic.In, true, delay);


	}

	hideOptions(customDelay, text) {

		var delay = 10;
		var duration = 500;
		var totalDelay = 0;
		for(var i = 0; i < this.options.length; i++){
        	this.options[i].hide(customDelay + customDelay + delay * i, duration)
            // this.hide(this.options[i], );
            totalDelay += delay * i;
        }
        // if(text != undefined)
        	// this.changeTextTo(text, duration, false);

        // this.game.add.tween(this.dialogBg).to({alpha:0}, 100, Phaser.Easing.Quadratic.In, true, totalDelay);

	}

	hide(obj, delay, duration){
		var initScale = obj.scale.x;
		var scaleTween = this.game.add.tween(obj.scale).to({x: [initScale * 1.2, 0], y: [initScale * 1.2, 0]}, duration, Phaser.Easing.Quadratic.In, true, delay);
	
		scaleTween.onComplete.add(function(){
			obj.alpha  = 0;
		},this);
	}	

	createTooltip() {
		this.tooltip = new Tooltip(this.game);
        this.add(this.tooltip);
        this.tooltip.x = this.options[1].x;
        this.tooltip.y = this.options[1].y;
        this.tooltip.moveHandToItem(this.options[1]);
        // this.tooltip.moveHandToManyItems(this.options);
	}

}

export default Dialog;