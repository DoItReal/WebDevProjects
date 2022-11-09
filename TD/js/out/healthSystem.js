class HealthBar {
    constructor() {
        this.greenBar = new Image();
        this.redBar = new Image();
        this.emptyBar = new Image();
        this.greenBar.src = "textures/content/health_bar/health_bar-05.png";
        this.redBar.src = "textures/content/health_bar/health_bar-04.png";
        this.emptyBar.src = "textures/content/health_bar/health_bar-02.png";
        this.dim = { w: 200, h: 40 };
    }
}
class HealthBarUnit extends HealthBar {
    constructor(obj) {
        super();
        this.obj = obj;
        this.cord = { x: obj.cord.x, y: obj.cord.y };
        this.dim = { w: obj.scale * this.dim.w, h: obj.scale * this.dim.h };
    }
    draw() {
        let ctx = MainInterface.getPlayground().getContext();
        ctx.save();
        //  ctx.drawImage(this.emptyBar, 0, 0);
        let hpFactor = this.obj.hp / this.obj.maxHP;
        ctx.translate(this.obj.cord.x - this.dim.w / 2, this.obj.cord.y - (this.dim.h * 2 + this.obj.dim.h * this.obj.scale));
        if (this.obj.hp == this.obj.maxHP) {
            ctx.drawImage(this.greenBar, //image to draw
            0, 0, //x,y cordinates of the image to draw
            this.greenBar.width, this.greenBar.height, //w,h of the image to draw
            0, 0, //x,y location on canvas to draw
            this.dim.w * hpFactor, this.dim.h); //w,h dimensions to draw  
        }
        else {
            ctx.drawImage(this.redBar, //image to draw
            0, 0, //x,y cordinates of the image to draw
            this.redBar.width, this.redBar.height, //w,h of the image to draw
            0, 0, //x,y location on canvas to draw
            this.dim.w * hpFactor, this.dim.h); //w,h dimensions to draw  
            ctx.fillStyle = "black";
            ;
            ctx.globalAlpha = 0.4;
            ctx.fillRect(this.dim.w * hpFactor, 0, this.dim.w * (1 - hpFactor), this.dim.h);
        }
        if (this.obj.hp <= 0) {
            ctx.font = "14px Roboto";
            ctx.fillText("DEAD", this.dim.w / 4, this.dim.h - 2);
        }
        /*  TO FIX IT!! Problem with the png file ... maybe
                ctx.drawImage(this.emptyBar,                    //image to draw
                    0, 0,                                       //x, y cordinates of the image to draw
                    921, 299,                                   // w, h of the image to draw
                    this.dim.w * hpFactor, 0,                   //x, y location on canvas to draw
                    this.dim.w * (1 - hpFactor), this.dim.h);   //w, h dimensions to draw
                */
        ctx.restore();
    }
}
//# sourceMappingURL=healthSystem.js.map