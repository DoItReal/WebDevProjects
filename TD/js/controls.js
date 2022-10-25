var pressedKeys = new Map();
//event listeners canvas
function init_events_controls() {
    //event listener on 'keydown'
    canvas.addEventListener('keydown', handleKeyDown, false);
    canvas.addEventListener('keyup', handleKeyUp, false);

    //event listener on 'mouseenter'
    canvas.addEventListener('mouseenter', setFocus, false);

    //event listener on 'mouseout'
    canvas.addEventListener('mouseout', blurFocus, false);

    //event listener on 'mousemove'
    canvasScr.addEventListener('mousemove', mouseMove, false);

    //event listener on 'mousedown'
    canvasScr.addEventListener('mousedown', mouseDown, false);
}
function setFocus() {
    canvas.focus();
}
function blurFocus() {
    canvas.blur();
}

const KeyCodes = new Map();
KeyCodes.set('37', 'left');
KeyCodes.set('38', 'up');
KeyCodes.set('39', 'right');
KeyCodes.set('40', 'down');

function addKey(key) {
    if (pressedKeys.has(key)) {
        return 0;
    } else {
        pressedKeys.set(key, KeyCodes.get(String(key)));
    }
}
function removeKey(key) {
    if (pressedKeys.has(key)) {
        pressedKeys.delete(key);
    }
}

function handleKeyDown(e) {
    if (e.keyCode == '39') { //arrow right
        addKey(e.keyCode);
    } else if (e.keyCode == '37') { //arrow left
        addKey(e.keyCode);
    } else if (e.keyCode == '38') { //arrow up
        addKey(e.keyCode);
    } else if (e.keyCode == '40') { //arrow down
        addKey(e.keyCode);
    }
}
function handleKeyUp(e) {
    if (e.keyCode == '39') { //arrow right
        removeKey(e.keyCode);
    } else if (e.keyCode == '37') { //arrow left
        removeKey(e.keyCode);
    } else if (e.keyCode == '38') { //arrow up
        removeKey(e.keyCode);
    } else if (e.keyCode == '40') { //arrow down
        removeKey(e.keyCode);
    }
}


//event listeners canvasScr
function mouseMove(e) {
    mousePosScr = getMousePos(canvasScr, e);
    console.log("x: " + mousePosScr.x + ' // y: ' + mousePosScr.y);
}
function mouseDown(e) {
    let button = e.button;
    console.log('Button: ' + button + ' pressed at x: ' + mousePosScr.x + ' y: ' + mousePosScr.y);
}

//get mouse position relative to the position of the canvas
function getMousePos(canv, e) {
    var rect = canv.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    }
}
