var animationID = null;
var playerX = 350, playerY = 520, playerSpeed = 10;
var play = false, pause = false;
var startTime = null, pauseTime = null;
var missleNum = 2;
var mousePosScr;


class Item {
    //stackable = true; TO DO
    constructor(name, type, rarity, value, icon, stack) {
        this.name = name; //string
        this.type = type; //string
        this.rarity = rarity; //string
        this.value = value; //int
        this.icon = icon;
        this.stack = stack;
    }
}
class Inventory { //TO DO it singleton
    constructor() {
        this.inventory = [];
        this.size = 0;
    }

    //METHODS
    add_item(item) {
        this.inventory.push(item);
        this.size++;
    }
    drop_item(slotIndex) {
        inventory.splice(slotIndex, 1);
        this.size--;
    }
    get_item_OBJ(itemIndex) {
        return this.inventory[itemIndex];
    }
    fill_inventory() { //to do getting items from DB
        this.add_item(new Item('Diamonds', 'Currency', 'Legendary', 100, 'textures/icons/items/diamonds-icon.png', true));
        this.add_item(new Item('Gold', 'Currency', 'Elite', 2, 'textures/icons/items/gold-icon.png', true));
        this.add_item(new Item('Silver', 'Currency', 'Rare', 13, 'textures/icons/items/silver-icon.png', true));
        this.add_item(new Item('Copper', 'Currency', 'Uncommon', 88, 'textures/icons/items/copper-icon.png', true));
        this.add_item(new Item('Junk', 'Junk', 'Junk',31, 'textures/icons/items/junk-icon.png', true));
        this.add_item(new Item('Sword', 'Weapon', 'Rare', 1, 'textures/icons/items/sword-icon.png', false));
        this.add_item(new Item('Shield', 'Off Hand', 'Rare', 1, 'textures/icons/items/shield-icon.png', false));
        this.add_item(new Item('Chest', 'Armor', 'Rare', 1, 'textures/icons/items/armor-icon.png', false));
    }
    return_inventory() {
        return this.inventory;
    }
    get_info(itemIndex) {
        return String(this.get_item_OBJ(itemIndex).value + 'x ' + this.get_item_OBJ(itemIndex).name);
    }

}
class Player { //TO DO it singleton and to extends (to do)USER

    constructor(x, y, speed, inventory) {
        this.x = x; //X location of player /int
        this.y = y; //Y location of player /int
        this.speed = speed; //speed of player/int
        this.inventory = inventory; //Inventory of player /array of $items
    }
    move() {
        player(this.x);
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
            let tmp = new Missle(getRandomInt(790 + 5), 0, getRandomInt(4)+1, getRandomBoolean());
            this.missles.push(tmp);
        }
    }
    get allMissles() {
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
                if (this.missles[i].x < player1.x+40 && this.missles[i].x+40+1 <= 800) this.missles[i].x += 0.5;
                if (this.missles[i].x > player1.x+40 && this.missles[i].x+40-1 >= 0) this.missles[i].x -= 0.5;
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
}

var game1 = new Missles();
var inventory = new Inventory();
inventory.fill_inventory();
var player1 = new Player(playerX, playerY, playerSpeed, inventory);



function init() {
  //  console.log(player1.inventory.get_info());
    init_inventory();
    define_controlPanel();
    initialize_events_controlPanel();
  
  //get context playground ctx
   canvas = document.getElementById('Playground');
    ctx = canvas.getContext('2d');
  //position ctx
  /*canvas.style.position = 'relative';
  canvas.style.top = '0px';
    canvas.style.left = '200px';
    canvas.style.padding = '0px';
    canvas.style.padding = '0px';
  */
  //get context scoreboard ctxs
   canvasScr = document.getElementById('Scoreboard');
   ctxs = canvasScr.getContext('2d');
  
  //position ctxs
 /* canvasScr.style.position = 'relative';
  canvasScr.style.top = '2px';
    canvasScr.style.left = '200px';
    canvasScr.style.padding = '0px';
    canvasScr.style.margin = '0px';
    */
  
  //event listener on 'keydown'
canvas.addEventListener('keydown', handleKeyUp, false);
  
  //event listener on 'mouseenter'
canvas.addEventListener('mouseenter',setFocus,false);
 
  //event listener on 'mouseout'
    canvas.addEventListener('mouseout', blurFocus, false);

  //event listener on 'mousemove'
    canvasScr.addEventListener('mousemove', mouseMove, false);

  //event listener on 'mousedown'
    canvasScr.addEventListener('mousedown', mouseDown, false);

  //event listener on 'resize' JUNK

    //window.addEventListener('resize', event_Resize, false);
 

//start scoreboard  
    scoreboardUpdate();

}

