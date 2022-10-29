"use strict";
var MainInterface = getInterface.get(); /// TO DO Singleton! interface.js

var animationID = null;
var playerX = 350, playerY = 520, playerSpeed = 10; //to be overrided in Game.constructor();
var play = false, pause = false;
var startTime = null, pauseTime = null;
var mousePos = {x:null,y:null};
//var mousePosScr;

var divControlPanel;

class Player { //TO DO it singleton and to extends (to do)USER

    constructor(x, y, speed) {
        this.x = x; //X location of player /int
        this.y = y; //Y location of player /int
        this.speed = speed; //speed of player pixels/s /int
        this.inventory = new Inventory(); //Inventory of player /array of $items
        this.move = this.move.bind(this);
    }

    move() {
        var unit = this; //saving this in variable to save the context
        let moveLeft = function () {
                if (unit.x - unit.speed/fps >= 0) unit.x -= unit.speed/fps;
            else unit.x = 0;
            
        }
        let moveUp = function () {
            if (unit.y - (unit.speed / fps) >= 0) unit.y -= unit.speed / fps;
            else unit.y = 0;

        }
        let moveRight = function () {
            if (unit.x + unit.speed / fps <= canvas.width - 80) unit.x += unit.speed / fps;
            else unit.x = canvas.width - 80;

        }
        let moveDown = function () {
            if (unit.y + unit.speed / fps <= canvas.height - 80) unit.y += unit.speed / fps;
            else unit.y = canvas.height - 80;

        }
        if (pressedKeys.has(37)) moveLeft();
        if (pressedKeys.has(38)) moveUp();
        if (pressedKeys.has(39)) moveRight();
        if (pressedKeys.has(40)) moveDown();
        player(this.x, this.y);
        
    }
    
}

class Enemy { //TO DO it singleton and to extends (to do)USER

