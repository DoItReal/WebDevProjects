class Playground {
    #canvas;
    #ctx;
    png_background: HTMLImageElement;
    constructor() {
        this.setFocus = this.setFocus.bind(this);
        this.blurFocus = this.blurFocus.bind(this);
        this.mouseMove = this.mouseMove.bind(this);
        this.mouseDown = this.mouseDown.bind(this);
        this.png_background = null;
        this.getContext = this.getContext.bind(this);
    }
    init() {
        this.#canvas = document.querySelector('#Playground');
        this.#ctx = this.#canvas.getContext('2d');
        this.init_events();
        try {
            this.png_background = new Image();
            this.png_background.src = 'textures/content/terrain/floor/Floor4.png'
        } catch (e) {
            console.log('Failed to load textures');
        };

    }
    init_events() {
        //event listener on 'keydown'
        this.#canvas.addEventListener('keydown', MainInterface.handleKeyDown, false);
        this.#canvas.addEventListener('keyup', MainInterface.handleKeyUp, false);

        //prevent opening context menu on right click;
        this.#canvas.addEventListener('contextmenu', function (e) { e.preventDefault(); }, false);

        //event listener on 'mouseenter'
        this.#canvas.addEventListener('mouseenter', this.setFocus, false);

        //event listener on 'mouseout'
        this.#canvas.addEventListener('mouseout', this.blurFocus, false);

        //event listener on 'mousedown' Playground
        this.#canvas.addEventListener('mousedown', this.mouseDown, false);
    }
    overlapping(e) {
        let rect = this.#canvas.getBoundingClientRect();
        if (circRectsOverlap(rect.left, rect.top, rect.width, rect.height, e.clientX, e.clientY, 1)) {
            return 1;
        }
        return 0;
    }
    mouseMove(mousePosRelative) {
        if (MainInterface.clipboard != null && game1.play && !game1.pause) { //if there is item in the clipboard 
            game1.updatePreview(mousePosRelative.x, mousePosRelative.y);
    //        console.log(mousePosRelative);
        } else if (MainInterface.clipboard == null && game1.play && !game1.pause) { //if there is no item in the clipboard

        }
    }
    mouseDown(e) {
        e.preventDefault();
        let button = e.button;
        let mousePos = MainInterface.getMousePos(this, e);
        if (button == 0) { //left click  //PLACE, USE, SELECT
            if (MainInterface.clipboard != null && game1.play && !game1.pause) {
               game1.getTowersInterface().addTower(MainInterface.clipboard);
                MainInterface.clearClipboard();
            }
        } else if (button == 1) { //scroll (middle button) click
            //to do
        } else if (button == 2) { //right click 
            MainInterface.clearClipboard();   //empty the clipboard // DISMISS
        }
    }
    setFocus() {
        this.#canvas.focus();
    }
    blurFocus() {
        this.#canvas.blur();
    }
    getCanvas() {
        return this.#canvas;
    }
    getContext() {
        return this.#ctx;
    }
    update() {
        this.clear();
     //   this.background();
    }
    backgroundTile(x, y, w, h, angle) {
        this.#ctx.save();
        this.#ctx.translate(x, y);
        this.#ctx.rotate(angle);
        this.#ctx.drawImage(this.png_background, 0, 0, w, h);

        this.#ctx.restore();
    }
    background() {
        let tileWidth = 50;
        let tileHeight = 50;
        let angle = Math.PI; //Math.PI - straight, Math.PI/2 - 90 degr;
        for (let i = 0; i < this.#canvas.width + tileWidth; i += tileWidth) {
            for (let j = 0; j < this.#canvas.height + tileHeight; j += tileHeight) {
                this.backgroundTile(i, j, tileWidth, tileHeight, angle);
            }
        }
    }
    clear() {
        this.#ctx.clearRect(0, 0, this.#canvas.width, this.#canvas.height);
    }
}


class Tile {

    
    left: Tile;
    up: Tile;
    right: Tile;
    down: Tile;
    constructor() {

    }
}
class Tiles {

}