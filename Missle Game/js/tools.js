//tools
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
function getRandomBoolean() {
    return Math.random() < 0.5;
}
function reset() {
    console.log('reset');
    playerX = 350, playerY = 520, playerSpeed = 10;
    play = true;
    timerReset();
    game1.clearMissles();
    missleNum += 1;
    game1.initMissles(missleNum);
    animationID = requestAnimationFrame(playNow);

    //dont know why but it doesnt work without this line ...
    animationID = requestAnimationFrame(playNow);
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

function stopGame(game) {
    play = false;
    playerX = 350, playerY = 520;
    timerReset();
    game1.clearMissles();
    cancelAnimationFrame(game);
    pause = false;
}

function startGame() {
    play = true;
    game1.initMissles(missleNum);
    game = requestAnimationFrame(playNow);
    return game;
}


function hitCheck() {
    let tmpMissles = game1.allMissles;
    for (let i = 0; i < tmpMissles.length; i++) {
        if (tmpMissles[i].y >= 490) {
            if (tmpMissles[i].x >= player1.x && tmpMissles[i].x <= player1.x + 80) {
                alert('GameOver');
                play = 0;
                reset();
                return 1;

            }
        }
    }
    return 0;
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