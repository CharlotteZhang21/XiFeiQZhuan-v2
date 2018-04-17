import * as FxRenderer from '../utils/fx-renderer.js';
import * as Utils from '../utils/util';
import Chair from '../prefabs/chair';
import Tooltip from '../prefabs/tooltip';

class Dialog extends Phaser.Group {
	constructor(game, fxEffectsLayer) {
		super(game);

		this.container = "dialog";

		this.createDialogBg();


	}

	createDialogBg(){

		this.dialogBg = this.game.add.sprite(0, 0, 'dialogBg');
		this.add(this.dialogBg);
		Utils.display(this.game, this.dialogBg, 100);
		
		Utils.fitInContainer(this.dialogBg, this.container);
		this.createText("Is that my chair?!");
		Utils.display(this.game, this.textField, 100);

		this.game.time.events.add(2000, function(){
			this.changeTextTo("Please help me\n choose a new one!", 2000);
		},this)
	}

	createText(text) {
		var containerWidth = Utils.getContainerWidth(this.container);
		var containerHeight = Utils.getContainerHeight(this.container);
		var containerX = Utils.getContainerX(this.container);
		var containerY = Utils.getContainerY(this.container);
		this.fontSize = containerHeight * .3;

		var style = {
			font: "bold " + this.fontSize + "px " + PiecSettings.fontFamily,
		};

		this.textField = new Phaser.Text(this.game, 0, 0, text, style);
		this.add(this.textField);
		this.textField.anchor.set(0.5, 0.5);
		this.textField.align = 'center';
		this.textField.padding.set(this.fontSize/2, 0);
		this.textField.x = containerX + containerWidth / 2 ;
		this.textField.y = containerY + containerHeight / 2;
		// this.textField.y += this.fontSize/2;

		if (PiecSettings.fontColor != null) {
			this.textField.fill = PiecSettings.fontColor;
			// this.textField.setShadow(2,3,'rgb(0,0,0)', 0);
		} else {
			this.textField.stroke = "#ff9d1b";
		}
	}

	changeTextTo(value, duration, showOptions = true) {
		this.textField.text = "" + value;
		var textTween = this.game.add.tween(this.textField.scale).to( {x: [0, 1.2, 1], y: [0, 1.2, 1]}, duration * 1/5, Phaser.Easing.Linear.None, true, 0);

		if(showOptions)
			textTween.onComplete.add(function(){
				var textTween2 = this.game.add.tween(this.textField.scale).to( {x: [1.2, 0], y: [1.2, 0]}, duration * 1/5, Phaser.Easing.Linear.None, true, 1000);
				textTween2.onComplete.add(function(){
					this.createOptions();
				},this);
				
			}, this);	
	}


	createOptions() {
		this.options = [];
		var delay = 200;
		var duration = 500;
		var totalDelay = 0;

        for(var i = 0; i < PiecSettings.options.length; i++){
        	var divName = "option" + (i+1);
            var option = new Chair(this.game, PiecSettings.options[i], divName);


			option.setOption(i);

            this.add(option);
            this.options.push(option);
          
            option.popUp(delay * i, duration, true, i);

			// option.shaking(i);
            totalDelay += delay * i;

        }

	}

	hideOptions(customDelay) {

		var delay = 300;
		var duration = 500;
		var totalDelay = 0;
		for(var i = 0; i < this.options.length; i++){
        	
            this.options[i].hide(customDelay + delay * i, duration);
            totalDelay += delay * i;
        }

        this.game.time.events.add(customDelay +  totalDelay, function(){
        	this.changeTextTo("Thank you!", 2000, false);
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