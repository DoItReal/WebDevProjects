class Playground {
    #canvas;
    #ctx;

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
        if (circRectsOverlap(rect.left, rect.top, this.#canvas.width, this.#canvas.height, e.clientX, e.clientY, 5)) {
            return 1;
        }
        return 0;
    }
    mouseMove(mousePosRelative) {
        if (MainInterface.clipboard != null && game1.play && !game1.pause) { //if there is item in the clipboard 
            game1.updatePreview(mousePosRelative.x, mousePosRelative.y);
        } else if (MainInterface.clipboard == null && game1.play && !game1.pause) { //if there is no item in the clipboard

        }
    }
    mouseDown(e) {
        e.preventDefault();
        let button = e.button;
        let mousePos = MainInterface.getMousePos(this, e);
        if (button == 0) { //left click  //PLACE, USE, SELECT
            if (MainInterface.clipboard != null && game1.play && !game1.pause) {
                game1.addTower(mousePos.x, mousePos.y, MainInterface.clipboard.type);
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
        this.background();
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
class Scoreboard {
    #canvas;
    #ctx;
    constructor() {
        this.mouseMove = this.mouseMove.bind(this);
        this.mouseDown = this.mouseDown.bind(this);
        this.startTime = null;
        this.pauseTime = null;
        this.timerOn = false;
    }

    init() {
        this.#canvas = document.querySelector('#Scoreboard');
        this.#ctx = this.#canvas.getContext('2d');
    }
    overlapping(e) {
        let rect = this.#canvas.getBoundingClientRect();
        if (circRectsOverlap(rect.left, rect.top, this.#canvas.width, this.#canvas.height, e.clientX, e.clientY, 5)) {
            return 1;
        }
        return 0;
    }
    init_events() {
        //prevent opening context menu on right click;
        this.#canvas.addEventListener('contextmenu', function (e) { e.preventDefault(); }, false);
        //event listener on 'mousedown' Scoreboard
        this.#canvas.addEventListener('mousedown', this.mouseDown, false);
    }
    mouseMove(mousePosRelative) {
        //  console.log("x: " + mousePos.x + ' // y: ' + mousePos.y);
    }
    update() {
        //clear scoreboard
        this.#ctx.save();
        this.#ctx.clearRect(0, 0, this.#canvas.width, this.#canvas.height);
        //draw background
        this.#ctx.fillStyle = "#256794";
        this.#ctx.fillRect(0, 0, this.#canvas.width, this.#canvas.height);

        //import enemy counter
        this.enemyCounter(10, 10);

        //import timer
        this.texture_timer(300, 10);

        this.#ctx.restore();
    }
    enemyCounter(x, y) {
        this.#ctx.save();
        this.#ctx.beginPath();
        this.#ctx.translate(x, y);
        this.#ctx.strokeStyle = "white";
        this.#ctx.lineWidth = 1;
        this.#ctx.rect(0, 15, 200, 50);
        this.#ctx.rect(5, 20, 190, 40);
        this.#ctx.stroke();
        this.#ctx.beginPath();

        this.#ctx.strokeStyle = 'gray';
        this.#ctx.lineWidth = 4;
        this.#ctx.fillStyle = "white";
        this.#ctx.font = "25px Monaco";
        this.#ctx.strokeText("Enemies: ", 50, 10);
        this.#ctx.fillText("Enemies:", 50, 10);

        this.#ctx.strokeStyle = 'yellow';
        this.#ctx.lineWidth = 4;
        this.#ctx.fillStyle = 'red';
        this.#ctx.textAlign = 'center';

        let enemies = 0;
        if (game1) enemies = game1.getEnemiesCount;

        this.#ctx.font = "25px Arial";
        this.#ctx.strokeText(enemies, 100, 50);
        this.#ctx.fillText(enemies, 100, 50);
        this.#ctx.restore();
    }
    texture_timer(x, y) {
        this.#ctx.save();
        this.#ctx.beginPath();
        this.#ctx.translate(x, y);
        this.#ctx.strokeStyle = 'white';
        this.#ctx.lineWidth = 2;
        this.#ctx.rect(0, 0, 200, 60);
        this.#ctx.rect(5, 5, 190, 50);
        this.#ctx.stroke();
        this.#ctx.beginPath();

        //setting the timer
        let dist = 0;
        if (this.timerOn) {
            dist = this.setTimer();
        }
        //minutes not working TO DO
        let minutes = Math.floor(((dist / 100000) % 60));
        let minutesStr = '';
        if (minutes > 10) {
            minutesStr = minutes;
        } else if (minutes == 0) {
            minutesStr = '00';
        } else minutesStr = '0' + minutes;
        let seconds = Math.floor((dist / 1000) % 60);
        let secondsStr = '';
        if (seconds < 10) {
            secondsStr = '0' + seconds;
        } else secondsStr = seconds;

        let milliseconds = Math.floor((dist / 10 % 100));
        let millisecondsStr = '';
        if (milliseconds < 10) {
            millisecondsStr = '0' + milliseconds;
        } else {
            millisecondsStr = milliseconds;
        }

        this.#ctx.lineWidth = 1;
        this.#ctx.strokeStyle = "red";
        this.#ctx.fillStyle = "lime";
        //fill minutes + ':'
        this.#ctx.font = "35px Arial";
        this.#ctx.fillText(minutesStr + ':', 40, 40);
        this.#ctx.strokeText(minutesStr + ':', 40, 40);


        //fill seconds
        this.#ctx.font = "30px Arial";
        this.#ctx.fillText(secondsStr + ':', 90, 40);
        this.#ctx.strokeText(secondsStr + ':', 90, 40);

        //fill millisceonds
        this.#ctx.font = "25px Arial";
        this.#ctx.fillText(millisecondsStr, 135, 40);
        this.#ctx.strokeText(millisecondsStr, 135, 40);

        this.#ctx.restore();
    }

    getCanvas() {
        return this.#canvas;
    }
    getContext() {
        return this.#ctx;
    }
    mouseDown(e) {
        e.preventDefault();
        let button = e.button;
        let mousePos = MainInterface.getMousePos(this, e);
        console.log('Button: ' + button + ' pressed at x: ' + mousePos.x + ' y: ' + mousePos.y);
    }

    setTimer() {
    if (this.startTime == null) {
        this.startTime = Date.now();
    } else {
        return (Date.now() - this.startTime);
    }
    return (Date.now() - this.startTime);
}

    timerReset() {
    this.startTime = null;
}


}
