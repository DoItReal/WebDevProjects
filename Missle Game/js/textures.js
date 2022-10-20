//textures
function missle(x, y, homing) {
    ctx.save();
    ctx.beginPath();
    ctx.translate(x, y);
    let color = 'blue';
    if (homing) {
        color = 'red';
    }


    ctx.lineWidth = 5;
    ctx.strokeStyle = color;
    ctx.moveTo(0, 0);
    ctx.lineTo(0, 30);
    ctx.stroke();
    ctx.restore();
}
function player(x) {
    ctx.save();
    ctx.translate(x, playerY);

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

// 
function timer(x, y) {
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
function logo(x, y) {
    ctxs.save();
    ctxs.beginPath();
    ctxs.translate(x, y);
    ctxs.fillStyle = "cyan";
    ctxs.rect(0, 0, 120, 25);
    ctxs.fill();
    ctxs.beginPath();
    ctxs.font = "20px Helvetica bold italic";
    ctxs.fillStyle = "black";
    ctxs.fillText("Missle War", 15, 20)
    ctxs.fillStyle = "green";
    ctxs.fillRect(0, 25, 120, 40);
    ctxs.font = "25px Arial bold";
    ctxs.fillStyle = "black";
    ctxs.fillText("The Game!", 5, 55);
    ctxs.restore();
}
function missleCounter(x, y) {
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
