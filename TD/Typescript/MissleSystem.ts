/*      class Missle system
 *  Target: To respond for the _Missles() and control their life cycle
 *  _______________________________________________________________
 *  missles[Missle] - array of all missles
 *  
class MissleSystem {

}

*/
type status = "alive" | "death" | "idle" | "fired";
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
    setCord(cord: cord) {
        this.cord = cord;
    }
    get getDmgDone(): number {
        return Missle.dmgDone;
    }
    addDmg(dmg:number): void {
        Missle.dmgDone += dmg;
    }
    update(): void {

        if (this.status == 'fired') this.move(); //update cordinates and update/draw the texture when fired
        else if (this.status == 'idle') this.cord = structuredClone(this.tower.cord);
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

        this.animate();
    }
    animate() {
        // implemented in MissleSprite
    }
    collision_check(): boolean{
        return rectsOverlap(this.cord.x, this.cord.y, this.dim.w, this.dim.h, this.target.cord.x, this.target.cord.y, this.target.dim.w, this.target.dim.h);
    }
    fire() {
        this.status = "fired";                                    //seting status from 'idle' to 'fired'
        this.cord.y -= 50;
        game1.getMisslesInterface().addMissle(this); //Shooting the missle 
    }
    hit(): void { //increment Missle.dmgDone with dmg taken from the target// - destroys the missle
         this.addDmg(this.target.receiveDmg(this.dmg*this.tower.lvl,this.tower));
        this.destroy();
    }
    destroy(): void { //destroys the missle and draws destroy animation
        this.status = "death";
        this.destroy_texture();
    }
    draw() {
        // implemented in MissleSprite
    }
   
    destroy_texture(): void {
       // to be implemented in MissleSprite
    }
}
class MissleSprite extends Missle {
    elements: Map<string, HTMLImageElement>;
    missleAnimate: { flag: boolean, value: number } = { flag: false, value: 0 }; //flag: false => increment 
    constructor(tower:Tower) {
        super(tower);
    }
    draw(k:number = 0) {
        let ctx = MainInterface.getPlayground().getContext();
        ctx.save();
        ctx.beginPath();
        let kX = this.elements.get('ammo').width / this.tower.dim.w;
        let kY =  this.elements.get('ammo').height/ this.tower.dim.h;
        
        if (this.status == 'idle') {
            this.cord = {
                x: this.tower.cord.x - this.dim.w/2 , y: k+  this.tower.cord.y - this.tower.dim.h / 4
            };
        }
            ctx.translate(this.cord.x, this.cord.y);
        ctx.scale(kX, kY);
        if (this.status === 'idle') {
            if (this.tower.atkCD == 0) {
                ctx.drawImage(this.elements.get('ammo'), 0, 0);
            } else {
                ctx.globalAlpha = 1 - (this.tower.atkCD / this.tower.speed);
                ctx.drawImage(this.elements.get('ammo'), 0, 0);
            }
        } else {
            ctx.drawImage(this.elements.get('ammo'), 0, 0);
        }

        ctx.restore();
        console.log(k);

    }
    animate() {
        console.log(this.status);
        if (this.status === 'idle') {
            let k = this.tower.atkCD / this.tower.speed;
            if (k > 0) {
                k *= -30;  //position reloading
            } else {
                k += this.missleAnimate.value / 3; // position idle
            }
            if (this.missleAnimate.flag && this.missleAnimate.value < 5) {
                this.missleAnimate.value += 0.1;
            } else if (!this.missleAnimate.flag && this.missleAnimate.value > 0) {
                this.missleAnimate.value -= 0.1;
            } else {
                this.missleAnimate.flag = !this.missleAnimate.flag;
            }
            this.draw(k);

        } else this.draw();

    }
}
class amm_stone extends MissleSprite{
    elements: Map<string, HTMLImageElement> = new Map();
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
        this.dim.w = 25;
        this.dim.h = 25;
        this.name = "Stone";
        this.dmg = 2;
        this.speed = 150;
        this.target = target; //asigning target for seeking
        this.status = "idle";
        this.color = "lightgray";
        this.load_assets();
    }
   
    load_assets() {
        var tmp = new ammo_Iron_sprite(); //here to place input
        tmp.elements.forEach((value, key) => {
            let tmpImage = new Image();
            tmpImage.src = value.URL;
            this.elements.set(key, tmpImage);
        });
    }
}
class ammo_Iron_sprite {
    elements: Map<string, elementAnimation> = new Map();
    constructor() {
        this.elements.set("ammo", {
            URL: "textures/content/towers/iron_1.png"
        });
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
                if (this.missles[i].status != "death" ) this.missles[i].update();
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
