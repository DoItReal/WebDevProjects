//getInterface() returning Singleton class Interface()
//class Interface() - encapsulates all methods for manipulating the DOM elements;  
var getInterface = (function () {
    var instance;
    function createInstance() {
        let object = new _MainInterface();
        return object;
    }
    return {
        get: function () {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();
// to do class for this one
var KeyCodes = new Map();
KeyCodes.set(37, 'left');
KeyCodes.set(38, 'up');
KeyCodes.set(39, 'right');
KeyCodes.set(40, 'down');
class _MainInterface {
    constructor() {
        this.sprites = new Map();
        this.pressedKeys = new Map;
        this.Playground = new Playground();
        this.Scoreboard = new Scoreboard();
        this.ControlPanel = new ControlPanel();
        this.clipboard = null;
        this.mousePos = { x: null, y: null };
        this.getCanvasMouseOverlaping = this.getCanvasMouseOverlaping.bind(this);
        this.mouseMove = this.mouseMove.bind(this);
        this.setMousePos = this.setMousePos.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.addKey = this.addKey.bind(this);
        this.removeKey = this.removeKey.bind(this);
    }
    getMouse() {
        return this.mousePos;
    }
    init() {
        this.Playground.init();
        this.Scoreboard.init();
        this.ControlPanel.init();
        this.load();
        this.update();
    }
    init_events() {
        //event getMousePos
        document.addEventListener('mouseenter', this.setMousePos, false);
        document.addEventListener('mousemove', this.setMousePos, false);
        //event listener on 'mousemove'
        document.addEventListener('mousemove', this.mouseMove, false);
        this.Playground.init_events();
        this.Scoreboard.init_events();
    }
    addKey(key) {
        if (this.pressedKeys.has(key)) {
            return 0;
        }
        else {
            this.pressedKeys.set(key, KeyCodes.get(key));
        }
    }
    removeKey(key) {
        if (this.pressedKeys.has(key)) {
            this.pressedKeys.delete(key);
        }
    }
    handleKeyDown(e) {
        e.preventDefault();
        if (e.keyCode == '39') { //arrow right
            this.addKey(e.keyCode);
        }
        else if (e.keyCode == '37') { //arrow left
            this.addKey(e.keyCode);
        }
        else if (e.keyCode == '38') { //arrow up
            this.addKey(e.keyCode);
        }
        else if (e.keyCode == '40') { //arrow down
            this.addKey(e.keyCode);
        }
    }
    handleKeyUp(e) {
        e.preventDefault();
        if (e.keyCode == '39') { //arrow right
            this.removeKey(e.keyCode);
        }
        else if (e.keyCode == '37') { //arrow left
            this.removeKey(e.keyCode);
        }
        else if (e.keyCode == '38') { //arrow up
            this.removeKey(e.keyCode);
        }
        else if (e.keyCode == '40') { //arrow down
            this.removeKey(e.keyCode);
        }
    }
    mouseMove(e) {
        e.preventDefault();
        let canv = this.getCanvasMouseOverlaping(e);
        if (canv != null) {
            canv.mouseMove(this.getMousePos(canv, e)); /// ?????
        }
    }
    getCanvasMouseOverlaping(e) {
        e.preventDefault();
        if (this.Playground.overlapping(e))
            return this.Playground;
        if (this.Scoreboard.overlapping(e))
            return this.Scoreboard;
        return null;
    }
    getMousePos(canv, e) {
        let rect = canv.getCanvas().getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }
    setMousePos(e) {
        this.mousePos = { x: e.clientX, y: e.clientY };
    }
    update() {
        this.Playground.update();
        this.Scoreboard.update();
        this.ControlPanel.update();
    }
    getPlayground() {
        return this.Playground;
    }
    getScoreboard() {
        return this.Scoreboard;
    }
    getControlPanel() {
        return this.ControlPanel;
    }
    setClipboard(obj) {
        this.clipboard = obj;
    }
    clearClipboard() {
        this.clipboard = null;
    }
    load() {
        let peonSprite = new enemy_PeonSprite();
        this.sprites.set('enemy_peon', peonSprite.getSprites());
    }
    getSprites(obj) {
        if (obj == "Peon") {
            return this.sprites.get('enemy_peon');
        }
    }
}
//# sourceMappingURL=MainInterface.js.map