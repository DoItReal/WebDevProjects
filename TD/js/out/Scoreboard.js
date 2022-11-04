class Canvas {
    constructor() {
        if (this.constructor === Canvas) {
            throw new Error("Abstract classes can't be instantiated.");
        }
    }
    init() { }
    overlapping(e) {
        let rect = this.canvas.getBoundingClientRect();
        if (circRectsOverlap(rect.left, rect.top, this.canvas.width, this.canvas.height, e.clientX, e.clientY, 5)) {
            return 1;
        }
        return 0;
    }
    getCanvas() {
        return this.canvas;
    }
    getContext() {
        return this.ctx;
    }
    clear() {
        this.ctx.save();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.restore();
    }
}
class Scoreboard extends Canvas {
    constructor() {
        super();
        this.timer = new Timer({ x: 300, y: 10 });
        this.mouseMove = this.mouseMove.bind(this);
        this.mouseDown = this.mouseDown.bind(this);
    }
    getTimer() {
        return this.timer;
    }
    init() {
        this.canvas = document.querySelector('#Scoreboard');
        this.ctx = this.canvas.getContext('2d');
    }
    init_events() {
        //prevent opening context menu on right click;
        this.canvas.addEventListener('contextmenu', function (e) { e.preventDefault(); }, false);
        //event listener on 'mousedown' Scoreboard
        this.canvas.addEventListener('mousedown', this.mouseDown, false);
    }
    mouseMove(mousePosRelative) {
        //  console.log("x: " + mousePos.x + ' // y: ' + mousePos.y);
    }
    update() {
        this.draw();
    }
    draw() {
        //clear canvas
        this.clear();
        //import background
        this.background();
        //import enemy counter - TO REWORK
        this.enemyCounter(10, 10);
        //import timer
        this.timer.update();
    }
    background() {
        this.ctx.save();
        this.ctx.fillStyle = "#256794"; //
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.restore();
    }
    enemyCounter(x, y) {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.translate(x, y);
        this.ctx.strokeStyle = "white";
        this.ctx.lineWidth = 1;
        this.ctx.rect(0, 15, 200, 50);
        this.ctx.rect(5, 20, 190, 40);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.strokeStyle = 'gray';
        this.ctx.lineWidth = 4;
        this.ctx.fillStyle = "white";
        this.ctx.font = "25px Monaco";
        this.ctx.strokeText("Enemies: ", 50, 10);
        this.ctx.fillText("Enemies:", 50, 10);
        this.ctx.strokeStyle = 'yellow';
        this.ctx.lineWidth = 4;
        this.ctx.fillStyle = 'red';
        this.ctx.textAlign = 'center';
        let enemies = 0;
        if (game1)
            enemies = game1.getEnemiesInterface().getEnemiesCount();
        this.ctx.font = "25px Arial";
        this.ctx.strokeText(String(enemies), 100, 50);
        this.ctx.fillText(String(enemies), 100, 50);
        this.ctx.restore();
    }
    mouseDown(e) {
        e.preventDefault();
        let button = e.button;
        let mousePos = MainInterface.getMousePos(this, e);
        console.log('Button: ' + button + ' pressed at x: ' + mousePos.x + ' y: ' + mousePos.y);
    }
}
class Timer {
    constructor(cord) {
        this.cord = cord;
        this.startTime = null;
        this.pauseTime = null;
        this.timerOn = false;
    }
    on() {
        this.timerOn = true;
    }
    off() {
        this.timerOn = false;
    }
    setTimer() {
        if (this.startTime == null) {
            this.startTime = Date.now();
        }
        else {
            return (Date.now() - this.startTime);
        }
        return (Date.now() - this.startTime);
    }
    timerReset() {
        this.startTime = null;
    }
    update() {
        if (this.timerOn) {
            this.draw(this.setTimer());
        }
        else
            this.draw(0);
    }
    draw(dist) {
        this.ctx = MainInterface.getScoreboard().getContext();
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.translate(this.cord.x, this.cord.y);
        this.ctx.strokeStyle = 'white';
        this.ctx.lineWidth = 2;
        this.ctx.rect(0, 0, 200, 60);
        this.ctx.rect(5, 5, 190, 50);
        this.ctx.stroke();
        this.ctx.beginPath();
        //minutes not working TO DO
        let minutes = Math.floor(((dist / 100000) % 60));
        let minutesStr = '';
        if (minutes > 10) {
            minutesStr = String(minutes);
        }
        else if (minutes == 0) {
            minutesStr = '00';
        }
        else
            minutesStr = '0' + minutes;
        let seconds = Math.floor((dist / 1000) % 60);
        let secondsStr = '';
        if (seconds < 10) {
            secondsStr = '0' + seconds;
        }
        else
            secondsStr = String(seconds);
        let milliseconds = Math.floor((dist / 10 % 100));
        let millisecondsStr = '';
        if (milliseconds < 10) {
            millisecondsStr = '0' + milliseconds;
        }
        else {
            millisecondsStr = String(milliseconds);
        }
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = "red";
        this.ctx.fillStyle = "lime";
        //fill minutes + ':'
        this.ctx.font = "35px Arial";
        this.ctx.fillText(minutesStr + ':', 40, 40);
        this.ctx.strokeText(minutesStr + ':', 40, 40);
        //fill seconds
        this.ctx.font = "30px Arial";
        this.ctx.fillText(secondsStr + ':', 90, 40);
        this.ctx.strokeText(secondsStr + ':', 90, 40);
        //fill millisceonds
        this.ctx.font = "25px Arial";
        this.ctx.fillText(millisecondsStr, 135, 40);
        this.ctx.strokeText(millisecondsStr, 135, 40);
        this.ctx.restore();
    }
}
//# sourceMappingURL=Scoreboard.js.map