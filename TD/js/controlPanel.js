var PlayerSpeedSlider, PlayerSpeedOutput;
var MissleNumSlider, MissleNumOutput;
var StartStopButton, PauseResumeButton;

function init_controlPanel() {
    define_controlPanel();
    initialize_events_controlPanel();
}
//defining control panel variables
function define_controlPanel() {
    divControlPanel = document.querySelector('#divControlPanelContainer');
    //player speed objects definition
    PlayerSpeedSlider = document.querySelector('#playerSpeedSlider');
    PlayerSpeedOutput = document.querySelector('#playerSpeedOutput');

    //missle num objects definition
    MissleNumSlider = document.querySelector('#missleNumSlider');
    MissleNumOutput = document.querySelector('#missleNumOutput');

    //StartStop button definition
    StartStopButton = document.querySelector("#startStopButton");

    //PauseResume button definition
    PauseResumeButton = document.querySelector("#pauseResumeButton");

}

//initializing control panel events
function initialize_events_controlPanel() {
    event_playerSpeedSlider();
    event_missleNumSlider();

    event_startStopButton();
    event_pauseResumeButton();
}

//event listeners control panel
function event_playerSpeedSlider() {
    PlayerSpeedOutput.value = PlayerSpeedSlider.value;
    game1.player.speed = Number(PlayerSpeedSlider.value);
    PlayerSpeedSlider.oninput = function (evt) {
        //visual update Player speed output
        PlayerSpeedOutput.value = evt.target.value;
        //  playerSpeedSlider.value = evt.target.value;
        //functional update Player speed
        game1.player.speed = Number(evt.target.value);
    }
}

function event_missleNumSlider() {
    MissleNumOutput.value = MissleNumSlider.value;
    missleNum = Number(MissleNumSlider.value);
    MissleNumSlider.oninput = function (evt) {
        //visual update Missle Num OUTPUT
        MissleNumOutput.value = evt.target.value;
        //visual update Missle Num output
        //  MissleNumSlider.value = evt.target.value;
        //functional update Missle Num
        missleNum = Number(Number(missleNumSlider.value));
    }
}

function event_startStopButton() {
    visualButtonUpdate();
    //event onclick StartStopButton
    StartStopButton.onclick = function (evt) {
        visualButtonUpdate();
        if (!play) {
            //start animation game1.playNow
            game1.startGame();
            //   PauseResumeButton.disabled = false;
            visualButtonUpdate();
        } else { //stop
            //stop animation game1.playNow
            game1.stopGame(animationID);
            //  PauseResumeButton.disabled = true;
            visualButtonUpdate();

        }
    }
}

function event_pauseResumeButton() {
    visualButtonUpdate();
    //event PauseResumeButton onclick
    PauseResumeButton.onclick = function () {
        pause = !pause;
        if (!pause) { //game running
            startTime += Date.now() - pauseTime;
            pauseTime = null;
            visualButtonUpdate();
        } else { //game paused
            pauseTime = Date.now();
            visualButtonUpdate();
        }
    };
}
