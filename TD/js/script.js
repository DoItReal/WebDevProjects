var animationID = null;
var playerX = 350, playerY = 520, playerSpeed = 10; //to be overrided in Game.constructor();
var play = false, pause = false;
var startTime = null, pauseTime = null;
var missleNum = 2;
var mousePosScr;

var divControlPanel;

//Missle class
/*
class Missle{
  constructor(x,y,speed, homing){
      this.x = x;
      this.y = y;
      this.speed = speed;
      this.homing = homing;
  }
}
class Missles {
    constructor() {
        this.missles = [];
    }
   
    initMissles(num) {
            for (let i = 0; i < num; i++) {
                //generating missles -->TO DO improve functionality
                let tmp = new Missle(getRandomInt(790 + 5), 0, getRandomInt(4) + 1, getRandomBoolean());
                this.missles.push(tmp);
            }
    }
    allMissles() {
        return this.missles;
      
    }
    get numberOfMissles() {
        return this.missles.length;
    }
    // UPDATING MISSLES LOCATION IN GAME -->> TO DO * integrate missle destruction logic * <<--
    updateMissles() {
        for (let i = 0; i < this.numberOfMissles; i++) {
            if (this.missles[i].y == 0 || this.missles[i].y >= 600) {
                this.missles[i].x = getRandomInt(790 + 5);
                this.missles[i].y = 0;
            }
            this.missles[i].y += this.missles[i].speed;
            if (this.missles[i].homing) {
                if (this.missles[i].x < game1.player.x+40 && this.missles[i].x+40+1 <= 800) this.missles[i].x += 0.5;
                if (this.missles[i].x > game1.player.x+40 && this.missles[i].x+40-1 >= 0) this.missles[i].x -= 0.5;
            }
        }
    }
    clearMissles() {
        this.missles = [];
    }
    fireMissles() {
        for (let i = 0; i < this.missles.length; i++) {
            missle(this.missles[i].x, this.missles[i].y, this.missles[i].homing);
            }
    }
    reset() {
    playerX = 350, playerY = 520, playerSpeed = 10;
    play = true;
        timerReset();
        game1.game.clearMissles();
    missleNum += 1;
    game1.game.initMissles(missleNum);
    animationID = requestAnimationFrame(game1.playNow);

    //dont know why but it doesnt work without this line ...
    animationID = requestAnimationFrame(game1.playNow);
}
}
*/

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

    constructor(x, y, speed, inventory) {
        this.x = x; //X location of enemy unit /int
        this.y = y; //Y location of enemy unit /int
        this.speed = speed; //speed of player pixels/click /int
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

}


class Game {
    defaultSpeed = 150;
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
        this.playNow = this.playNow.bind(this);

        //TO DO fetch the inventory from DB
        this.player.inventory.fill_inventory();
        
    }
    get getGame() { return this;}
   
    startGame() {
        this.addEnemy();
        play = true;
        animationID = requestAnimationFrame(this.playNow);
    }
    stopGame() {
    play = false;
    this.player.x = canvas.width/2, this.player.y = canvas.height/2;
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

            //check for hit
            if (this.hitCheck()) {
                cancelAnimationFrame(animationID);
                return 'Game Over';
            }
            scoreboardUpdate();
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

    addEnemy() {
        this.enemies.push(new Enemy(0,200,100,new Inventory()));
    }
}

//creating new Game() OBJECT 

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

