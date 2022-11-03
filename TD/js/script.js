"use strict"
var MainInterface = getInterface.get(); /// Singleton! interface.js

 // TO DO CLASS For the FPS counter

var divControlPanel; //to remove it when the ControlPanel class is ready

class Player { //TO DO it singleton and to extends (to do)USER

    constructor(x, y, speed) {
        this.x = x; //X location of player /int
        this.y = y; //Y location of player /int
        this.speed = speed; //speed of player pixels/s /int
        this.inventory = new Inventory(); //Inventory of player /array of $items
        this.move = this.move.bind(this);
    }

    move() {
        let fps = game1.fps.fps;
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
            if (unit.x + unit.speed / fps <= MainInterface.getPlayground().getCanvas().width - 80) unit.x += unit.speed / fps;
            else unit.x = MainInterface.getPlayground().getCanvas().width - 80;

        }
        let moveDown = function () {
            if (unit.y + unit.speed / fps <= MainInterface.getPlayground().getCanvas().height - 80) unit.y += unit.speed / fps;
            else unit.y = MainInterface.getPlayground().getCanvas().height - 80;

        }
        if (MainInterface.pressedKeys.has(37)) moveLeft();
        if (MainInterface.pressedKeys.has(38)) moveUp();
        if (MainInterface.pressedKeys.has(39)) moveRight();
        if (MainInterface.pressedKeys.has(40)) moveDown();
        this.drawPlayer(this.x, this.y);
        
    }
    drawPlayer(x, y) {
        let ctx = MainInterface.getPlayground().getContext();
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = "green";
    ctx.fillRect(0, 0, 80, 80);
    ctx.fillStyle = "white";
    ctx.fillRect(15, 20, 20, 20);
    ctx.fillRect(50, 20, 20, 20);
    ctx.fillStyle = "blue";
    ctx.fillRect(19, 24, 12, 12);
    ctx.fillRect(54, 24, 12, 12);
    ctx.fillStyle = "black";
    ctx.fillRect(22, 27, 6, 6);
    ctx.fillRect(57, 27, 6, 6);
    ctx.restore();
}
    
}

class Game {
    defaultSpeed = 150;
    preview = null;
    animationID = null;
    play = false;
    pause = false;
    fps = new FPS();
    misslesInterface;
    towersInterface;
    enemyInterface;
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
        this.player = new Player(MainInterface.getPlayground().getCanvas().width / 2, MainInterface.getPlayground().getCanvas().height / 2, this.defaultSpeed);
        this.playNow = this.playNow.bind(this);
        this.misslesInterface = new _Missles();
        this.towersInterface = new _Towers();
        this.enemyInterface = new _Enemies();
        //TO DO fetch the inventory from DB
        this.player.inventory.fill_inventory();

    }
     getMisslesInterface() {
        return this.misslesInterface;
    }
     getTowersInterface() {
        return this.towersInterface;
    }
     getEnemiesInterface() {
        return this.enemyInterface;
    }
    get getGame() { return this; }
    get getEnemiesCount() {
        if (this.enemies) return this.enemies.length;
        return 0;
    }
    init() {
        this.fps.init();
    }
    startGame() {
        this.play = true;
        this.animationID = requestAnimationFrame(this.playNow);
        MainInterface.getScoreboard().timerOn = true;
    }
    stopGame() {
        this.play = false;
        this.player.x = 100, 100;
        MainInterface.getScoreboard().timerReset();
        this.animationID = cancelAnimationFrame(this.animationID);
        this.pause = false;
        MainInterface.getScoreboard().timerOn = false;
    }
    playNow() {
        this.fps.update(performance.now());
        //clear Playground
        if (!this.pause) {
            MainInterface.update();
            if (!this.play) {
                cancelAnimationFrame(this.animationID);
                return 'Game Over';
            }
            //position the player
            this.player.move();

            //position the enemies
            this.enemyInterface.update();
            this.misslesInterface.update();
            this.towersInterface.update();
          //  this.visualisePreview();
           //*Preview logic *  if (MainInterface.getPlayground === document.activeElement) this.checkForOverlapingObjectsPlayground();
        }
        this.animationID = requestAnimationFrame(this.playNow);

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
    visualisePreview() {
        if (MainInterface.clipboard != null && this.preview != null) {
            tower(this.preview.x, this.preview.y, MainInterface.clipboard.type.width, MainInterface.clipboard.type.height, MainInterface.clipboard.type.range, 30, 200, true);
        }
    }
    updatePreview(getX, getY) {
        if (MainInterface.clipboard != null) {
            this.preview = {
                x: getX+40, // to do
                y: getY
            }
        } else this.preview = null;
    }
    checkForOverlapingObjectsPlayground() {
        let obj = null;
        let rect = MainInterface.getPlayground.getCanvas.getBoundingClientRect();
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
    MainInterface.init();
    MainInterface.init_events();

    game1 = new Game();

    init_inventory();
    init_controlPanel();
   game1.init();
}

