var missleId = null;
var playerX = 350, playerY = 520, playerSpeed = 10;
var play = 1;
var startTime = null;
var missleNum = 2;
var mousePosScr;


//To do class for missles and storing it in array
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
    
    newMissle(num) {
        for (let i = 0; i < num; i++) {
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
    updateMissles() {
        for (let i = 0; i < this.numberOfMissles; i++) {
            if (this.missles[i].y == 0 || this.missles[i].y >= 600) {
                this.missles[i].x = getRandomInt(790 + 5);
                this.missles[i].y = 0;
            }
            this.missles[i].y += this.missles[i].speed;
            if (this.missles[i].homing) {
                if (this.missles[i].x < playerX+40 && this.missles[i].x+40+1 <= 800) this.missles[i].x += 0.5;
                if (this.missles[i].x > playerX+40 && this.missles[i].x+40-1 >= 0) this.missles[i].x -= 0.5;
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
game1.newMissle(missleNum);



function init() {
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
 
//start animation playNow
    missleId = requestAnimationFrame(playNow);

//start scoreboard  
    scoreboardUpdate();
    
}





function playNow() {
    //clear Playground
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!play) {
        console.log('cancelFire');
        cancelAnimationFrame(missleId);
        return 'Game Over';
    }

    //update missles cordinates
    game1.updateMissles();
    game1.fireMissles();

    //position the player
    player(playerX);

    //check for hit
    if (hitCheck()) {
        cancelAnimationFrame(missleId);
        return 'Game Over';
    }

    scoreboardUpdate();

    missleId = requestAnimationFrame(playNow);
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


//textures
function missle(x,y, homing){
  ctx.save();
  ctx.beginPath();
  ctx.translate(x, y);
    let color = 'blue';
    if (homing) {
        color = 'red';
    }

    
  ctx.lineWidth = 5;
  ctx.strokeStyle=color;
  ctx.moveTo(0,0);
  ctx.lineTo(0,30);
  ctx.stroke();
  ctx.restore();
}
function player(x){
    ctx.save();
    ctx.translate(x, playerY);

  ctx.fillStyle = "green";
  ctx.fillRect(0,0,80,80);
  ctx.fillStyle = "white";
  ctx.fillRect(15,20,20,20);
  ctx.fillRect(50,20,20,20);
  ctx.fillStyle = "blue";
  ctx.fillRect(19,24,12,12);
  ctx.fillRect(54,24,12,12);
  ctx.fillStyle = "black";
  ctx.fillRect(22,27,6,6);
  ctx.fillRect(57,27,6,6);
  
  ctx.restore();
}

// 
function timer(x,y){
  ctxs.save();
  ctxs.beginPath();
  ctxs.translate(x,y);
  ctxs.strokeStyle = 'white';
  ctxs.lineWidth = 2;
  ctxs.rect(0,0,200,60);
  ctxs.rect(5,5,190,50);
    ctxs.stroke();
    ctxs.beginPath();
   
    let dist = setTimer();

    //minutes not working TO DO
    let minutes = Math.floor(((dist / 100000) % 60));
    let minutesStr = '';
    if (minutes > 10) {
        minutesStr = minutes;
    }    else if (minutes == 0) {
        minutesStr = '00' ;
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

    ctxs.lineWidth = 1;
    ctxs.strokeStyle = "red";
    ctxs.fillStyle = "lime";
    //fill minutes + ':'
    ctxs.font = "35px Arial";
    ctxs.fillText(minutesStr + ':', 40, 40);
    ctxs.strokeText(minutesStr + ':', 40, 40);
    

    //fill seconds
    ctxs.font = "30px Arial";
    ctxs.fillText(secondsStr + ':', 90, 40);
    ctxs.strokeText(secondsStr + ':', 90, 40);

    //fill millisceonds
    ctxs.font = "25px Arial";
    ctxs.fillText(millisecondsStr, 135, 40);
    ctxs.strokeText(millisecondsStr, 135, 40);

  ctxs.restore();
}
function logo(x,y){
  ctxs.save();
  ctxs.beginPath();
  ctxs.translate(x,y);
  ctxs.fillStyle ="cyan";
  ctxs.rect(0,0,120,25);
  ctxs.fill();
  ctxs.beginPath();
  ctxs.font = "20px Helvetica bold italic";
  ctxs.fillStyle = "black";
  ctxs.fillText("Missle War",15,20)
  ctxs.fillStyle = "green";
  ctxs.fillRect(0,25,120,40);
  ctxs.font = "25px Arial bold";
  ctxs.fillStyle = "black";
  ctxs.fillText("The Game!",5,55);
  ctxs.restore();
}
function missleCounter(x,y) {
    ctxs.save();
    ctxs.beginPath();
    ctxs.translate(x, y);
    ctxs.strokeStyle = "white";
    ctxs.lineWidth = 1;
    ctxs.rect(0, 15, 200, 50);
    ctxs.rect(5, 20, 190, 40);
    ctxs.stroke();
    ctxs.beginPath();

    ctxs.strokeStyle = 'gray';
    ctxs.lineWidth = 4;
    ctxs.fillStyle = "white";
    ctxs.font = "25px Monaco";
    ctxs.strokeText("Missles: ", 50, 10);
    ctxs.fillText("Missles:", 50, 10);

    ctxs.strokeStyle = 'yellow';
    ctxs.lineWidth = 4;
    ctxs.fillStyle = 'red';
    ctxs.textAlign = 'center';
    let missles = '';
    missles = missleNum;
    ctxs.font = "25px Arial";
    ctxs.strokeText(missles, 100, 50);
    ctxs.fillText(missles, 100, 50);
    ctxs.restore();
}

//event listeners canvas
function setFocus(){
  canvas.focus();
}
function blurFocus(){
  canvas.blur();
}
function handleKeyUp(e){
  if(e.keyCode == '39'){
    if(playerX < 720)
     playerX += playerSpeed;
     }else if(e.keyCode == '37'){
       if(playerX > 0) playerX -= playerSpeed;
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

//tools
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
function getRandomBoolean() {
    return Math.random() < 0.5;
}
function reset() {
    console.log('reset');
     playerX = 350, playerY = 520, playerSpeed = 10;
     play = 1;
    startTime = null;
    game1.clearMissles();
    missleNum += 1;
    game1.newMissle(missleNum);
    missleId = requestAnimationFrame(playNow);

    //dont know why but it doesnt work without this line ...
    missleId = requestAnimationFrame(playNow);

    

}
function hitCheck() {
    let tmpMissles = game1.allMissles;
    for (let i = 0; i < tmpMissles.length; i++) {
        if (tmpMissles[i].y >= 490) {
            if (tmpMissles[i].x >= playerX && tmpMissles[i].x <= playerX + 80) {
                alert('GameOver');
                play = 0;
                reset();                
                return 1;
                
            }
        }
    }
    return 0;
}
function setTimer() {
    if (startTime == null) {
        startTime = Date.now();
    } else {
        return (Date.now() - startTime);
    }
    return (Date.now() - startTime);
}
function timerReset() {
    startTime = null;
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