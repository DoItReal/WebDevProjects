//textures

var png_background;

function load_textures() {
    png_background = new Image();
    png_background.src = 'textures/content/terrain/floor/floor4.png';
}

function player(x,y) {
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
function enemy(x, y) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(0.5, 0.5);
    ctx.fillStyle = "red";
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
function init_background() {
    var tileWidth = 50;
    var tileHeight = 50;
    var angle = Math.PI; //Math.PI - straight, Math.PI/2 - 90 degr;
    for (i = 0; i < canvas.width + tileWidth; i += tileWidth) {
        for (j = 0; j < canvas.height + tileHeight; j += tileHeight) {
            backgroundTile(i, j,tileWidth,tileHeight, angle);
        }
    }
}
function backgroundTile(x, y, w, h,angle) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.drawImage(png_background, 0, 0,w,h);

    ctx.restore();  
}
function tower(x, y, w, h, radius, preview=false) {
    ctx.save();
    ctx.beginPath();
    if (preview) ctx.globalAlpha = 0.5;
    ctx.translate(x, y);
    ctx.fillStyle = "blue";
    ctx.fillRect(-(w/2), -h/2, 30, 30);
    ctx.fillStyle = "green";
    ctx.fillRect(-w/2+5, -h/2+5, 20, 20);
    ctx.fillStyle = "red";
    ctx.fillRect(-w/2+10, -h/2+10, 10, 10);
    ctx.strokeStyle = "black";
    ctx.arc(0, 0, radius, 0, 2 * Math.PI, false);
    ctx.stroke();

    ctx.restore();
}

function texture_timer(x, y) {
    ctxs.save();
    ctxs.beginPath();
    ctxs.translate(x, y);
    ctxs.strokeStyle = 'white';
    ctxs.lineWidth = 2;
    ctxs.rect(0, 0, 200, 60);
    ctxs.rect(5, 5, 190, 50);
    ctxs.stroke();
    ctxs.beginPath();

    let dist = setTimer();

    //minutes not working TO DO
    let minutes = Math.floor(((dist / 100000) % 60));
    let minutesStr = '';
    if (minutes > 10) {
        minutesStr = minutes;
    } else if (minutes == 0) {
        minutesStr = '00';
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
function texture_arrow(x,y,w,h) {
    ctx.save();
    ctx.beginPath();
    ctx.translate(x, y);
    let color = 'green';
    ctx.lineWidth = w;
    ctx.strokeStyle = color;
    ctx.moveTo(0, 0);
    ctx.lineTo(0, h);
    ctx.stroke();
    ctx.restore();
}
function enemyCounter(x, y) {
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
    ctxs.strokeText("Enemies: ", 50, 10);
    ctxs.fillText("Enemies:", 50, 10);

    ctxs.strokeStyle = 'yellow';
    ctxs.lineWidth = 4;
    ctxs.fillStyle = 'red';
    ctxs.textAlign = 'center';
    let enemies;
    if (game1) {
        enemies = game1.getEnemiesCount;
    }else  enemies = 0;
    ctxs.font = "25px Arial";
    ctxs.strokeText(enemies, 100, 50);
    ctxs.fillText(enemies, 100, 50);
    ctxs.restore();
}
