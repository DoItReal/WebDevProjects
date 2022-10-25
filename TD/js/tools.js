//tools
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
function getRandomBoolean() {
    return Math.random() < 0.5;
}


function visualButtonUpdate() {
    if (play) { //game running
        StartStopButton.value = "Stop";
        StartStopButton.innerHTML = "Stop";
        StartStopButton.style = "background: red;";
        PauseResumeButton.disabled = false;
        if (!pause) {
            PauseResumeButton.value = "Pause";
            PauseResumeButton.innerHTML = "Pause";
            PauseResumeButton.style = "background: gray;";
        } else {
            PauseResumeButton.value = "Resume";
            PauseResumeButton.innerHTML = "Resume";
            PauseResumeButton.style = "background: lightgreen";
        }
    } else { //game not running
        StartStopButton.value = "Start";
        StartStopButton.innerHTML = "Start";
        StartStopButton.style = "background: green;";

        //disable PauseResumeButton if game is not initialized
        PauseResumeButton.disabled = true;
        PauseResumeButton.value = "Pause";
        PauseResumeButton.innerHTML = "Pause";
        PauseResumeButton.style = "background: gray;";
    }
}



function setTimer() {
    if (startTime == null) {
        startTime = Date.now();
    } else {
        return (Date.now() - startTime);
    }
    return (Date.now() - startTime);
}


function timerReset() {
    startTime = null;
}

function clearPlayground() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}