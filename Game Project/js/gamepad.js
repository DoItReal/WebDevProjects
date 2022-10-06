
var gamepad;
var inputStates;

var initGamepad = function (inputStatesMain) {
    inputStates = inputStatesMain;
}

function updateGamePadStatus() {
    // get new snapshot of the gamepad properties
    scangamepads();
    // Check gamepad button states
    checkButtons(gamepad);
    // Check joysticks
    checkAxes(gamepad);
}

window.addEventListener("gamepadconnected", function (e) {
    var gamepad = e.gamepad;
    var index = gamepad.index;
    var id = gamepad.id;
    var nbButtons = gamepad.buttons.length;
    var nbAxes = gamepad.axes.length;
    console.log("Gamepad No " + index +
        ", with id " + id + " is connected. It has " +
        nbButtons + " buttons and " +
        nbAxes + " axes");
});

window.addEventListener("gamepaddisconnected", function (e) {
    var gamepad = e.gamepad;
    var index = gamepad.index;
    console.log("Gamepad No " + index + " has been disconnected");
});

// detect axis (joystick states)
function checkAxes(gamepad) {
    if (gamepad === undefined) return;
    if (!gamepad.connected) return;

    // Set inputStates.left, right, up, down
    inputStates.left = inputStates.right = inputStates.up = inputStates.down = false;

    // all values between [-1 and 1]
    // Horizontal detection
    if (gamepad.axes[0] > 0.5) {
        inputStates.right = true;
        inputStates.left = false;
    } else if (gamepad.axes[0] < -0.5) {
        inputStates.left = true;
        inputStates.right = false;
    }

    // vertical detection
    if (gamepad.axes[1] > 0.5) {
        inputStates.down = true;
        inputStates.up = false;
    } else if (gamepad.axes[1] < -0.5) {
        inputStates.up = true;
        inputStates.down = false;
    }

    // compute the angle. gamepad.axes[1] is the 
    // sin of the angle (values between [-1, 1]),
    // gamepad.axes[0] is the cos of the angle
    // we display the value in degree as in a regular
    // trigonometric circle, with the x axis to the right
    // and the y axis that goes up
    // The angle = arcTan(sin/cos); We inverse the sign of
    // the sin in order to have the angle in standard
    // x and y axis (y going up)
    inputStates.angle = Math.atan2(-gamepad.axes[1], gamepad.axes[0]);

}
// Detect button states
function checkButtons(gamepad) {
    // in this function we should add properties to the
    // inputStates object in order to use gamepad buttons
    if (gamepad === undefined) return;
    if (!gamepad.connected) return;

    for (var i = 0; i < gamepad.buttons.length; i++) {
        var b = gamepad.buttons[i];

        if (b.pressed) {
            // do something
            console.log("button pressed");
            if (b.value !== undefined)
                // do something
                console.log("analog button pressed");
        }
    }
}

function scangamepads() {
    var gamepads = navigator.getGamepads();

    for (var i = 0; i < gamepads.length; i++) {
        if (gamepads[i])
            gamepad = gamepads[i];
    }
}