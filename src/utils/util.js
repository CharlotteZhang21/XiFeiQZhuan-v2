// get a random integer between range
export function rndInt(max, min) {

    if (!min) {
        min = 0;
    }

    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function sample(array) {

    return array[this.rndInt(array.length - 1, 0)];
}

// get a random color
export function rndRgba(alpha) {

    if (!alpha) {
        alpha = 1;
    }

    return 'rgba(' + this.rndInt(256) + ',' + this.rndInt(256) + ',' + this.rndInt(256) + ',' + alpha + ')';
}

// boolean screen orientation
export function isPortrait() {

    return window.innerHeight > window.innerWidth;
}


// boolean screen orientation
export function clone(obj) {

    return JSON.parse(JSON.stringify(obj));
}

export function remove(array, item) {

    var index = array.indexOf(item);

    if (index > -1) {
        array.splice(index, 1);
    }
}

// remove file extension from string
export function removeExtension(fileName) {

    // if no extension found just return the name
    if (fileName.lastIndexOf('.') === -1) {
        return fileName;
    }

    return fileName.substring(0, fileName.lastIndexOf('.'));
}

// vanilla js fade in functionality
export function fadeIn(el) {

    el.style.opacity = 0;

    var last = +new Date();
    var tick = function() {
        el.style.opacity = +el.style.opacity + (new Date() - last) / 400;
        last = +new Date();

        if (+el.style.opacity < 1) {
            (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16);
        }
    };

    tick();
}

const g = 19.8;

export function calcQuadTime(h) {

    //todo: bugfixes
    //return PiecSettings.fallDuration;

    // based on free fall equation h = 0.5 * g * t^2 
    // (where h = height, g = gravoty on earth (9.8) and t = time)
    // equation re-arranged is t = (2h/g) ^ 0.5

    return Math.sqrt((2 * Math.abs(h)) / g) * 100;
}


export function uniq(a) {

    var prims = { "boolean": {}, "number": {}, "string": {} },
        objs = [];

    return a.filter(function(item) {
        var type = typeof item;
        if (type in prims)
            return prims[type].hasOwnProperty(item) ? false : (prims[type][item] = true);
        else
            return objs.indexOf(item) >= 0 ? false : objs.push(item);
    });
}


export function extend( defaults, options ) {

    var extended = {};
    var prop;
    for (prop in defaults) {
        if (Object.prototype.hasOwnProperty.call(defaults, prop)) {
            extended[prop] = defaults[prop];
        }
    }
    for (prop in options) {
        if (Object.prototype.hasOwnProperty.call(options, prop)) {
            extended[prop] = options[prop];
        }
    }
    return extended;
};

export function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


export function fitInContainer(object, containerName, anchorX = 0, anchorY = 0) {
    var container = document.getElementById(containerName);
    var containerWidth = container.offsetWidth * window.devicePixelRatio;
    var containerHeight = container.offsetHeight * window.devicePixelRatio;
    var containerX = container.getBoundingClientRect().left * window.devicePixelRatio;
    var containerY = container.getBoundingClientRect().top * window.devicePixelRatio;

    object.anchor.set(anchorX, anchorY);

    object.x = containerX + containerWidth * anchorX;
    object.y = containerY + containerHeight * anchorY;
    object.scale.x = containerWidth / object.width;
    object.scale.y = object.scale.x;
}

export function getContainerY(containerName) {
    var container = document.getElementById(containerName);
    return container.getBoundingClientRect().top * window.devicePixelRatio;
}

export function getContainerX(containerName) {
    var container = document.getElementById(containerName);
    return container.getBoundingClientRect().left * window.devicePixelRatio;
}

export function getContainerWidth(containerName) {
    var container = document.getElementById(containerName);
    return container.offsetWidth * window.devicePixelRatio;
}

export function getContainerHeight(containerName) {
    var container = document.getElementById(containerName);
    return container.offsetHeight * window.devicePixelRatio;
}

export function resizeToSizeOfContainer(object, containerName) {
    var container = document.getElementById(containerName);
    var containerWidth = container.offsetWidth * window.devicePixelRatio;
    var containerHeight = container.offsetHeight * window.devicePixelRatio;
    object.scale.x = containerWidth / object.width;
    object.scale.y = object.scale.x;
}

export function display(game, el, duration) {

    el.alpha = 0;
    game.add.tween(el).to({alpha: 1}, duration, Phaser.Easing.Linear.None, true, 50);
}
export function starFloatWithDelayCustom2(game, star, finalX, finalY, finalScale, duration, delay, ease) {
        game.time.events.add(delay, function() {
            star.alpha = 1;
            game.add.tween(star).to({
                // alpha: 0,
                y: finalY,
                x: finalX,
            }, duration, ease, true, 0);
            game.add.tween(star.scale).to({
                x: finalScale,
                y: finalScale
            }, duration, ease, true, 0);
        }, this);

        game.time.events.add(delay + 1000, function() {
            game.add.tween(star).to({
                alpha: 0,
            }, 1000, Phaser.Easing.Quadratic.InOut, true, 0);
            game.time.events.add(1000, function() {
                star.destroy();
            }, this);
        }, this);
    }

