var PiecSettings = PiecSettings || {};

PiecSettings.version = "-";

PiecSettings.timer = 6000;

// PiecSettings.autospin = {
//     activateAfter: 3000,
// }

//////// DEFAULT SETTINGS FOR SLOT GAMES ////////

PiecSettings.fontColor = "#1e5183"; //Remove empty if you want to use the default golden gradient
PiecSettings.fontFamily = "Poetsenone"; //Make sure that this font is on the css and that there is a div that uses it. (preload-font div)

//////// SLOTS GAME SETTINGS ///////////////

PiecSettings.tooltip = { // If there is a "src" value, it will always pic the image.
    text: "SPIN TO\nWIN!",
    fontColor: "#1e5183", //Remove if you want to use the default golden gradient
    src: 'tooltip.png',
};

PiecSettings.options = [
	"armchair_yellow", "armchair_blue", "armchair_orange"
] 