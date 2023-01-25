// Missle Interface includes all Missle methods 
class Missle {
    constructor(tower) {
        this.destructionCD = { cd: 25, begin: null }; //cd: [ms] , begin: Date.now() - initiating destruction
        if (this.constructor === Missle) {
            throw new Error("Abstract classes can't be instantiated.");
        }
        this.dim = { w: 0, h: 0 };
        this.tower = tower;
    }
    setTarget(target) {
        this.target = target;
    }
    setCord(cord) {
        this.cord = cord;
    }
    get getDmgDone() {
        return Missle.dmgDone;
    }
    addDmg(dmg) {
        Missle.dmgDone += dmg;
    }
    update() {
        if (this.status == 'fired')
            this.move(); //update cordinates and update/draw the texture when fired
        else if (this.status == 'idle')
            this.cord = structuredClone(this.tower.cord);
        if (this.collision_check()) {
            this.hit();
        }
    }
    move() {
        if (this.status == 'fired') {
            const fps = game1.fps.fps;
            if (this.cord.x < this.target.cord.x) {
                if (this.cord.x + (this.speed / fps) > this.target.cord.x)
                    this.cord.x = this.target.cord.x;
                else
                    this.cord.x += this.speed / fps;
            }
            else if (this.cord.x > this.target.cord.x) {
                if (this.cord.x - (this.speed / fps) < this.target.cord.x)
                    this.cord.x = this.target.cord.x;
                else
                    this.cord.x -= this.speed / fps;
            }
            if (this.cord.y < this.target.cord.y) {
                if (this.cord.y + (this.speed / fps) > this.target.cord.y)
                    this.cord.y = this.target.cord.y;
                else
                    this.cord.y += this.speed / fps;
            }
            else if (this.cord.y > this.target.cord.y) {
                if (this.cord.y - (this.speed / fps) < this.target.cord.y)
                    this.cord.y = this.target.cord.y;
                else
                    this.cord.y -= this.speed / fps;
            }
        }
        this.animate();
    }
    animate() {
        // implemented in MissleSprite
    }
    collision_check() {
        return rectsOverlap(this.cord.x, this.cord.y, this.dim.w, this.dim.h, this.target.cord.x, this.target.cord.y, this.target.dim.w, this.target.dim.h);
    }
    fire() {
        if (this.status == 'idle') {
            this.status = "fired"; //seting status from 'idle' to 'fired'
            this.cord.y -= 50;
            game1.getMisslesInterface().addMissle(this); //Shooting the missle 
        }
    }
    hit() {
        this.addDmg(this.target.receiveDmg(this.dmg * this.tower.experience.getLevel(), this.tower));
        this.destroy();
    }
    destroy() {
        this.status = "destroyed";
        this.destroy_texture();
    }
    draw() {
        // implemented in MissleSprite
    }
    destroy_texture() {
        // to be implemented in MissleSprite
    }
}
Missle.dmgDone = 0;
class MissleSprite extends Missle {
    constructor(tower) {
        super(tower);
        this.missleAnimate = { flag: false, value: 0 }; //flag: false => increment 
    }
    draw(k = 0) {
        const ctx = MainInterface.getPlayground().getContext();
        ctx.save();
        ctx.beginPath();
        const kX = this.elements.get('ammo').width / this.tower.dim.w;
        const kY = this.elements.get('ammo').height / this.tower.dim.h;
        if (this.status == 'idle') {
            this.cord = {
                x: this.tower.cord.x - this.dim.w / 2, y: k + this.tower.cord.y - this.tower.dim.h / 4
            };
        }
        ctx.translate(this.cord.x, this.cord.y);
        ctx.scale(kX, kY);
        if (this.status === 'idle') {
            if (this.tower.atkCD == 0) { //ready to fire 
                ctx.drawImage(this.elements.get('ammo'), 0, 0);
            }
            else {
                ctx.globalAlpha = 1 - (this.tower.atkCD / this.tower.speed); //reloading
                ctx.drawImage(this.elements.get('ammo'), 0, 0);
            }
        }
        else {
            ctx.drawImage(this.elements.get('ammo'), 0, 0);
        }
        ctx.restore();
    }
    animate() {
        if (this.status === 'idle') {
            let k = this.tower.atkCD / this.tower.speed;
            if (k > 0) {
                k *= -30; //position reloading
            }
            else {
                k += this.missleAnimate.value / 3; // position idle
            }
            if (this.missleAnimate.flag && this.missleAnimate.value < 5) {
                this.missleAnimate.value += 0.1;
            }
            else if (!this.missleAnimate.flag && this.missleAnimate.value > 0) {
                this.missleAnimate.value -= 0.1;
            }
            else {
                this.missleAnimate.flag = !this.missleAnimate.flag;
            }
            this.draw(k);
        }
        else
            this.draw();
    }
    destroy_texture() {
        const kX = this.elements.get('ammo').width / this.tower.dim.w;
        game1.getMisslesInterface().addAnimation(this.elements.get('ammo1'), kX, { x: this.cord.x, y: this.cord.y }, this.destructionCD.cd, null);
        game1.getMisslesInterface().addAnimation(this.elements.get('ammo2'), kX, { x: this.cord.x, y: this.cord.y }, this.destructionCD.cd, null);
        game1.getMisslesInterface().addAnimation(this.elements.get('ammo3'), kX, { x: this.cord.x, y: this.cord.y }, this.destructionCD.cd, null);
        game1.getMisslesInterface().addAnimation(this.elements.get('ammo4'), kX, { x: this.cord.x, y: this.cord.y }, this.destructionCD.cd, null);
        /*
        if (this.destructionCD.begin == null) this.destructionCD.begin = Date.now();
        let ctx = MainInterface.getPlayground().getContext();
        ctx.save();
        ctx.beginPath();
        let kX = this.elements.get('ammo').width / this.tower.dim.w;
        let kY = this.elements.get('ammo').height / this.tower.dim.h;
        ctx.scale(kX, kY);
        ctx.translate(this.cord.x, this.cord.y);
        while (Date.now() - this.destructionCD.begin < this.destructionCD.cd) {
            console.log
        }
        if ((Date.now() - this.destructionCD.begin) < 0.25 * this.destructionCD.cd) {
            ctx.drawImage(this.elements.get('ammo1'), 0, 0);
            console.log(Date.now() - this.destructionCD.begin);
        }
        else if ((Date.now() - this.destructionCD.begin) < 0.50 * this.destructionCD.cd) {
            ctx.drawImage(this.elements.get('ammo2'), 0, 0);
            console.log(2);
        }
        else if ((Date.now() - this.destructionCD.begin) < 0.75 * this.destructionCD.cd) {
            ctx.drawImage(this.elements.get('ammo3'), 0, 0);
        }
        else if ((Date.now() - this.destructionCD.begin) < this.destructionCD.cd) {
            ctx.drawImage(this.elements.get('ammo4'), 0, 0);
        }
        ctx.restore();
        */
    }
}
class amm_stone extends MissleSprite {
    constructor(cord, target, tower) {
        super(tower);
        this.elements = new Map();
        this.cord = cord; //asigning starting cordinates at creation
        this.dim.w = 25;
        this.dim.h = 25;
        this.name = "Stone";
        this.dmg = 2;
        this.speed = 150;
        this.target = target; //asigning target for seeking
        this.status = "idle";
        this.load_assets();
    }
    load_assets() {
        const tmp = new ammo_Iron_sprite(); //here to place input
        tmp.elements.forEach((value, key) => {
            const tmpImage = new Image();
            tmpImage.src = value.URL;
            this.elements.set(key, tmpImage);
        });
    }
}
class ammo_Iron_sprite {
    constructor() {
        this.elements = new Map();
        this.elements.set("ammo", {
            URL: "textures/content/towers/iron_1.png"
        });
        this.elements.set("ammo1", {
            URL: "textures/content/towers/iron_2.png"
        });
        this.elements.set("ammo2", {
            URL: "textures/content/towers/iron_3.png"
        });
        this.elements.set("ammo3", {
            URL: "textures/content/towers/iron_4.png"
        });
        this.elements.set("ammo4", {
            URL: "textures/content/towers/iron_5.png"
        });
    }
}
// _Missles Interface - includes all active missles and responds for their operations 
class _Missles {
    constructor() {
        this.animations = [];
        this.missles = [];
    }
    addMissle(missle) {
        this.missles.push(missle);
    }
    addAnimation(element, scale, cord, time, begin = null) {
        this.animations.push({ img: element, scale: scale, cord: cord, time: time, begin: begin });
    }
    update() {
        if (this.missles !== null && this.missles.length > 0) {
            for (let i = 0; i < this.missles.length; i++) {
                if (this.missles[i].status == "destroyed") {
                    this.removeMissle(i);
                    i -= 1;
                }
                else if (this.missles[i].target.status == 'dead') {
                    this.missles[i].destroy();
                    this.removeMissle(i);
                    i -= 1;
                }
                else {
                    this.missles[i].update();
                }
            }
        }
        if (this.animations !== null && this.animations.length > 0) {
            this.anim();
        }
    }
    anim() {
        if (this.animations[0].begin == null)
            this.animations[0].begin = Date.now();
        if (Date.now() - this.animations[0].begin < this.animations[0].time) {
            const ctx = MainInterface.getPlayground().getContext(); //draw
            ctx.save();
            ctx.translate(this.animations[0].cord.x, this.animations[0].cord.y);
            ctx.scale(this.animations[0].scale, this.animations[0].scale);
            ctx.drawImage(this.animations[0].img, 0, 0);
            ctx.restore();
        }
        else {
            this.animations.splice(0, 1);
            if (this.animations !== null && this.animations.length > 0)
                this.anim();
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