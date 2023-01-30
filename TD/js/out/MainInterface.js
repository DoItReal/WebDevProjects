//getInterface() returning Singleton class Interface()
//class Interface() - encapsulates all methods for manipulating the DOM elements;  
const getInterface = (function () {
    let instance;
    function createInstance() {
        const object = new _MainInterface();
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
const KeyCodes = new Map();
KeyCodes.set(37, 'left');
KeyCodes.set(38, 'up');
KeyCodes.set(39, 'right');
KeyCodes.set(40, 'down');
class _MainInterface {
    constructor() {
        this.sprites = new Map();
        this.MouseState = new MouseState();
        this.pressedKeys = new Map;
        this.timer = new Timer();
        this.Playground = new Playground();
        this.Scoreboard = new Scoreboard();
        this.ControlPanel = new ControlPanel();
        this.clipboard = null;
        this.getCanvasMouseOverlaping = this.getCanvasMouseOverlaping.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.addKey = this.addKey.bind(this);
        this.removeKey = this.removeKey.bind(this);
    }
    //public methods
    //getters
    getMouse() {
        return this.MouseState.mousePos;
    }
    getTimerDist() {
        return this.timer.getDist();
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
    getSprites(obj) {
        switch (obj) {
            case "Peon": return this.sprites.get('enemy_peon');
            case "Warrior": return this.sprites.get('enemy_warrior');
            default: return;
        }
    }
    //setters
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
    setClipboard(obj) {
        this.clipboard = obj;
    }
    //***
    init() {
        this.MouseState._init();
        this.Playground.init();
        this.Scoreboard.init();
        this.ControlPanel.init();
        this.load();
        this.update();
    }
    update() {
        this.Playground.update();
        this.Scoreboard.update();
        this.ControlPanel.update();
    }
    init_events() {
    }
    //events methods
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
    getCanvasMouseOverlaping(e) {
        e.preventDefault();
        if (this.Playground.overlapping(e))
            return this.Playground;
        if (this.Scoreboard.overlapping(e))
            return this.Scoreboard;
        return null;
    }
    getMousePos(canv, e) {
        const rect = canv.getCanvas().getBoundingClientRect();
        if (e != undefined)
            return {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };
        else
            return {
                x: this.MouseState.mousePos.x - rect.left,
                y: this.MouseState.mousePos.y - rect.top
            };
    }
    clearClipboard() {
        this.clipboard = null;
    }
    //private methods
    load() {
        const peonSprite = new enemy_PeonSprite();
        this.sprites.set('enemy_peon', peonSprite.getSprites());
        const warriorSprite = new enemy_WarriorSprite();
        this.sprites.set('enemy_warrior', warriorSprite.getSprites());
    }
}
const MouseKeys = new Map();
MouseKeys.set(1, 'leftButton');
MouseKeys.set(2, 'rightButton');
class MouseState {
    constructor() {
        this.mousePos = { x: 0, y: 0 };
        this.keys = new Map();
        this.setMousePos = this.setMousePos.bind(this);
        this.setKey = this.setKey.bind(this);
        this.removeKey = this.removeKey.bind(this);
    }
    _init() {
        this.keys.set("leftButton", false);
        this.keys.set("rightButton", false);
        //event getMousePos
        document.addEventListener('mouseenter', this.setMousePos, false); //getting the mousepos every time the mouse is moved or entering in the main document
        document.addEventListener('mousemove', this.setMousePos, false);
        document.addEventListener('mousedown', this.setKey, false);
        document.addEventListener('mouseup', this.removeKey, false);
    }
    setMousePos(e) {
        e.preventDefault();
        this.mousePos = { x: e.clientX, y: e.clientY };
    }
    setKey(e) {
        e.preventDefault();
        if (MouseKeys.get(e.buttons) != undefined)
            this.keys.set(MouseKeys.get(e.buttons), true);
    }
    removeKey(e) {
        e.preventDefault();
        this.keys.forEach((value, key, map) => this.keys.set(key, false));
    }
}
//# sourceMappingURL=MainInterface.js.map