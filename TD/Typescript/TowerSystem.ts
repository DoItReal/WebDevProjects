interface tower {
    cord: cord;             //cord{x:number, y:number, w:number, h:number};
    dim: dim;               //dimensions width , height
    name: string;           //Name of the object
    experience: Experience;
    speed: number;          // hits/s 
    target: Enemy;         // Enemy();
    color: string;          //to implement interface
    range: number;          //range radius [px]
    ammunition(): Missle; //object Ammunition()
    atkCD: number;          // [frames] to next attack
    deployable: boolean;

}

class Tower implements tower{ //declares and implements the methods of all towers
    set: boolean;
    cord: cord;
    dim: dim;
    name: string;
    experience: Experience;
    speed: number;
    target: Enemy = null;
    color: string;
    range: number;
    atkCD: number = 0;
    deployable: boolean = true;
    ammunition;
    enemiesInterface: _Enemies = game1.getEnemiesInterface();
    sprite: TowerAnimation;
    assets;
    constructor(cord:cord) {
        if (this.constructor === Tower) {
            throw new Error("Abstract classes can't be instantiated.");
        }
        this.set = false;
        this.cord = cord;
        this.experience = new Experience(this.cord);
    }

    update() {

        this.sprite = new TowerAnimation(this, this.assets.get(String('lvl_' + this.experience.getLevel()))); // to rework it 
        this.draw(); // draw the texture of the tower
        this.experience.update(); // draw the exp bar
        if (!this.target || !this.collisionCheck(this.target) || this.target.hp <= 0) { // if No Target || target not reachable || target hp <= 0 ==> seek new target
            this.target = this.radar();
        }
        if (this.target != null) {
            this.attack();
        }else this.reload();
    }
    mouseClick() {
        console.log('draw Update table'); // to do
        let scr = MainInterface.getScoreboard();
        scr.setObject(this);
        // TO DO
    }
    mouseOver(mousePosR: cord) {
        this.highlight();
        if (MainInterface.MouseState.keys.get('leftButton') && this.set) {
            this.mouseClick();
        }
        else {
            this.tooltip(mousePosR);
        }
    }
    draw(preview = false, overlap = false) { 
        const ctx = MainInterface.getPlayground().getContext();
        ctx.save();
        ctx.beginPath();
        ctx.translate(this.cord.x-this.dim.w/2, this.cord.y-this.dim.h/2);
        if (preview) {
            if (overlap) {
                ctx.strokeStyle = "red";
            } else {
                ctx.strokeStyle = "green";
                
            }
            ctx.strokeRect(0, 0, this.dim.w + 4, this.dim.h + 4);
            ctx.arc(0+this.dim.w/2, 0+this.dim.h/2, this.range, 0, 2 * Math.PI, false);
            
            ctx.stroke();
        }
        ctx.restore();
        ctx.save();
        if (preview) {
            ctx.globalAlpha = 0.8;
            if (overlap) {
                ctx.globalAlpha = 0.3;
            }
        }
        this.sprite.update();       // draws the sprite
        this.ammunition.animate();  // draws the idle ammunition
        ctx.restore();
    }
    gainBounty(bounty: { exp: number, gold: number }) {
        this.experience.addExp(bounty.exp);
        game1.player.gainGold(bounty.gold);
    }
    private getLvL() {
        return this.experience.getLevel();
    }
    private collisionCheck(enemy: Enemy): boolean {
        return circRectsOverlap(enemy.cord.x, enemy.cord.y, enemy.dim.w, enemy.dim.h, this.cord.x, this.cord.y, this.range);
    }
    private radar(): Enemy {
        const enemies = this.enemiesInterface.getEnemies();
        for (let i = 0; i < enemies.length; i++) {
            if (this.collisionCheck(enemies[i]) && enemies[i].hp > 0) {
                return enemies[i];
            }
        }
    }
    private attack() {
        if (this.atkCD <= 0) {
            this.shoot();
            this.atkCD = this.speed;
        } else this.reload();
    }
    private shoot() {
        this.ammunition.setCord(structuredClone(this.cord));    // to be removed later
        this.ammunition.setTarget(this.target);                 //seting the target for the missle
        this.ammunition.fire();                                 //firing the missle 
        this.ammunition = this.getNewAmmo();                    // and reloading with new one
       
    }
    getNewAmmo() {
        // It have to be implemented in child class
    }
    private reload() {
        const fps = game1.fps.fps;
        if (this.atkCD > 0) this.atkCD -= 1 / fps;
        if (this.atkCD < 0) this.atkCD = 0;
    }
    private highlight() {
        const ctx = MainInterface.getPlayground().getContext();
        ctx.save();

        ctx.translate(this.cord.x, this.cord.y);
        ctx.strokeStyle = "green";
        ctx.strokeRect(-this.dim.w / 2 - 2, -this.dim.h / 2 - 2, this.dim.w + 4, this.dim.h + 4);

        ctx.restore();
    }
    private tooltip(mousePosR:cord) {

        const ctx = MainInterface.getPlayground().getContext();
        const canvas = MainInterface.getPlayground().getCanvas();
        const rect = canvas.getBoundingClientRect();
        const w = 180;
        const h = 50;
        ctx.save();
        if (mousePosR.x + w > rect.width) mousePosR.x = rect.width - w;
        if (mousePosR.y + h > rect.height) mousePosR.y = rect.height - h;
        ctx.translate(mousePosR.x, mousePosR.y);
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = "lightblue";
        ctx.strokeStyle = "white";
        ctx.fillRect(0, 0, w, h);
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.7;
        ctx.strokeRect(0, 0, w, h);
        ctx.globalAlpha = 1;
        ctx.fillStyle = "white";
        ctx.font = "20px Roboto";
        ctx.fillText(this.name + ' ' + this.experience.getLevel() + ' lvl', 10, 30);
        ctx.font = "16px Roboto";
        ctx.fillText(this.experience.getLevel() * this.ammunition.dmg + ' dmg/hit',10,45);

        ctx.restore();
    }
}

