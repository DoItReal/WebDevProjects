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
        this.timer = new Timer();
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
    //public methods
    //getters
    getMouse() {
        return this.mousePos;
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
    setMousePos(e) {
        this.mousePos = { x: e.clientX, y: e.clientY };
    }
    setClipboard(obj) {
        this.clipboard = obj;
    }
    //***
    init() {
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
        //event getMousePos
        document.addEventListener('mouseenter', this.setMousePos, false); //getting the mousepos every time the mouse is moved or entering in the main document
        document.addEventListener('mousemove', this.setMousePos, false);
        //event listener on 'mousemove'
        document.addEventListener('mousemove', this.mouseMove, false);
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
        if (e != undefined)
            return {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };
        else
            return {
                x: this.mousePos.x - rect.left,
                y: this.mousePos.y - rect.top
            };
    }
    clearClipboard() {
        this.clipboard = null;
    }
    //private methods
    load() {
        let peonSprite = new enemy_PeonSprite();
        this.sprites.set('enemy_peon', peonSprite.getSprites());
        let warriorSprite = new enemy_WarriorSprite();
        this.sprites.set('enemy_warrior', warriorSprite.getSprites());
    }
}
//# sourceMappingURL=MainInterface.js.map