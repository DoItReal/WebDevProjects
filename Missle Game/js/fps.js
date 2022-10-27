// vars for counting frames/s, used by the measureFPS function
var frameCount = 0;
var lastTime;
var fpsContainer;
var fps;

var measureFPS = function (newTime) {

    // test for the very first invocation
    if (lastTime === undefined) {
        lastTime = newTime;
        return;
    }

    //calculate the difference between last & current frame
    var diffTime = newTime - lastTime;

    if (diffTime >= 1000) {
        fps = frameCount;
        frameCount = 0;
        lastTime = newTime;
    }

    //and display it in an element we appended to the 
    // document in the start() function
    if(fps || fps == 0)fpsContainer.innerHTML = 'FPS: ' + fps;
    frameCount++;
};

var initFPSCounter = function () {
    // adds a div for displaying the fps value
    fpsContainer = document.createElement('div');
    fpsContainer.id = 'fpsContainer';
    divControlPanel.appendChild(fpsContainer);
}
function timer(currentTime) {
    var delta = currentTime - oldTime;
    oldTime = currentTime;
    return delta;

}
// High resolution timer
var oldTime = performance.now();
var initFPS = function (time) {
    measureFPS(time);
    delta = timer(time);
}