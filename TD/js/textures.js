//textures
//to be deleted
function tower(x, y, w, h, radius, preview = false) {
    let ctx = MainInterface.getPlayground().getContext();
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



