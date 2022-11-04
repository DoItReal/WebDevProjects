"use strict";
var MainInterface = getInterface.get(); /// Singleton! interface.js
// TO DO CLASS For the FPS counter
var divControlPanel; //to remove it when the ControlPanel class is ready
//declaring variable for new $Game() OBJECT // TO DO REWORK creating the object when starting the game with $divStartStopButton
var game1;
function init() {
    MainInterface.init();
    MainInterface.init_events();
    game1 = new Game();
    init_inventory();
    init_controlPanel();
    game1.init();
}
//# sourceMappingURL=script.js.map