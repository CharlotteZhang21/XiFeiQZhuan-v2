PIXI.utils.skipHello();

//----------------------------------------------------------------------------------------------------------------------
// Vungle specific methods
//----------------------------------------------------------------------------------------------------------------------
if (typeof (actionClicked) !== "function") {
    var actionClicked = window.actionClicked = function(action){
        console.log("%cUser action: %s", "color: #FF00FF;", action);
    }
}

function doSomething(s) {
    return actionClicked(s);
}
//----------------------------------------------------------------------------------------------------------------------

var resizeTimeout = null;
var windowRect = null;
function resize() {
    clearTimeout(resizeTimeout);
    if (Game.instance) {
        if (!windowRect || !windowRect.width || !windowRect.height || windowRect.width !== window.innerWidth || windowRect.height !== window.innerHeight) {
            window.scrollTo(0, 0);
            windowRect = {width: window.innerWidth, height: window.innerHeight};
            if (document.body) {
                document.body.style.width = windowRect.width + "px";
                document.body.style.height = windowRect.height + "px";
            }
            Game.instance.resize(windowRect);
        }
    }
    resizeTimeout = setTimeout(resize, 500);
}

//----------------------------------------------------------------------------------------------------------------------
function checkRun() {

    if (!Game.ready) return;

    if (mraid && mraid.isViewable() && mraid.state === "expanded") {
        return run();
    }
    return run();
}

function run() {
    if (!Game.instance) {
        (new Game(document.body)).run();
    }
    resize();
}

//----------------------------------------------------------------------------------------------------------------------
// Preload assets
Game.preload(checkRun);

window.addEventListener("resize", resize);

var mraid = typeof (mraid) === "undefined" ? undefined : mraid;
if (mraid) {
    mraid.addEventListener("ready", checkRun);
    mraid.addEventListener("stateChange", checkRun);
    mraid.addEventListener("viewableChange", checkRun);
    mraid.addEventListener("sizeChange", resize);
    mraid.addEventListener("error", function () {
        console.log("MRAID error", arguments);
    });
    checkRun();
}
else {
    window.addEventListener("load", checkRun);
}
