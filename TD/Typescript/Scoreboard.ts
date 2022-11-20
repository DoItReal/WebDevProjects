interface canv {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
}
class Canvas implements canv {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
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
    clear(): void {
        this.ctx.save();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.restore();
    }

}
class Scoreboard extends Canvas{
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    constructor() {
        super();
        this.mouseMove = this.mouseMove.bind(this);
        this.mouseDown = this.mouseDown.bind(this);
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
    mouseMove(mousePosRelative) { // event on mouse move in scoreboard
        //  console.log("x: " + mousePos.x + ' // y: ' + mousePos.y);
    }
    update() {
        this.draw();
    }
    draw(): void {
        //clear canvas
        this.clear();
        //import background
        this.background();

        //import Player Info
        this.drawPlayerInfo();

        //import enemy counter - TO REWORK
        this.enemyCounter(this.canvas.width/4, 10);

        //import timer
        this.drawTimer();
    }
    private drawPlayerInfo() {
        this.drawIcon(this.canvas.height/10,this.canvas.height/10);
        this.drawHP(this.canvas.height*1.1,this.canvas.height/8);
        this.drawGold(this.canvas.height*1.1,this.canvas.height /2);
    }
    private drawIcon(x,y) {
        this.ctx.save();
        this.ctx.translate(x, y);
        let tmp = new Image();
        tmp.src = "textures/content/player/man-mage-icon.png";
        this.ctx.strokeStyle = "white";
        this.ctx.lineWidth = 2;

        this.ctx.strokeRect(0, 0, this.canvas.height * 0.8, this.canvas.height * 0.8);
        this.ctx.drawImage(tmp, 1, 1, this.canvas.height * 0.8 - 2, this.canvas.height * 0.8 - 2);
        this.ctx.restore();
    }
    private drawHP(x,y) {
        let hp = game1.player.hp; // to do 
        let maxHp = 10; // to do !!! Needed rework of the hp system for the player
        let w = 100;
        let h = this.canvas.height / 8;
        this.ctx.save();
        this.ctx.translate(x, y);

        this.ctx.fillStyle = "lightgray";
        this.ctx.fillRect(0, 0, w, h);

        this.ctx.fillStyle = "red";
        this.ctx.fillRect(1, 1, w * hp / maxHp - 2, h - 2);

        this.ctx.font = "20px Roboto";
        this.ctx.fillText(hp + "/" + maxHp + " HP", w + 5, h, 50);
        this.ctx.restore();
    }
    private drawGold(x,y) {
        let gold = game1.player.gold; // to do
        this.ctx.save();
        this.ctx.translate(x, y);

        this.ctx.fillStyle = "gold";
        this.ctx.font = "22px Roboto";
        this.ctx.fillText(Math.floor(gold) + " GOLD", 0, 0, 50);

        this.ctx.restore();
    }
    private drawTimer() {
        let dist = MainInterface.getTimerDist();
        this.ctx.save();
        this.ctx.beginPath();
        let w = 200;
        let h = 60;
        let x = this.canvas.width / 2 - w/2;
        let y = (this.canvas.height - h) / 2;
        this.ctx.translate(x,y);
        this.ctx.strokeStyle = 'white';
        this.ctx.lineWidth = 2;
        this.ctx.rect(0, 0, w, h);
        this.ctx.rect(5, 5, w-10, h-10);
        this.ctx.stroke();
        this.ctx.beginPath();


        let str = this.timeToString(dist);

        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = "red";
        this.ctx.fillStyle = "lime";

        //fill minutes + ':'
        this.ctx.font = "35px Arial";
        this.ctx.fillText(str.minutesStr + ':', 40, 40);
        this.ctx.strokeText(str.minutesStr + ':', 40, 40);


        //fill seconds
        this.ctx.font = "30px Arial";
        this.ctx.fillText(str.secondsStr + ':', 90, 40);
        this.ctx.strokeText(str.secondsStr + ':', 90, 40);

        //fill millisceonds
        this.ctx.font = "25px Arial";
        this.ctx.fillText(str.millisecondsStr, 135, 40);
        this.ctx.strokeText(str.millisecondsStr, 135, 40);

        this.ctx.restore();
    }
    private timeToString(time: number) {
        //minutes not working TO DO
        let minutes = Math.floor(((time / 100000) % 60));
        let minutesStr = '';
        if (minutes > 10) {
            minutesStr = String(minutes);
        } else if (minutes == 0) {
            minutesStr = '00';
        } else minutesStr = '0' + minutes;
        let seconds = Math.floor((time / 1000) % 60);
        let secondsStr = '';
        if (seconds < 10) {
            secondsStr = '0' + seconds;
        } else secondsStr = String(seconds);

        let milliseconds = Math.floor((time / 10 % 100));
        let millisecondsStr = '';
        if (milliseconds < 10) {
            millisecondsStr = '0' + milliseconds;
        } else {
            millisecondsStr = String(milliseconds);
        }
        return { minutesStr, secondsStr, millisecondsStr };
    }
    private background(): void {
        this.ctx.save();
        this.ctx.fillStyle = "#256794"; //
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.restore();
    }
    private enemyCounter(x, y) {
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
        if (game1) enemies = game1.getEnemiesInterface().getEnemiesCount();

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