interface elementAnimation {
    URL: string;
}

class TowerAnimation {
    elements: Map<string, HTMLImageElement > = new Map();
    tower: Tower;  // to remove
    anim: { flag: boolean, value: number } = { flag: false, value: 0 }; // false => increment
    assets;
    constructor(tower: Tower, assets) {      
        this.tower = tower;
        this.assets = assets; // sprites
        this.load_assets();
    }
    load_assets() {
        this.assets.elements.forEach((value, key) => {
            const tmpImage = new Image();
            tmpImage.src = value.URL;
            this.elements.set(key, tmpImage );
        });
    }
    update() {
        this.animate();
    }
    draw(k: number) {
        const height = this.elements.get('tower').height;
        const heightFront = this.elements.get('front').height;
        const heightBehind = this.elements.get('behind').height;
        const ctx = MainInterface.getPlayground().getContext();
        ctx.save();
        ctx.translate(this.tower.cord.x - this.tower.dim.w / 2, this.tower.cord.y - this.tower.dim.h / 2);
        const kX = this.tower.dim.w / this.elements.get('tower').width;
        const kY = this.tower.dim.h / this.elements.get('tower').height;
        ctx.scale(kX,kY);
        //draw behind
        let element = this.elements.get('behind');
        ctx.drawImage(element, 0, k+((height - heightBehind) /2.8));
        //draw tower
        element = this.elements.get('tower');
        ctx.drawImage(element, 0, 0);
        //draw front
        element = this.elements.get('front');
        ctx.drawImage(element, 0,k+( (height - heightFront)/1.8));
        
        //draw ammo
        /*
        element = this.elements.get('ammo');
        if (this.tower.atkCD == 0) {
            ctx.drawImage(element, 55, this.anim.value + k + ((height - heightAmmo) / 3));
        } else {
            ctx.globalAlpha = 1-(this.tower.atkCD / this.tower.speed);
            ctx.drawImage(element, 55, this.anim.value + k + ((height - heightAmmo) / 3));
        }
        */
        ctx.restore();
        
    }
    private animate() {
        let k = this.tower.atkCD / this.tower.speed;
        if (k > 0) {
            k *= -50;  //position reloading
        } else {
            k += this.anim.value / 3; // position idle
        }
        if (this.anim.flag && this.anim.value < 5) {
            this.anim.value += 0.1;
        } else if (!this.anim.flag && this.anim.value > 0) {
            this.anim.value -= 0.1;
        } else {
            this.anim.flag = !this.anim.flag;
        }
        this.draw(k);
    }
}
class elements_IronTower {
     elements: Map<string, elementAnimation> = new Map();

    constructor() {
        this.elements.set("tower", {
            URL: "textures/content/towers/iron1_tower.png"
        });
        this.elements.set("front", {
            URL: "textures/content/towers/iron1_front.png"
        });
        this.elements.set("behind", {
            URL: "textures/content/towers/iron1_behind.png"
        });
    }
   
}
class elements_IronTower2 {
    elements: Map<string, elementAnimation> = new Map();

    constructor() {
        this.elements.set("tower", {
            URL: "textures/content/towers/iron2_tower.png"
        });
        this.elements.set("front", {
            URL: "textures/content/towers/iron1_front.png"
        });
        this.elements.set("behind", {
            URL: "textures/content/towers/iron1_behind.png"
        });
    }

}
class elements_IronTower3 {
    elements: Map<string, elementAnimation> = new Map();

    constructor() {
        this.elements.set("tower", {
            URL: "textures/content/towers/iron3_tower.png"
        });
        this.elements.set("front", {
            URL: "textures/content/towers/iron2_front.png"
        });
        this.elements.set("behind", {
            URL: "textures/content/towers/iron2_behind.png"
        });
    }

}

class tower_Iron extends Tower {
    assets = new Map();
    constructor(cord:cord) {
        super(cord);
        this.name = "Iron Tower";
        this.dim = { w: 80, h: 80 };
        this.speed = 1,5;
        this.target = null;
        this.color = null;
        this.range = 300;
        this.assets.set('lvl_1', new elements_IronTower); // to do 
        this.assets.set('lvl_2', new elements_IronTower2);
        this.assets.set('lvl_3', new elements_IronTower3); 
        this.sprite = new TowerAnimation(this, this.assets.get('lvl_1'));
        this.ammunition = this.getNewAmmo();
    }
    getNewAmmo(): Missle {
        return new amm_stone(structuredClone(this.cord), null, this);
    }
}
class _Towers {
    towers: Array<Tower>;
    constructor() {
    this.towers = [];
    }
    getTowers() {
        return this.towers;
    }
    addTower(tower: Tower): void {
        tower.set = true;
        this.towers.push(tower);
    }
    removeTower(ind: number | cord) {
        if (typeof ind === "number") {
            this.towers[ind].set = false;
            this.towers.splice(ind, 1);
        } else { // typeof ind === cord
            if (this.towers !== null && this.towers.length > 0) {
                for (let i = 0; i < this.towers.length; i++) {
                    if (this.towers[i].cord == ind) {
                        this.towers[i].set = false;
                        this.removeTower(i);
                        return;
                    }
                }
            }
        }
    }
    
    update() {
        if (this.towers !== null && this.towers.length > 0) {
            this.towers.forEach(e => e.update());
        }
    }
}