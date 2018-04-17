class Boot extends Phaser.State {

    constructor() {
        super();
    }

    preload() {}

    init() {

        // setup path for asset folder depending on environment
        PiecSettings.assetsDir = PiecSettings.env === 'dev' ? 'assets/' : '';

        var game = this.game;

        // custom game events here        
        game.onGameComplete = new Phaser.Signal(); // generic event hook
        game.onCompleteLevel = new Phaser.Signal(); // generic event hook
        game.onChange = new Phaser.Signal(); // generic event hook
        game.onReelSpinComplete = new Phaser.Signal();
        game.onSpinComplete = new Phaser.Signal();

        if (typeof piec !== 'undefined') {
            // public API methods
            piec.lockGame = function() {

                game.global.locked = true;
            };

            piec.unlockGame = function() {

                game.global.locked = false;
            };

            piec.completeLevel = function() {

                game.onCompleteLevel.dispatch();
            };

            piec.destroyGame = function() {

                game.destroy();
            };

            piec.spin = function() {
                game.onSpin.dispatch();
            };

        }

        // stretch game to fit window
        window.onresize = function() {

            // // resize game
            // // game.scale.setGameSize(
            // //     window.innerWidth * window.devicePixelRatio,
            // //     window.innerHeight * window.devicePixelRatio
            // // );

            // // get current state
            // var currentState = game.state.states[game.state.current];

            // if (currentState.resize) {

            //     // resize the state
            //     currentState.resize();
            // }

            // // if (typeof piec !== 'undefined') {
            // //     // public API methods
            // //     piec.onResize();
            // // }

            game.scale.setGameSize(document.body.clientWidth * window.devicePixelRatio, document.body.clientHeight * window.devicePixelRatio);
            game.scale.refresh();
            game.state.start('boot', true, false);

        };
    }

    create() {

        this.init();

        this.game.input.maxPointers = 1;

        this.initGlobalVariables();

        this.game.state.start('preloader');

        this.game.onMoveStart = function(game) {

            // increament interactions
            game.global.interactions++;

            if (PiecSettings && PiecSettings.onMoveStart) {
                PiecSettings.onMoveStart(game.global.interactions); // call out externally
            }
        };

        this.game.onMoveComplete = function(game) {

            if (PiecSettings && PiecSettings.onMoveComplete) {
                PiecSettings.onMoveComplete(game.global.moveStats); // call out externally
            }
        };
    }

    initGlobalVariables() {
        this.game.global = {
            selection: 0,
            isComplete: false,
        };
    }
}

export default Boot;