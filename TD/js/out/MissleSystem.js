// Missle Interface includes all Missle methods 
class Missle {
    constructor(tower) {
        if (this.constructor === Missle) {
            throw new Error("Abstract classes can't be instantiated.");
        }
        this.dim = { w: 0, h: 0 };
        this.tower = tower;
    }
    setTarget(target) {
        this.target = target;
    }
    get getDmgDone() {
        return Missle.dmgDone;
    }
    addDmg(dmg) {
        Missle.dmgDone += dmg;
    }
    update() {
        this.move(); //update cordinates and update/draw the texture
        if (this.collision_check()) {
            this.hit();
        }
    }
    move() {
        let fps = game1.fps.fps;
        if (this.cord.x < this.target.cord.x)
            this.cord.x += this.speed / fps;
        else if (this.cord.x > this.target.cord.x)
            this.cord.x -= this.speed / fps;
        if (this.cord.y < this.target.cord.y)
            this.cord.y += this.speed / fps;
        else if (this.cord.y > this.target.cord.y)
            this.cord.y -= this.speed / fps;
        this.draw();
    }
    collision_check() {
        return rectsOverlap(this.cord.x, this.cord.y, this.dim.w, this.dim.h, this.target.cord.x, this.target.cord.y, this.target.dim.w, this.target.dim.h);
    }
    hit() {
        this.addDmg(this.target.receiveDmg(this.dmg * this.tower.lvl, this.tower));
        this.destroy();
    }
    destroy() {
        this.status = "death";
        this.destroy_texture();
    }
    draw() {
        let ctx = MainInterface.getPlayground().getContext();
        ctx.save();
        ctx.beginPath();
        ctx.translate(this.cord.x, this.cord.y);
        ctx.lineWidth = this.dim.w;
        ctx.strokeStyle = this.color;
        ctx.moveTo(0, 0);
        ctx.lineTo(0, this.dim.h);
        ctx.stroke();
        ctx.restore();
    }
    destroy_texture() {
        this.draw(); // TO DO
    }
}
Missle.dmgDone = 0;
class amm_stone extends Missle {
    constructor(cord, target, tower) {
        super(tower);
        this.cord = cord; //asigning starting cordinates at creation
        this.dim.w = 5;
        this.dim.h = 5;
        this.name = "Stone";
        this.dmg = 2;
        this.speed = 80;
        this.target = target; //asigning target for seeking
        this.status = "alive";
        this.color = "lightgray";
    }
}
// _Missles Interface - includes all active missles and responds for their operations 
class _Missles {
    constructor() {
        this.missles = [];
    }
    addMissle(missle) {
        this.missles.push(missle);
    }
    update() {
        if (this.missles !== null && this.missles.length > 0) {
            for (let i = 0; i < this.missles.length; i++) {
                if (this.missles[i].status === "alive")
                    this.missles[i].update();
                else {
                    this.removeMissle(i);
                    i -= 1;
                }
            }
        }
    }
    removeMissle(ind) {
        this.missles.splice(ind, 1);
    }
    reportDmg() {
        console.log(Missle.dmgDone);
    }
}
//# sourceMappingURL=MissleSystem.js.map