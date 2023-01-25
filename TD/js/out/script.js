"use strict";
const MainInterface = getInterface.get(); /// Singleton! interface.js
// TO DO CLASS For the FPS counter
let divControlPanel; //to remove it when the ControlPanel class is ready
//declaring variable for new $Game() OBJECT // TO DO REWORK creating the object when starting the game with $divStartStopButton
let game1;
function init() {
    game1 = new Game();
    MainInterface.init();
    MainInterface.init_events();
    init_indexedDB();
    init_inventory();
    init_controlPanel();
    game1.init();
}
//# sourceMappingURL=script.js.map