function playNow() {
    //clear Playground
    if (!pause) {
        clearPlayground();
        if (!play) {
            console.log('cancelFire');
            cancelAnimationFrame(animationID);
            return 'Game Over';
        }

        //update missles cordinates
        game1.updateMissles();
        game1.fireMissles();

        //position the player
        player1.move();

        //check for hit
        if (hitCheck()) {
            cancelAnimationFrame(animationID);
            return 'Game Over';
        }

        scoreboardUpdate();
    }
    animationID = requestAnimationFrame(playNow);
}
function scoreboardUpdate() {
    //clear scoreboard
    ctxs.clearRect(0, 0, canvasScr.width, canvasScr.height);

    //define the background
  ctxs.fillStyle = "#256794";
    ctxs.fillRect(0, 0, canvasScr.width, canvasScr.height);

    //import number of missles
    missleCounter(10, 10);

    //import timer
    timer(300, 10);

    //import logo
    logo(680,10);
}




var PlayerSpeedSlider, PlayerSpeedOutput;
var MissleNumSlider, MissleNumOutput;
var StartStopButton, PauseResumeButton;
//defining control panel variables
function define_controlPanel() {

    //player speed objects definition
    PlayerSpeedSlider = document.querySelector('#playerSpeedSlider');
    PlayerSpeedOutput = document.querySelector('#playerSpeedOutput');

    //missle num objects definition
    MissleNumSlider = document.querySelector('#missleNumSlider');
    MissleNumOutput = document.querySelector('#missleNumOutput');

    //StartStop button definition
    StartStopButton = document.querySelector("#startStopButton");

    //PauseResume button definition
    PauseResumeButton = document.querySelector("#pauseResumeButton");
}



//initializing control panel events

function initialize_events_controlPanel() {
    event_playerSpeedSlider();
    event_missleNumSlider();

    event_startStopButton();
    event_pauseResumeButton();
}
//event listeners control panel

function event_playerSpeedSlider() {
    PlayerSpeedOutput.value = PlayerSpeedSlider.value;
    player1.speed = Number(PlayerSpeedSlider.value);
    PlayerSpeedSlider.oninput = function (evt) {    
        //visual update Player speed output
        PlayerSpeedOutput.value = evt.target.value;
      //  playerSpeedSlider.value = evt.target.value;
        //functional update Player speed
        player1.speed = Number(evt.target.value);
    }
}
function event_missleNumSlider() {
    MissleNumOutput.value = MissleNumSlider.value;
    missleNum = Number(MissleNumSlider.value);
    MissleNumSlider.oninput = function (evt) {
        //visual update Missle Num OUTPUT
        MissleNumOutput.value = evt.target.value;
        //visual update Missle Num output
      //  MissleNumSlider.value = evt.target.value;
        //functional update Missle Num
        missleNum = Number(Number(missleNumSlider.value));
    }
}

function event_startStopButton() {
    visualButtonUpdate();
        //event onclick StartStopButton
    StartStopButton.onclick = function (evt) {
        visualButtonUpdate();
        if (!play) { 
                //start animation playNow
            animationID = startGame();
         //   PauseResumeButton.disabled = false;
            visualButtonUpdate();
        } else { //stop
               //stop animation playNow
            stopGame(animationID);
            //  PauseResumeButton.disabled = true;
            visualButtonUpdate();
            
        }
    }
}

function event_pauseResumeButton() {
    visualButtonUpdate();
        //event PauseResumeButton onclick
    PauseResumeButton.onclick = function () {
        pause = !pause;
        if (!pause) { //game running
            startTime += Date.now() - pauseTime;
            pauseTime = null;
            visualButtonUpdate();
        } else { //game paused
            pauseTime = Date.now();
            visualButtonUpdate();
        }
    };
}







//event listeners canvas
function setFocus(){
  canvas.focus();
}
function blurFocus(){
  canvas.blur();
}
function handleKeyUp(e){
  if(e.keyCode == '39'){ //right arrow
      if (player1.x + player1.speed <= 720 ) player1.x += player1.speed;
      else player1.x = 720;
  } else if (e.keyCode == '37') { //left arrow
      if (player1.x - player1.speed >= 0) player1.x -= player1.speed;
      else player1.x = 0;
    }
}

//event listeners canvasScr
function mouseMove(e) {
    mousePosScr = getMousePos(canvasScr, e);
    console.log("x: " + mousePosScr.x + ' // y: ' + mousePosScr.y);
}
function mouseDown(e) {
    let button = e.button;
    console.log('Button: ' + button + ' pressed at x: ' + mousePosScr.x + ' y: ' + mousePosScr.y);
}

//get mouse position relative to the position of the canvas
function getMousePos(canv, e) {
    var rect = canv.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    }
}

// junk 
/* 
 *
function event_Resize() {
    let height = window.innerHeight;
    let width = window.innerWidth
    var divCanv = document.getElementById('divCanvas');


    reportSize();
}
function reportSize() {
    console.log('height: ' + window.innerHeight + ' width: ' + window.innerWidth);
}
*
 */