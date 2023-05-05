class Canvas {
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
    clear() {
        this.ctx.save();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.restore();
    }
}
class Scoreboard extends Canvas {
    constructor() {
        super();
        this.widgets = [];
        this.selected = null;
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
    setObject(obj) {
        this.selected = obj;
    }
    mouseMove(mousePosRelative) {
        //  console.log("x: " + mousePosRelative.x + ' // y: ' + mousePosRelative.y);
    }
    mouseDown(e) {
        e.preventDefault();
        const button = e.button;
        const mousePos = MainInterface.getMousePos(this, e);
        console.log('Button: ' + button + ' pressed at x: ' + mousePos.x + ' y: ' + mousePos.y);
    }
    //private methods
    init_events() {
        //prevent opening context menu on right click;
        this.canvas.addEventListener('contextmenu', function (e) { e.preventDefault(); }, false);
        //event listener on 'mousedown' Scoreboard
        this.canvas.addEventListener('mousedown', this.mouseDown, false);
    }
    draw() {
        //clear canvas
        this.clear();
        //import background
        this.background();
        //import enemy counter - TO REWORK
        this.enemyCounter();
        //import timer
        this.drawTimer();
        //import WaveWidget
        this.waveWidget();
        //import UpdateWidget
        this.updateWidget();
    }
    waveWidget() {
        const wave = game1.getCurrentWave();
        if (wave != null) {
            this.drawWaveWidget(wave.getSize());
        }
        else
            this.drawWaveWidget();
    }
    drawWaveWidget(size = 0) {
        const w = this.canvas.width * 0.075;
        const h = this.canvas.height * 0.75;
        const x = this.canvas.width / 2 + w;
        const y = (this.canvas.height - h) / 2;
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.fillStyle = "lightgray";
        this.ctx.fillRect(0, 0, w, h);
        this.ctx.strokeStyle = "darkslategray";
        this.ctx.strokeRect(0, 0, w, h);
        this.ctx.font = h * 0.3 + "px Roboto";
        this.ctx.fillStyle = "black";
        this.ctx.fillText("Current Wave", w * 0.1, h * 0.4);
        this.ctx.fillText("Size: " + size, w * 0.1, h * 0.8);
        this.ctx.restore();
    }
    updateWidget() {
        const w = this.canvas.width * 0.1; //10% of canvas width
        const h = this.canvas.height * 0.9; //90% of canvas height
        const x = this.canvas.width * 0.2;
        const y = (this.canvas.height - h) / 2;
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.fillStyle = "lightgray";
        this.ctx.fillRect(0, 0, w, h);
        this.ctx.strokeStyle = "darkslategray";
        this.ctx.strokeRect(0, 0, w, h);
        this.ctx.font = h * 0.23 + "px Roboto";
        this.ctx.fillStyle = "black";
        if (this.selected != null) {
            this.ctx.fillText(this.selected.name + " lvl " + this.selected.experience.getLevel(), 20, 15);
        }
        else {
            this.ctx.fillText("Update Tower Widget", 10, 15);
        }
        this.ctx.restore();
    }
    drawTimer() {
        const dist = MainInterface.getTimerDist();
        this.ctx.save();
        this.ctx.beginPath();
        const w = this.canvas.width * 0.12; //12% of canvas width
        const h = this.canvas.height * 0.9; //90% of canvas height
        const x = this.canvas.width / 2 - w / 2;
        const y = (this.canvas.height - h) / 2;
        this.ctx.translate(x, y);
        this.ctx.strokeStyle = 'white';
        this.ctx.lineWidth = 0.01 * w;
        this.ctx.rect(0, 0, w, h);
        this.ctx.rect(0.025 * w, 0.025 * w, w - 0.05 * w, h - 0.05 * w);
        this.ctx.stroke();
        this.ctx.beginPath();
        const str = this.timeToString(dist);
        this.ctx.lineWidth = 0.005 * w;
        this.ctx.strokeStyle = "red";
        this.ctx.fillStyle = "lime";
        //fill minutes + ':'
        this.ctx.font = 0.2 * w + "px Arial";
        this.ctx.fillText(str.minutesStr + ':', w * 0.18, h * 0.65);
        this.ctx.strokeText(str.minutesStr + ':', w * 0.18, h * 0.65);
        //fill seconds
        this.ctx.font = 0.18 * w + "px Arial";
        this.ctx.fillText(str.secondsStr + ':', w * 0.45, h * 0.65);
        this.ctx.strokeText(str.secondsStr + ':', w * 0.45, h * 0.65);
        //fill millisceonds
        this.ctx.font = 0.15 * w + "px Arial";
        this.ctx.fillText(str.millisecondsStr, w * 0.7, h * 0.65);
        this.ctx.strokeText(str.millisecondsStr, w * 0.7, h * 0.65);
        this.ctx.restore();
    }
    timeToString(time) {
        //minutes not working TO DO
        const minutes = Math.floor(((time / 100000) % 60));
        let minutesStr = '';
        if (minutes > 10) {
            minutesStr = String(minutes);
        }
        else if (minutes == 0) {
            minutesStr = '00';
        }
        else
            minutesStr = '0' + minutes;
        const seconds = Math.floor((time / 1000) % 60);
        let secondsStr = '';
        if (seconds < 10) {
            secondsStr = '0' + seconds;
        }
        else
            secondsStr = String(seconds);
        const milliseconds = Math.floor((time / 10 % 100));
        let millisecondsStr = '';
        if (milliseconds < 10) {
            millisecondsStr = '0' + milliseconds;
        }
        else {
            millisecondsStr = String(milliseconds);
        }
        return { minutesStr, secondsStr, millisecondsStr };
    }
    background() {
        this.ctx.save();
        this.ctx.fillStyle = "#256794"; //
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.restore();
    }
    enemyCounter() {
        let x = this.canvas.width / 3;
        let y = this.canvas.height * 0.1;
        let w = this.canvas.width * 0.06;
        let h = this.canvas.height * 0.7;
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.translate(x, y);
        this.ctx.strokeStyle = "white";
        this.ctx.lineWidth = 0.01 * w;
        this.ctx.rect(0, h * 0.25, w, h * 0.95);
        this.ctx.rect(w * 0.05, h * 0.35, w * 0.9, h * 0.75);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.strokeStyle = 'gray';
        this.ctx.lineWidth = 0.002 * this.canvas.width;
        this.ctx.fillStyle = "white";
        this.ctx.font = h * 0.4 + "px Monaco";
        this.ctx.strokeText("Enemies: ", w * 0.1, h * 0.17);
        this.ctx.fillText("Enemies:", w * 0.1, h * 0.17);
        this.ctx.strokeStyle = 'yellow';
        this.ctx.lineWidth = 0.04 * w;
        this.ctx.fillStyle = 'red';
        this.ctx.textAlign = 'center';
        let enemies = 0;
        if (game1)
            enemies = game1.getEnemiesInterface().getEnemiesCount();
        this.ctx.font = h * 0.6 + "px Arial";
        this.ctx.strokeText(String(enemies), w * 0.5, h * 0.9);
        this.ctx.fillText(String(enemies), w * 0.5, h * 0.9);
        this.ctx.restore();
    }
}
class PlayerInfo {
    constructor(canvas, ctx, player) {
        this.icon = new Image();
        this.canvas = canvas;
        this.ctx = ctx;
        this.player = player;
        this.width = this.canvas.width * 0.15;
        this.height = this.canvas.height * 0.9;
    }
    //public methods
    init() {
        this.icon.src = this.player.getIcon();
        this.icon.onload = () => this.update();
    }
    update() {
        this.drawPlayerInfo();
    }
    getIcon() {
        return this.icon;
    }
    //private methods
    drawPlayerInfo() {
        this.border();
        this.drawIcon(this.canvas.height / 10, this.canvas.height / 10);
        this.drawHP(this.canvas.height * 1.1, this.canvas.height * 0.2);
        this.drawGold(this.canvas.height * 1.1, this.canvas.height * 0.7);
    }
    border() {
        this.ctx.save();
        this.ctx.strokeStyle = "darkslategray";
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect((this.canvas.height - this.height) / 2, (this.canvas.height - this.height) / 2, this.width, this.height);
        this.ctx.restore();
    }
    drawIcon(x, y) {
        const w = this.canvas.height * 0.8 - 2;
        const h = this.canvas.height * 0.8 - 2;
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.strokeStyle = "white";
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(0, 0, this.canvas.height * 0.8, this.canvas.height * 0.8);
        this.ctx.drawImage(this.icon, 1, 1, w, h);
        this.ctx.restore();
    }
    drawHP(x, y) {
        const hp = game1.getPlayer().getBase().getHP(); // to do 
        const maxHp = game1.getPlayer().getBase().getMaxHP(); // to do !!! Needed rework of the hp system for the player
        const w = this.canvas.width * 0.065;
        const h = this.canvas.height / 8;
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.fillStyle = "lightgray";
        this.ctx.fillRect(0, 0, w, h);
        this.ctx.fillStyle = "red";
        this.ctx.fillRect(1, 1, w * hp / maxHp - 2, h - 2);
        this.ctx.font = this.canvas.height * 0.3 + "px Roboto";
        this.ctx.fillText(hp + "/" + maxHp + " HP", w + w * 0.01, h, w * 0.5);
        this.ctx.restore();
    }
    drawGold(x, y) {
        const gold = game1.player.gold; // to do
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.fillStyle = "gold";
        this.ctx.font = this.canvas.height * 0.35 + "px Roboto";
        this.ctx.fillText(Math.floor(gold) + " GOLD", 0, 0, 50);
        this.ctx.restore();
    }
}
//# sourceMappingURL=Scoreboard.js.map