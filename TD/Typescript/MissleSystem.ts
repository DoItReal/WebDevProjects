/*      class Missle system
 *  Target: To respond for the _Missles() and control their life cycle
 *  _______________________________________________________________
 *  missles[Missle] - array of all missles
 *  
class MissleSystem {

}

*/
type status = "alive" | "death";
interface cord {
    x: number;
    y: number;
}
interface dim {
    w: number;
    h: number;
}
interface tAmmunition {
    cord: cord;
    dim: dim;
    name: string;
    dmg: number; // to be expanded to class
    speed: number;
    target: Enemy; //Enemy() Object
    status: status;
    color: string;
    draw: () => void;
    tower: Tower;
}


// Missle Interface includes all Missle methods 
class Missle implements tAmmunition{
    cord: cord;
    dim: dim;
    name: string;
    dmg: number;
    speed: number;
    target: Enemy;
    status: status;
    color: string;
    tower: Tower;
    static dmgDone: number = 0;
    constructor(tower:Tower) {
        if (this.constructor === Missle) {
            throw new Error("Abstract classes can't be instantiated.");
        }
        this.dim = { w: 0, h: 0 };
        this.tower = tower;
    }
    setTarget(target:Enemy) {
        this.target = target;
    }
    get getDmgDone(): number {
        return Missle.dmgDone;
    }
    addDmg(dmg:number): void {
        Missle.dmgDone += dmg;
    }
    update(): void {
        this.move(); //update cordinates and update/draw the texture
        if (this.collision_check()) {
            this.hit();
        }
    }
    move(): void {
        let fps = game1.fps.fps;
        if (this.cord.x < this.target.cord.x) this.cord.x += this.speed / fps;
        else if (this.cord.x > this.target.cord.x) this.cord.x -= this.speed / fps;

        if (this.cord.y < this.target.cord.y) this.cord.y += this.speed / fps;
        else if (this.cord.y > this.target.cord.y) this.cord.y -= this.speed / fps;

        this.draw();
    }
    collision_check(): boolean{
        return rectsOverlap(this.cord.x, this.cord.y, this.dim.w, this.dim.h, this.target.cord.x, this.target.cord.y, this.target.dim.w, this.target.dim.h);
}
    hit(): void { //increment Missle.dmgDone with dmg taken from the target// - destroys the missle
         this.addDmg(this.target.receiveDmg(this.dmg*this.tower.lvl,this.tower));
        this.destroy();
    }
    destroy(): void { //destroys the missle and draws destroy animation
        this.status = "death";
        this.destroy_texture();
    }
    draw(): void { //draws the texture of the Missle object
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
   
    destroy_texture(): void {
        this.draw(); // TO DO
    }
}

class amm_stone extends Missle implements tAmmunition{
    cord: cord;
    dim: dim;
    name : string;
    dmg : number;
    speed : number;
    target : Enemy;
    status: status;
    color: string;
    tower: Tower;
    constructor(cord: cord, target: Enemy, tower:Tower) {
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
    missles: Array<Missle>;
    static addMissle: (missle: Missle) => void;
    constructor() {
        this.missles = [];
    }
    addMissle(missle: Missle) {
        this.missles.push(missle);
    }
    update() {
        if (this.missles !== null && this.missles.length > 0) {
            for (let i = 0; i < this.missles.length; i++) {
                if (this.missles[i].status === "alive") this.missles[i].update();
                else {
                    this.removeMissle(i);
                    i -= 1;
                }
            }
        }
    }
    removeMissle(ind: number): void {
        this.missles.splice(ind, 1);
    }
    reportDmg(): void {
        console.log(Missle.dmgDone);
    }

}
