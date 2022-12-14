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
        const rect = this.canvas.getBoundingClientRect();
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
class Scoreboard extends Canvas {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    widgets: Array<PlayerInfo> = [];
    constructor() {
        super();
        this.mouseMove = this.mouseMove.bind(this);
        this.mouseDown = this.mouseDown.bind(this);
    }

        //public method
    init() {
        this.canvas = document.querySelector('#Scoreboard');
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight * 0.1;
        this.ctx = this.canvas.getContext('2d');
        this.init_events();
        const tmp = new PlayerInfo(this.canvas, this.ctx, game1.player);
        tmp.init();
        this.widgets.push(tmp);
    }
    update() {
        this.draw();
        this.widgets.forEach(e => { e.update(); });
    }
    mouseMove(mousePosRelative) { // event on mouse move in scoreboard
        //  console.log("x: " + mousePos.x + ' // y: ' + mousePos.y);
    }
    mouseDown(e) {
        e.preventDefault();
        const button = e.button;
        const mousePos = MainInterface.getMousePos(this, e);
        console.log('Button: ' + button + ' pressed at x: ' + mousePos.x + ' y: ' + mousePos.y);
    }

        //private methods
    private init_events() {
        //prevent opening context menu on right click;
        this.canvas.addEventListener('contextmenu', function (e) { e.preventDefault(); }, false);
        //event listener on 'mousedown' Scoreboard
        this.canvas.addEventListener('mousedown', this.mouseDown, false);
    }
    private draw(): void {
        //clear canvas
        this.clear();
        //import background
        this.background();

        //import enemy counter - TO REWORK
        this.enemyCounter(this.canvas.width / 3, 10);

        //import timer
        this.drawTimer();

        //import WaveWidget
        this.waveWidget();
    }
    private waveWidget() {
        const wave = game1.getCurrentWave();
        if (wave != null) {
            this.drawWaveWidget(wave.getSize());
        } else
            this.drawWaveWidget();
    }
    private drawWaveWidget(size: number = 0) {
        const w = 120;
        const h = 60;
        const x = this.canvas.width / 2 + w;
        const y = (this.canvas.height - h) / 2;

        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.fillStyle = "lightgray";
        this.ctx.fillRect(0, 0, w, h);
        this.ctx.strokeStyle = "darkslategray";
        this.ctx.strokeRect(0, 0, w, h);

        this.ctx.font = "15px Roboto";
        this.ctx.fillStyle = "black";
        this.ctx.fillText("Current Wave", 10, 15);
        this.ctx.fillText("Size: " + size, 10, 35);
        this.ctx.restore();
    }

    private drawTimer() {
        const dist = MainInterface.getTimerDist();
        this.ctx.save();
        this.ctx.beginPath();
        const w = 200;
        const h = 60;
        const x = this.canvas.width / 2 - w / 2;
        const y = (this.canvas.height - h) / 2;
        this.ctx.translate(x, y);
        this.ctx.strokeStyle = 'white';
        this.ctx.lineWidth = 2;
        this.ctx.rect(0, 0, w, h);
        this.ctx.rect(5, 5, w - 10, h - 10);
        this.ctx.stroke();
        this.ctx.beginPath();


        const str = this.timeToString(dist);

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
        const minutes = Math.floor(((time / 100000) % 60));
        let minutesStr = '';
        if (minutes > 10) {
            minutesStr = String(minutes);
        } else if (minutes == 0) {
            minutesStr = '00';
        } else minutesStr = '0' + minutes;
        const seconds = Math.floor((time / 1000) % 60);
        let secondsStr = '';
        if (seconds < 10) {
            secondsStr = '0' + seconds;
        } else secondsStr = String(seconds);

        const milliseconds = Math.floor((time / 10 % 100));
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
        this.ctx.rect(0, 15, 100, 50);
        this.ctx.rect(5, 20, 90, 40);
        this.ctx.stroke();
        this.ctx.beginPath();

        this.ctx.strokeStyle = 'gray';
        this.ctx.lineWidth = 4;
        this.ctx.fillStyle = "white";
        this.ctx.font = "23px Monaco";
        this.ctx.strokeText("Enemies: ", 10, 10);
        this.ctx.fillText("Enemies:", 10, 10);

        this.ctx.strokeStyle = 'yellow';
        this.ctx.lineWidth = 4;
        this.ctx.fillStyle = 'red';
        this.ctx.textAlign = 'center';

        let enemies = 0;
        if (game1) enemies = game1.getEnemiesInterface().getEnemiesCount();

        this.ctx.font = "25px Arial";
        this.ctx.strokeText(String(enemies), 50, 50);
        this.ctx.fillText(String(enemies), 50, 50);
        this.ctx.restore();
    }
}

class PlayerInfo {
    private player: Player;
    private icon: HTMLImageElement = new Image();
    private ctx: CanvasRenderingContext2D;
    private canvas: HTMLCanvasElement;
    private width: number;
    private height: number;

    constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, player: Player) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.player = player;
        this.width = 250;
        this.height = this.canvas.height * 0.9;
    }
        //public methods
    init() {
        this.icon.src = this.player.getIcon();
        this.icon.onload= () => this.update();
    }
    update() {
        this.drawPlayerInfo();
    }
    getIcon() {
        return this.icon;
    }
         //private methods
    private drawPlayerInfo() {
        this.border();
        this.drawIcon(this.canvas.height / 10, this.canvas.height / 10);
        this.drawHP(this.canvas.height * 1.1, this.canvas.height / 8);
        this.drawGold(this.canvas.height * 1.1, this.canvas.height / 2);
    }
    private border() {
        this.ctx.save();
        this.ctx.strokeStyle = "darkslategray";
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect((this.canvas.height - this.height) / 2,(this.canvas.height - this.height) / 2,this.width, this.height);

        this.ctx.restore();
    }
    private drawIcon(x, y) {

        const w = this.canvas.height * 0.8 - 2;
        const h = this.canvas.height * 0.8 - 2;
            this.ctx.save();
            this.ctx.translate(x, y);
            this.ctx.strokeStyle = "white";
            this.ctx.lineWidth = 2;

            this.ctx.strokeRect(0, 0, this.canvas.height * 0.8, this.canvas.height * 0.8);
            this.ctx.drawImage(this.icon, 1, 1,w, h);
            this.ctx.restore();
    }
    private drawHP(x, y) {
        const hp = game1.getPlayer().getBase().getHP(); // to do 
        const maxHp = game1.getPlayer().getBase().getMaxHP(); // to do !!! Needed rework of the hp system for the player
        const w = 100;
        const h = this.canvas.height / 8;
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
    private drawGold(x, y) {
        const gold = game1.player.gold; // to do
        this.ctx.save();
        this.ctx.translate(x, y);

        this.ctx.fillStyle = "gold";
        this.ctx.font = "22px Roboto";
        this.ctx.fillText(Math.floor(gold) + " GOLD", 0, 0, 50);

        this.ctx.restore();
    }
}