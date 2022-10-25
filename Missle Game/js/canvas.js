function init_canvas() {
    //get context playground ctx
    canvas = document.getElementById('Playground');
    ctx = canvas.getContext('2d');

    //get context scoreboard ctxs
    canvasScr = document.getElementById('Scoreboard');
    ctxs = canvasScr.getContext('2d');

    //start scoreboard
    scoreboardUpdate();
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
    texture_timer(300, 10);
    //import logo
    logo(680, 10);
}
