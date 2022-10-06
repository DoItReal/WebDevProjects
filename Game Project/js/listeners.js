function addListeners(inputStates, canvas) {
    window.addEventListener('keydown', function (event) {
        if (event.keyCode === 37) {
            inputStates.left = true;
        } else if (event.keyCode === 38) {
            inputStates.up = true;
        } else if (event.keyCode === 39) {
            inputStates.right = true;
        } else if (event.keyCode === 40) {
            inputStates.down = true;
        } else if (event.keyCode === 32) {
            inputStates.space = true;
        }
    }, false);
    // If the key is released, change the states object
    window.addEventListener('keyup', function (event) {
        if (event.keyCode === 37) {
            inputStates.left = false;
        } else if (event.keyCode === 38) {
            inputStates.up = false;
        } else if (event.keyCode === 39) {
            inputStates.right = false;
        } else if (event.keyCode === 40) {
            inputStates.down = false;
        } else if (event.keyCode === 32) {
            inputStates.space = false;
        }
    }, false);

    // Mouse event listeners
    canvas.addEventListener('mousemove', function (evt) {
        inputStates.mousePos = getMousePos(evt, canvas);
    }, false);
    canvas.addEventListener('mousedown', function (evt) {
        inputStates.mousedown = true;
        inputStates.mouseButton = evt.button;
       // to add sounds
    //    if (evt.button = "b0") playSound();
    }, false);
    canvas.addEventListener('mouseup', function (evt) {
        inputStates.mousedown = false;
    }, false);
}

function getMousePos(evt, canvas) {
    // Necessary to take into account CSS boudaries
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}