    constructor(name, lvl, x, y, w, h, speed,hp, inventory) {
        this.name = name;
        this.x = x; //X location of enemy unit /int
        this.y = y; //Y location of enemy unit /int
        this.width = w; //Width of enemy unit [px]/int
        this.height = h; //Width of enemy unit [px]/int
        this.speed = speed; //speed of player [pixels/s] /int
        this.hp = hp;
        this.lvl = lvl;
     //TO DO   this.inventory = inventory; //Inventory of enemy Unit /array of $items
    }
    move() {
        var unit = this; //saving this in variable to save the context
        let moveLeft = function () {
            if (unit.x - unit.speed / fps >= 0) {
                unit.x -= unit.speed / fps;
                return 1;
            }
            else {
                unit.x = 0;
                return 0;
            }
        }
        let moveUp = function () {
            if (unit.y - (unit.speed / fps) >= 0) {
                unit.y -= unit.speed / fps;
                return 1;
            } else {
                unit.y = 0;
                return 0;
            }

        }
        let moveRight = function () {
            if (unit.x + unit.speed / fps <= canvas.width - 40) {
                unit.x += unit.speed / fps;
                return 1;
            }
            else {
                unit.x = canvas.width - 40;
                return 0;
            }
        }
        let moveDown = function () {
            if (unit.y + unit.speed / fps <= canvas.height - 40) {
                unit.y += unit.speed / fps;
                return 1;
            }
            else {
                unit.y = canvas.height - 40;
                return 0;
            }
        }

        if (!moveRight()) unit.x = 0;

        enemy(this.x, this.y);

    }
    receiveDmg(dmg) {
        this.hp -= dmg;
    }
    tooltip(mousePosR) {
        let w = 120; //width of the tooltip
        let h = 50; //height of the tooltip

        ctx.save();
        if (mousePosR.x + w > canvas.width) mousePosR.x = canvas.width - w;
        if (mousePosR.y + h > canvas.height) mousePosR.y = canvas.height - h;
        ctx.translate(mousePosR.x, mousePosR.y);
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = "lightblue";
        ctx.strokeStyle = "white";
        ctx.fillRect(0, 0, w, h);
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.7;
        ctx.strokeRect(0, 0, w, h);
        ctx.globalAlpha = 1;
        ctx.fillStyle = "white";
        ctx.font = "20px Roboto";
        ctx.fillText(this.name + ' lvl ' + this.lvl, 10, 30);


        ctx.restore();
    }
}
class enemy_Peon extends Enemy {
    constructor(lvl, x, y, inventory) {
        super('Peon', lvl, x, y, 40, 40, 100, 10, new Inventory());
    }
}
var tower_archer = { name:'Archer Tower', dmg: 2, range: 200, speed: 0.5, width: 30, height: 30 }; //lvl 1 archer tower, dmg:2 /shot, range:200 [px]radius, speed 1 [1/s]
class arrow {
    constructor(x, y, w, h, speed, dmg, target, tower) {
        this.x = x;             //X start
        this.y = y;             //Y start
        this.w = w;             //Width
        this.h = h;             //Height
        this.speed = speed;     //Speed [px/s]
        this.dmg = dmg;         //Dmg /hit
        this.target = target;  //Target Enemy() Object
        this.tower = tower;
    }
    update() {
        if (this.x < this.target.x) this.x += this.speed / fps;
        else if (this.x > this.target.x) this.x -= this.speed / fps;

        if (this.y < this.target.y) this.y += this.speed/fps;
        else if (this.y > this.target.y) this.y -= this.speed/fps;
        texture_arrow(this.x, this.y, this.w, this.h);

        if (rectsOverlap(this.x, this.y, this.w, this.h, this.target.x, this.target.y, this.target.width, this.target.height)) {
            this.target.receiveDmg(this.dmg);
            if (this.target.hp <= 0) this.tower.enemyDestroyed(this.target);
            return 1;
        }
        else return 0;

    }
}
class Tower {
    constructor(x, y, type, lvl) {
        this.x = x;
        this.y = y;
        this.type = tower_archer; //to do different towers and switch based definition
        this.lvl = lvl;
        this.target = null;
        this.shots = [];
        this.attackCD = 0;
    }
    radar(game) {

        if (this.target == null) {
            for (i = 0; i < game.enemies.length; i++) {
                let enemyX = game.enemies[i].x;
                let enemyY = game.enemies[i].y;
                let enemyW = game.enemies[i].width;
                let enemyH = game.enemies[i].height;
                if (circRectsOverlap(enemyX, enemyY, enemyW, enemyH, this.x, this.y, this.type.range) && game.enemies[i].hp > 0) {
                    return game.enemies[i];
                }
            }
        } else if (!circRectsOverlap(this.target.x, this.target.y, this.target.width, this.target.height, this.x, this.y, this.type.range)) { //if target is not in range
            return null;
        } else return this.target;
        return null;
    }
    attack() {
        if (this.attackCD <= 0) {
            this.shoot();
            this.attackCD = this.type.speed;
        } else this.reload();

        if (this.shots && this.shots.length > 0) {
            for (i = 0; i < this.shots.length; i++) {
                if (this.shots[i].update()) { //update arrows
                    console.log('arrow reached destination');
                    this.shots.splice(i, 1);
                    i--;
                }
            }
        }
    }
    shoot() {
        this.shots.push(new arrow(this.x, this.y, 5, 10, 100, this.type.dmg*this.lvl, this.target, this));
    }
    update(game) {
        this.texture();
        this.target = this.radar(game);
        if (this.target != null) this.attack();
        else {
            this.reload();
            this.shots = [];
        }
    }
    reload() {
        if (this.attackCD > 0) this.attackCD -= 1 / fps;
        if (this.attackCD < 0) this.attackCD = 0;
    }
    enemyDestroyed(enemy) {
        if (this.target == enemy) {
            this.target = null;
            this.shots = [];
        }
    }
    texture(preview = false) {
        ctx.save();
        ctx.beginPath();
        if (preview) ctx.globalAlpha = 0.5;
        ctx.translate(this.x, this.y);
        ctx.fillStyle = "blue";
        ctx.fillRect(-(this.type.width / 2), -this.type.height / 2, 30, 30);
        ctx.fillStyle = "green";
        ctx.fillRect(-this.type.width / 2 + 5, -this.type.height / 2 + 5, 20, 20);
        ctx.fillStyle = "red";
        ctx.fillRect(-this.type.width / 2 + 10, -this.type.height / 2 + 10, 10, 10);
        ctx.strokeStyle = "black";
        ctx.arc(0, 0, this.type.range, 0, 2 * Math.PI, false);
        ctx.stroke();

        ctx.restore();
    }
    tooltip(mousePosR) {
        let w = 180;
        let h = 50;
    

        ctx.save();
        if (mousePosR.x + w > canvas.width) mousePosR.x = canvas.width - w;
        if (mousePosR.y + h > canvas.height) mousePosR.y = canvas.height - h;
        ctx.translate(mousePosR.x, mousePosR.y);
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = "lightblue";
        ctx.strokeStyle = "white";
        ctx.fillRect(0, 0, w, h);
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.7;
        ctx.strokeRect(0, 0, w, h);
        ctx.globalAlpha = 1;
        ctx.fillStyle = "white";
        ctx.font = "20px Roboto";
        ctx.fillText(this.type.name + ' lvl ' + this.lvl, 10, 30);
       

        ctx.restore();
    }
}


