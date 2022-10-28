var pressedKeys = new Map();
//event listeners canvas
function init_events_controls() {
    //event getMousePos
    document.addEventListener('mouseenter', setMousePos, false);
    document.addEventListener('mousemove', setMousePos, false);

    //event listener on 'keydown'
    canvas.addEventListener('keydown', handleKeyDown, false);
    canvas.addEventListener('keyup', handleKeyUp, false);

    //prevent opening context menu on right click;
    canvas.addEventListener('contextmenu', function (e) { e.preventDefault(); }, false);
    canvasScr.addEventListener('contextmenu', function (e) { e.preventDefault(); }, false);
    //event listener on 'mouseenter'
    canvas.addEventListener('mouseenter', setFocus, false);

    //event listener on 'mouseout'
    canvas.addEventListener('mouseout', blurFocus, false);

    //event listener on 'mousemove'
    document.addEventListener('mousemove', mouseMove, false);


    //event listener on 'mousedown' Scoreboard
    canvasScr.addEventListener('mousedown', mouseDownScoreboard, false);

    //event listener on 'mousedown' Playground
    canvas.addEventListener('mousedown', mouseDownPlayground, false);
}
function setMousePos(e) {
    mousePos.x = e.clientX;
    mousePos.y = e.clientY;
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
    e.preventDefault();
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
    e.preventDefault();
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
    e.preventDefault();
    let canv = getCanvasMouseOverlaping(e);
    let relativeMousePos;
    if (canv != null && canv == canvas) {
        relativeMousePos = getMousePos(canv, e);
        handleMouseMovePlayground(relativeMousePos);
    }else if (canv != null && canv == canvasScr) {
        relativeMousePos = getMousePos(canv, e);
        handleMouseMoveScoreboard(relativeMousePos);
    }
}
var clipboard;
function handleMouseMovePlayground(mousePosRelative) {
    if (clipboard != null && play && !pause) { //if there is item in the clipboard 
        game1.updatePreview(mousePosRelative.x, mousePosRelative.y); 
    } else if (clipboard == null && play && !pause) { //if there is no item in the clipboard
    
    }
}
function handleMouseMoveScoreboard(mousePos) {
  //  console.log("x: " + mousePos.x + ' // y: ' + mousePos.y);
}
function mouseDownScoreboard(e) {
    e.preventDefault();
    let button = e.button;
    let canv = getCanvasMouseOverlaping(e);
    let mousePos = getMousePos(canv, e);
    console.log('Button: ' + button + ' pressed at x: ' + mousePos.x + ' y: ' + mousePos.y);
}
function mouseDownPlayground(e) {
    e.preventDefault();
    let button = e.button;
    let canv = getCanvasMouseOverlaping(e);
    let mousePos = getMousePos(canv, e);
    if (button == 0) { //left click  //PLACE, USE, SELECT
        if (clipboard != null && play && !pause) {
            game1.addTower(mousePos.x, mousePos.y, clipboard.type);
            clipboard = null;
        }
    } else if (button == 1) { //scroll (middle button) click
        //to do
    } else if (button == 2) { //right click 
        clipboard = null;       //empty the clipboard // DISMISS
    }
}
function getCanvasMouseOverlaping(e) {
    let canv = null;
    let rect = canvas.getBoundingClientRect();
    if (circRectsOverlap(rect.left,rect.top,canvas.width,canvas.height,e.clientX,e.clientY,5)) {
        canv = canvas;
        return canv;
    }
    rect = canvasScr.getBoundingClientRect();
    if (circRectsOverlap(rect.left, rect.top, canvasScr.width, canvasScr.height, e.clientX, e.clientY, 5)) {
        canv = canvasScr;
        return canv;
    }
    return canv;
}
//get mouse position relative to the position of the canvas
function getMousePos(canv, e) {
    var rect = canv.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    }
}
