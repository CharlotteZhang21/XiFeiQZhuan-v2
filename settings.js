var PiecSettings = PiecSettings || {};

PiecSettings.version = "-";

PiecSettings.timer = 6000;

// PiecSettings.autospin = {
//     activateAfter: 3000,
// }

PiecSettings.ASOI = 'HIGH';

//////// DEFAULT SETTINGS FOR SLOT GAMES ////////

PiecSettings.fontColor = "#1e5183"; //Remove empty if you want to use the default golden gradient
PiecSettings.fontFamily = "'Microsoft Yahei','微软雅黑'"; //Make sure that this font is on the css and that there is a div that uses it. (preload-font div)

//////// SLOTS GAME SETTINGS ///////////////

PiecSettings.tooltip = { // If there is a "src" value, it will always pic the image.
    text: "SPIN TO\nWIN!",
    fontColor: "#1e5183", //Remove if you want to use the default golden gradient
    src: 'tooltip.png',
};

PiecSettings.options = ["innocent", "naughty"]; 

PiecSettings.girls = {
	innocent: [0, 1, 2, 3], // 0: original, 1: changed hair, 2: changed clothes
	naughty: [0, 1, 2, 3] // 0: original, 1: changed hair, 2: changed clothes
}

PiecSettings.text = {
	girlDialog : ['text_0', 'text_1', 'text_2', 'text_3'],
	emperorDialog: ['emperor_text_0', 'emperor_text_1']
};


