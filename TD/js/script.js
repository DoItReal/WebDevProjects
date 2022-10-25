var animationID = null;
var playerX = 350, playerY = 520, playerSpeed = 10;
var play = false, pause = false;
var startTime = null, pauseTime = null;
var missleNum = 2;
var mousePosScr;

var divControlPanel;

class Player { //TO DO it singleton and to extends (to do)USER

    constructor(x, y, speed, inventory) {
        this.x = x; //X location of player /int
        this.y = y; //Y location of player /int
        this.speed = speed; //speed of player pixels/click /int
        this.inventory = inventory; //Inventory of player /array of $items
    }
    move() {
        let moveLeft = function () {
                if (game1.player.x - game1.player.speed/fps >= 0) game1.player.x -= game1.player.speed/fps;
            else game1.player.x = 0;
            
        }
        let moveUp = function () {
            if (game1.player.y - (game1.player.speed / fps) >= 0) game1.player.y -= game1.player.speed / fps;
            else game1.player.y = 0;

        }
        let moveRight = function () {
            if (game1.player.x + game1.player.speed / fps <= canvas.width - 80) game1.player.x += game1.player.speed / fps;
            else game1.player.x = canvas.width - 80;

        }
        let moveDown = function () {
            if (game1.player.y + game1.player.speed / fps <= canvas.height - 80) game1.player.y += game1.player.speed / fps;
            else game1.player.y = canvas.height - 80;

        }
        if (pressedKeys.has(37)) moveLeft();
        if (pressedKeys.has(38)) moveUp();
        if (pressedKeys.has(39)) moveRight();
        if (pressedKeys.has(40)) moveDown();
        player(this.x, this.y);
        
    }
    
}
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
class Game {
    constructor() {
        this.game = new Missles();
        this.inventory = new Inventory();
        this.player = new Player(playerX, playerY, playerSpeed, this.inventory)
        this.playNow = this.playNow.bind(this);
        this.startGame = this.startGame.bind(this);

        //TO DO fetch the inventory from DB
        this.inventory.fill_inventory();
        
    }

   
    startGame() {
        play = true;
        this.game.initMissles(missleNum);
        animationID = requestAnimationFrame(this.playNow);
    return this.game;
    }
    stopGame(game) {
    play = false;
    playerX = 350, playerY = 520;
    timerReset();
    cancelAnimationFrame(this.game);
    pause = false;
    }
    playNow() {
        initFPS(performance.now());
        //clear Playground
        if (!pause) {
            clearPlayground();
            if (!play) {
                cancelAnimationFrame(animationID);
                return 'Game Over';
            }

            //position the player
            this.player.move();

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

/*      for(let i=0;i<variations;i++){
 *          if(collission(i) == true) return 1;
 *      }
 * 
 */
        return 0;
}
}

//creating new Game() OBJECT 
var game1 = new Game();

function init() {
    init_inventory();
    init_controlPanel();
    initFPSCounter();
    init_canvas();
    //init event listeners on controls
    init_events_controls();
}