class Game {
    defaultSpeed = 150;
    preview = null;
    /*          Constructor()
     *          
     *          For creating Game instance we need: 
     *              1- Player ID - fetch info from DB - to do
     *          
     *  creating new Player;
     *  binding this to playNow() - main animation function
     *  
     *  TO DO 
     *      1- Fetch Player from DB
     *      
     */
    constructor() {
        this.player = new Player(canvas.width / 2, canvas.height / 2, this.defaultSpeed);
        this.enemies = [];
        this.towers = [];
        this.playNow = this.playNow.bind(this);

        //TO DO fetch the inventory from DB
        this.player.inventory.fill_inventory();

    }
    get getGame() { return this; }
    get getEnemiesCount() {
        if (this.enemies) return this.enemies.length;
        return 0;
    }
    startGame() {
        // this.addEnemy();
        //  this.addTower();
        play = true;
        animationID = requestAnimationFrame(this.playNow);
    }
    stopGame() {
        play = false;
        this.player.x = canvas.width / 2, this.player.y = canvas.height / 2;
        timerReset();
        animationID = cancelAnimationFrame(animationID);
        pause = false;
    }
    playNow() {
        initFPS(performance.now());
        //clear Playground
        if (!pause) {
            clearPlayground();
            init_background();
            if (!play) {
                cancelAnimationFrame(animationID);
                return 'Game Over';
            }
            //position the player
            this.player.move();
            //position the enemies
            this.enemies.forEach(element => element.move());
            this.towers.forEach(element => element.update(this));
            if (this.enemies && this.enemies.length > 0) this.checkEnemies();
            //check for hit
            if (this.hitCheck()) {
                cancelAnimationFrame(animationID);
                return 'Game Over';
            }
            scoreboardUpdate();
            this.visualisePreview();
            if (canvas === document.activeElement) this.checkForOverlapingObjectsPlayground();
        }
        timer(30, 10);
        animationID = requestAnimationFrame(this.playNow);

    }
    hitCheck() { // TO DO

        /***********************************************************
         *   ___________________________________________________   * 
         *  |  ###############################################  |  *
         *  |  ### Here goes the logic for collision check ###  |  *  
         *  |  ###############################################  |  *
         *  |___________________________________________________|  *
         ***********************************************************/
        //check for player<--->enemy collision
        if (this.enemies.length) {
            for (let i = 0; i < this.enemies.length; i++) {
                if (rectsOverlap(this.player.x, this.player.y, 80, 80, this.enemies[i].x, this.enemies[i].y, 40, 40) == true)
                    console.log('Collision');
            }
        }
    }
    checkEnemies() {
        for (i = 0; i < this.enemies.length; i++) {
            if (this.enemies[i].hp <= 0) this.destroyEnemy(i);
        }
    }
    addEnemyPeon() {
        let x = 0;
        let y = 200;
        let inventory = new Inventory();
        this.enemies.push(new enemy_Peon(1,x, y,inventory));
    }
    addTower(x, y, type) {
        // x = 600;
        // y = 300;
        let lvl = 2;
        this.towers.push(new Tower(x+40, y, type, lvl)); //to do X
    }
    destroyEnemy(index) {
        if (this.towers && this.towers.length > 0) this.towers.forEach(element => element.enemyDestroyed(this.enemies[index]));
        this.enemies.splice(index, 1);
    }
    visualisePreview() {
        if (clipboard != null && this.preview != null) {
            tower(this.preview.x, this.preview.y, clipboard.type.width, clipboard.type.height, clipboard.type.range, 30, 200, true);
        }
    }
    updatePreview(getX, getY) {
        if (clipboard != null) {
            this.preview = {
                x: getX+40, // to do
                y: getY
            }
        } else this.preview = null;
    }
    checkMouse() {

    }
    checkForOverlapingObjectsPlayground() {
        let obj = null;
        let rect = canvas.getBoundingClientRect();
        let mousePosR = {
            x: mousePos.x - rect.left,
            y: mousePos.y - rect.top
        };
        if (this.enemies && this.enemies.length > 0) {
            for (i = 0; i < this.enemies.length; i++) {
                if (circRectsOverlap(this.enemies[i].x-40, this.enemies[i].y, this.enemies[i].width, this.enemies[i].height, mousePosR.x, mousePosR.y, 5)) {
                    obj = this.enemies[i];
                    obj.tooltip(mousePosR);
                    return;
                }
            }
        }
        if (this.towers && this.towers.length > 0) {
            for (i = 0; i < this.towers.length; i++) {
                if (circRectsOverlap(this.towers[i].x-40, this.towers[i].y-20, this.towers[i].type.width, this.towers[i].type.height, mousePosR.x, mousePosR.y, 5)) {
                    obj = this.towers[i];
                    obj.tooltip(mousePosR);
                    return;
                }
            }
        }
    }
}

//declaring variable for new $Game() OBJECT // TO DO REWORK creating the object when starting the game with $divStartStopButton

var game1;

function init() {
    init_canvas();
    try {
        load_textures();
    } catch (e) {
        console.log('Failed to load textures: error: ' + e);
    }
    game1 = new Game();

    init_inventory();
    init_controlPanel();
    initFPSCounter();
    
    //init event listeners on controls
    init_events_controls();
}

