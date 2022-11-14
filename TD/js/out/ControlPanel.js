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
var PlayerSpeedSlider, PlayerSpeedOutput;
var StartStopButton, PauseResumeButton;
var AddEnemyPeon, AddEnemyWarrior, AddTowerButton;
function init_controlPanel() {
    define_controlPanel();
    initialize_events_controlPanel();
}
//defining control panel variables
function define_controlPanel() {
    //Container definition
    divControlPanel = document.querySelector('#divControlPanelContainer');
    //Player speed objects definition
    PlayerSpeedSlider = document.querySelector('#playerSpeedSlider');
    PlayerSpeedOutput = document.querySelector('#playerSpeedOutput');
    //StartStop button definition
    StartStopButton = document.querySelector("#startStopButton");
    //PauseResume button definition
    PauseResumeButton = document.querySelector("#pauseResumeButton");
    //PauseResume button definition
    AddEnemyPeon = document.querySelector("#addEnemyPeon");
    AddEnemyWarrior = document.querySelector("#addEnemyWarrior");
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
    };
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
            MainInterface.getScoreboard().startTime += Date.now() - MainInterface.getScoreboard().pauseTime;
            MainInterface.getScoreboard().pauseTime = null;
            visualButtonUpdate();
        }
        else { //game paused
            MainInterface.getScoreboard().pauseTime = Date.now();
            visualButtonUpdate();
        }
    };
}
function event_addEnemyButton() {
    //   visualButtonUpdate();
    //event onclick AddEnemyPeon
    AddEnemyPeon.onclick = function (evt) {
        //    visualButtonUpdate();
        //add enemy Game().addEnemy();
        game1.getEnemiesInterface().addEnemy(new enemy_Peon({ x: 100, y: 100 }, [{ x: 500, y: 300 }, { x: 400, y: 400 }, { x: 100, y: 400 }, { x: 600, y: 400 }]));
    };
    AddEnemyWarrior.onclick = function (evt) {
        game1.getEnemiesInterface().addEnemy(new enemy_Warrior({ x: 100, y: 100 }, [{ x: 500, y: 300 }, { x: 400, y: 400 }, { x: 100, y: 400 }, { x: 600, y: 400 }]));
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
//# sourceMappingURL=ControlPanel.js.map