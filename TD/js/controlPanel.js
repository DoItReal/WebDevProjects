var PlayerSpeedSlider, PlayerSpeedOutput;
var StartStopButton, PauseResumeButton;
var AddEnemyButton, AddTowerButton;

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



    //StartStop button definition
    StartStopButton = document.querySelector("#startStopButton");

    //PauseResume button definition
    PauseResumeButton = document.querySelector("#pauseResumeButton");

    //PauseResume button definition
    AddEnemyButton = document.querySelector("#addEnemyButton");

    //PauseResume button definition
    AddTowerButton = document.querySelector("#addTowerButton");
}

//initializing control panel events
function initialize_events_controlPanel() {
    event_playerSpeedSlider();

    event_startStopButton();
    event_pauseResumeButton();
    event_addEnemyButton();
    event_addTowerButton();
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


function event_startStopButton() {
    visualButtonUpdate();
    //event onclick StartStopButton
    StartStopButton.onclick = function (evt) {
        visualButtonUpdate();
        if (!game1.play) {
            //start animation game1.playNow
            game1.startGame();
            //   PauseResumeButton.disabled = false;
            visualButtonUpdate();
        } else { //stop
            //stop animation game1.playNow
            game1.stopGame();
            //  PauseResumeButton.disabled = true;
            visualButtonUpdate();

        }
    }
}

function event_pauseResumeButton() {
    visualButtonUpdate();
    //event PauseResumeButton onclick
    PauseResumeButton.onclick = function () {
        game1.pause = !game1.pause;
        if (!game1.pause) { //game running
            MainInterface.getScoreboard().startTime += Date.now() - MainInterface.getScoreboard().pauseTime;
            MainInterface.getScoreboard().pauseTime = null;
            visualButtonUpdate();
        } else { //game paused
            MainInterface.getScoreboard().pauseTime = Date.now();
            visualButtonUpdate();
        }
    };
}
function event_addEnemyButton() {
    //   visualButtonUpdate();
    //event onclick AddEnemyButton
    AddEnemyButton.onclick = function (evt) {
        //    visualButtonUpdate();
        //add enemy Game().addEnemy();
        game1.getEnemiesInterface().addEnemy(new enemy_Peon({ x: 0, y: 100, w: 0, h: 0 }, [{ x: 700, y: 100, w: 0, h: 0 }, { x: 700, y: 600, w: 0, h: 0 }]));
    }
}
function event_addTowerButton() {
    AddTowerButton.onclick = function (evt) {
        game1.getTowersInterface().addTower(new tower_Slinger({ x: 400, y: 300, w: 40, h: 40 }));
    }
        //   visualButtonUpdate();
        //event onclick AddEnemyButton
      //  
            //    visualButtonUpdate();
            //add enemy Game().addTower();
     /*       MainInterface.clipboard = {
                type: tower_archer};
        }  */
    }
