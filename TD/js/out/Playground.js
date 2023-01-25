var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _Playground_canvas, _Playground_ctx;
class Playground {
    constructor() {
        _Playground_canvas.set(this, void 0);
        _Playground_ctx.set(this, void 0);
        this.setFocus = this.setFocus.bind(this);
        this.blurFocus = this.blurFocus.bind(this);
        this.mouseMove = this.mouseMove.bind(this);
        this.mouseDown = this.mouseDown.bind(this);
        this.png_background = null;
        this.getContext = this.getContext.bind(this);
    }
    //public methods
    //getters
    getCanvas() {
        return __classPrivateFieldGet(this, _Playground_canvas, "f");
    }
    getContext() {
        return __classPrivateFieldGet(this, _Playground_ctx, "f");
    }
    init() {
        __classPrivateFieldSet(this, _Playground_canvas, document.querySelector('#Playground'), "f");
        __classPrivateFieldSet(this, _Playground_ctx, __classPrivateFieldGet(this, _Playground_canvas, "f").getContext('2d'), "f");
        __classPrivateFieldGet(this, _Playground_canvas, "f").width = window.innerWidth;
        __classPrivateFieldGet(this, _Playground_canvas, "f").height = window.innerHeight * 0.75;
        this.init_events();
        try {
            this.png_background = new Image();
            this.png_background.src = 'textures/content/terrain/floor/Floor1.png';
        }
        catch (e) {
            console.log('Failed to load textures');
        }
    }
    update() {
        this.clear();
        this.background();
    }
    //private methods
    init_events() {
        //event listener on 'keydown'
        __classPrivateFieldGet(this, _Playground_canvas, "f").addEventListener('keydown', MainInterface.handleKeyDown, false);
        __classPrivateFieldGet(this, _Playground_canvas, "f").addEventListener('keyup', MainInterface.handleKeyUp, false);
        //prevent opening context menu on right click;
        __classPrivateFieldGet(this, _Playground_canvas, "f").addEventListener('contextmenu', function (e) { e.preventDefault(); }, false);
        //event listener on 'mouseenter'
        __classPrivateFieldGet(this, _Playground_canvas, "f").addEventListener('mouseenter', this.setFocus, false);
        //event listener on 'mouseout'
        __classPrivateFieldGet(this, _Playground_canvas, "f").addEventListener('mouseout', this.blurFocus, false);
        //event listener on 'mousedown' Playground
        __classPrivateFieldGet(this, _Playground_canvas, "f").addEventListener('mousedown', this.mouseDown, false);
    }
    //events
    overlapping(e) {
        const rect = __classPrivateFieldGet(this, _Playground_canvas, "f").getBoundingClientRect();
        if (circRectsOverlap(rect.left, rect.top, rect.width, rect.height, e.clientX, e.clientY, 1)) {
            return 1;
        }
        return 0;
    }
    mouseMove(mousePosRelative) {
        if (MainInterface.clipboard != null && game1.play && !game1.pause) { //if there is item in the clipboard 
            game1.updatePreview(mousePosRelative.x, mousePosRelative.y);
        }
        else if (MainInterface.clipboard == null && game1.play && !game1.pause) { //if there is no item in the clipboard
        }
    }
    mouseDown(e) {
        e.preventDefault();
        const button = e.button;
        const mousePos = MainInterface.getMousePos(this, e);
        if (button == 0) { //left click  //PLACE, USE, SELECT
            if (MainInterface.clipboard != null && game1.play && !game1.pause) {
                game1.getTowersInterface().addTower(MainInterface.clipboard);
                MainInterface.clearClipboard();
            }
        }
        else if (button == 1) { //scroll (middle button) click
            //to do
        }
        else if (button == 2) { //right click 
            MainInterface.clearClipboard(); //empty the clipboard // DISMISS
        }
    }
    setFocus() {
        __classPrivateFieldGet(this, _Playground_canvas, "f").focus();
    }
    blurFocus() {
        __classPrivateFieldGet(this, _Playground_canvas, "f").blur();
    }
    backgroundTile(x, y, w, h, angle) {
        __classPrivateFieldGet(this, _Playground_ctx, "f").save();
        __classPrivateFieldGet(this, _Playground_ctx, "f").translate(x, y);
        __classPrivateFieldGet(this, _Playground_ctx, "f").globalAlpha = 0.4;
        __classPrivateFieldGet(this, _Playground_ctx, "f").rotate(angle);
        __classPrivateFieldGet(this, _Playground_ctx, "f").drawImage(this.png_background, 0, 0, w, h);
        __classPrivateFieldGet(this, _Playground_ctx, "f").restore();
    }
    background() {
        if (!this.png_background.complete) { // waiting for the image to be loaded if not loaded yet
            this.png_background.onload = () => this.background();
            return;
        }
        const tileWidth = 50;
        const tileHeight = 50;
        const angle = Math.PI; //Math.PI - straight, Math.PI/2 - 90 degr;
        for (let i = 0; i < __classPrivateFieldGet(this, _Playground_canvas, "f").width + tileWidth; i += tileWidth) {
            for (let j = 0; j < __classPrivateFieldGet(this, _Playground_canvas, "f").height + tileHeight; j += tileHeight) {
                this.backgroundTile(i, j, tileWidth, tileHeight, angle);
            }
        }
    }
    clear() {
        __classPrivateFieldGet(this, _Playground_ctx, "f").clearRect(0, 0, __classPrivateFieldGet(this, _Playground_canvas, "f").width, __classPrivateFieldGet(this, _Playground_canvas, "f").height);
    }
}
_Playground_canvas = new WeakMap(), _Playground_ctx = new WeakMap();
class Tile {
    constructor() {
    }
}
class Tiles {
}
//# sourceMappingURL=Playground.js.map