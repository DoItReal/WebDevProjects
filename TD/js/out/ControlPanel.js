var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _ControlPanel_container;
class ControlPanel {
    constructor() {
        _ControlPanel_container.set(this, void 0);
    }
    init() {
        __classPrivateFieldSet(this, _ControlPanel_container, document.querySelector('#divControlPanelContainer'), "f");
    }
    getContainer() {
        return __classPrivateFieldGet(this, _ControlPanel_container, "f");
    }
    update() {
    }
}
_ControlPanel_container = new WeakMap();
var StartStopButton, PauseResumeButton;
var AddTowerButton, Wave1Button, Wave2Button;
function init_controlPanel() {
    define_controlPanel();
    initialize_events_controlPanel();
}
//defining control panel variables
function define_controlPanel() {
    //Container definition
    divControlPanel = document.querySelector('#divControlPanelContainer');
    //StartStop button definition
    StartStopButton = document.querySelector("#startStopButton");
    //PauseResume button definition
    PauseResumeButton = document.querySelector("#pauseResumeButton");
    //Wave button definition
    Wave1Button = document.querySelector("#addWave1");
    Wave2Button = document.querySelector("#addWave2");
    //PauseResume button definition
    AddTowerButton = document.querySelector("#addTowerButton");
}
//initializing control panel events
function initialize_events_controlPanel() {
    event_startStopButton();
    event_pauseResumeButton();
    event_addEnemyButton();
    event_addTowerButton();
}
//event listeners control panel
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
        }
        else { //stop
            //stop animation game1.playNow
            game1.stopGame();
            //  PauseResumeButton.disabled = true;
            visualButtonUpdate();
        }
    };
}
function event_pauseResumeButton() {
    visualButtonUpdate();
    //event PauseResumeButton onclick
    PauseResumeButton.onclick = function () {
        game1.pause = !game1.pause;
        if (!game1.pause) { //game running
            MainInterface.timer.startTime += Date.now() - MainInterface.timer.pauseTime;
            MainInterface.timer.pauseTime = null;
            visualButtonUpdate();
        }
        else { //game paused
            MainInterface.timer.pauseTime = Date.now();
            visualButtonUpdate();
        }
    };
}
function event_addEnemyButton() {
    //   visualButtonUpdate();
    Wave1Button.onclick = function (evt) {
        game1.setLevel(new Level_1());
    };
    Wave2Button.onclick = function (evt) {
        game1.setLevel(new Level_2());
    };
}
function event_addTowerButton() {
    AddTowerButton.onclick = function (evt) {
        MainInterface.setClipboard(new tower_Iron(MainInterface.getMouse()));
        // game1.getTowersInterface().addTower(new tower_Iron({ x: 400, y: 300}));
    };
    //   visualButtonUpdate();
    //event onclick AddEnemyPeon
    //  
    //    visualButtonUpdate();
    //add enemy Game().addTower();
}
function visualButtonUpdate() {
    if (game1.play) { //game running
        StartStopButton.value = "Stop";
        StartStopButton.innerHTML = "Stop";
        StartStopButton.style = "background: red;";
        PauseResumeButton.disabled = false;
        if (!game1.pause) {
            PauseResumeButton.value = "Pause";
            PauseResumeButton.innerHTML = "Pause";
            PauseResumeButton.style = "background: gray;";
        }
        else {
            PauseResumeButton.value = "Resume";
            PauseResumeButton.innerHTML = "Resume";
            PauseResumeButton.style = "background: lightgreen";
        }
    }
    else { //game not running
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
//# sourceMappingURL=ControlPanel.js.map