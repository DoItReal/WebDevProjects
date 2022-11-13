class Tower {
    constructor(cord) {
        this.lvl = 1;
        this.exp = 0;
        this.target = null;
        this.atkCD = 0;
        this.enemiesInterface = game1.getEnemiesInterface();
        if (this.constructor === Tower) {
            throw new Error("Abstract classes can't be instantiated.");
        }
        this.set = false;
        this.cord = cord;
    }
    update() {
        this.draw(); // draw the texture of the tower
        if (!this.target || !this.collisionCheck(this.target) || this.target.hp <= 0) {
            this.target = this.radar();
        }
        if (this.target != null) {
            this.attack();
        }
        else
            this.reload();
    }
    mouseClick(e) {
        // TO DO
    }
    mouseOver(mousePosR) {
        this.highlight();
        this.tooltip(mousePosR);
    }
    draw(preview = false) {
        let ctx = MainInterface.getPlayground().getContext();
        ctx.save();
        ctx.beginPath();
        ctx.translate(this.cord.x - this.dim.w / 2, this.cord.y - this.dim.h / 2);
        if (preview) {
            ctx.globalAlpha = 0.5;
            ctx.strokeStyle = "green";
            ctx.strokeRect(0, 0, this.dim.w + 4, this.dim.h + 4);
            ctx.arc(0 + this.dim.w / 2, 0 + this.dim.h / 2, this.range, 0, 2 * Math.PI, false);
            ctx.stroke();
        }
        ctx.restore();
        this.sprite.update();
        this.ammunition.animate();
    }
    gainBounty(bounty) {
        this.gainExp(bounty.exp);
        game1.player.gainGold(bounty.gold);
    }
    gainExp(value) {
        let toNextLVL = 9 + Math.pow(this.lvl, 3);
        if (this.exp + value > toNextLVL) {
            value -= toNextLVL - this.exp;
            this.levelUP();
            this.gainExp(value);
        }
        else {
            this.exp += value;
        }
    }
    levelUP() {
        this.exp = 0;
        this.lvl += 1;
    }
    getLvL() {
        return this.lvl;
    }
    collisionCheck(enemy) {
        return circRectsOverlap(enemy.cord.x, enemy.cord.y, enemy.dim.w, enemy.dim.h, this.cord.x, this.cord.y, this.range);
    }
    radar() {
        let enemies = this.enemiesInterface.getEnemies();
        for (let i = 0; i < enemies.length; i++) {
            if (this.collisionCheck(enemies[i]) && enemies[i].hp > 0) {
                return enemies[i];
            }
        }
    }
    attack() {
        if (this.atkCD <= 0) {
            this.shoot();
            this.atkCD = this.speed;
        }
        else
            this.reload();
    }
    shoot() {
        this.ammunition.setCord(structuredClone(this.cord)); // to be removed later
        this.ammunition.setTarget(this.target); //seting the target for the missle
        this.ammunition.fire(); //firing the missle 
        this.ammunition = this.getNewAmmo(); // and reloading with new one
    }
    getNewAmmo() {
        // It have to be implemented in child class
    }
    reload() {
        let fps = game1.fps.fps;
        if (this.atkCD > 0)
            this.atkCD -= 1 / fps;
        if (this.atkCD < 0)
            this.atkCD = 0;
    }
    highlight() {
        let ctx = MainInterface.getPlayground().getContext();
        ctx.save();
        ctx.translate(this.cord.x, this.cord.y);
        ctx.strokeStyle = "green";
        ctx.strokeRect(-this.dim.w / 2 - 2, -this.dim.h / 2 - 2, this.dim.w + 4, this.dim.h + 4);
        ctx.restore();
    }
    tooltip(mousePosR) {
        let ctx = MainInterface.getPlayground().getContext();
        let canvas = MainInterface.getPlayground().getCanvas();
        let rect = canvas.getBoundingClientRect();
        let w = 180;
        let h = 50;
        ctx.save();
        if (mousePosR.x + w > rect.width)
            mousePosR.x = rect.width - w;
        if (mousePosR.y + h > rect.height)
            mousePosR.y = rect.height - h;
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
        ctx.fillText(this.name + ' ' + this.lvl + ' lvl', 10, 30);
        ctx.font = "16px Roboto";
        ctx.fillText(this.lvl * this.ammunition.dmg + ' dmg/hit', 10, 45);
        ctx.restore();
    }
}
class TowerAnimation {
    constructor(tower) {
        this.elements = new Map();
        this.anim = { flag: false, value: 0 }; // false => increment
        this.load_assets();
        this.tower = tower;
    }
    load_assets() {
        var tmp = new elements_IronTower(); //here to place input
        tmp.elements.forEach((value, key) => {
            let tmpImage = new Image();
            tmpImage.src = value.URL;
            this.elements.set(key, tmpImage);
        });
    }
    update() {
        this.animate();
    }
    draw(k) {
        let height = this.elements.get('tower').height;
        let heightFront = this.elements.get('front').height;
        let heightBehind = this.elements.get('behind').height;
        let heightAmmo = this.elements.get('ammo').height;
        let ctx = MainInterface.getPlayground().getContext();
        ctx.save();
        ctx.translate(this.tower.cord.x - this.tower.dim.w / 2, this.tower.cord.y - this.tower.dim.h / 2);
        let kX = this.tower.dim.w / this.elements.get('tower').width;
        let kY = this.tower.dim.h / this.elements.get('tower').height;
        ctx.scale(kX, kY);
        //draw behind
        let element = this.elements.get('behind');
        ctx.drawImage(element, 0, k + ((height - heightBehind) / 2.8));
        //draw tower
        element = this.elements.get('tower');
        ctx.drawImage(element, 0, 0);
        //draw front
        element = this.elements.get('front');
        ctx.drawImage(element, 0, k + ((height - heightFront) / 1.8));
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
    animate() {
        let k = this.tower.atkCD / this.tower.speed;
        if (k > 0) {
            k *= -50; //position reloading
        }
        else {
            k += this.anim.value / 3; // position idle
        }
        if (this.anim.flag && this.anim.value < 5) {
            this.anim.value += 0.1;
        }
        else if (!this.anim.flag && this.anim.value > 0) {
            this.anim.value -= 0.1;
        }
        else {
            this.anim.flag = !this.anim.flag;
        }
        this.draw(k);
    }
}
class elements_IronTower {
    constructor() {
        this.elements = new Map();
        this.elements.set("tower", {
            URL: "textures/content/towers/iron1_tower.png"
        });
        this.elements.set("front", {
            URL: "textures/content/towers/iron1_front.png"
        });
        this.elements.set("behind", {
            URL: "textures/content/towers/iron1_behind.png"
        });
        this.elements.set("ammo", {
            URL: "textures/content/towers/iron_1.png"
        });
    }
}
class tower_Slinger extends Tower {
    constructor(cord) {
        super(cord);
        this.name = "Slinger Tower";
        this.dim = { w: 80, h: 80 };
        this.speed = 1, 5;
        this.target = null;
        this.color = null;
        this.range = 300;
        this.sprite = new TowerAnimation(this);
        this.ammunition = this.getNewAmmo();
    }
    getNewAmmo() {
        return new amm_stone(structuredClone(this.cord), null, this);
    }
}
class _Towers {
    constructor() {
        this.towers = [];
    }
    getTowers() {
        return this.towers;
    }
    addTower(tower) {
        this.towers.push(tower);
    }
    removeTower(ind) {
        if (typeof ind === "number") {
            this.towers.splice(ind, 1);
        }
        else { // typeof ind === cord
            if (this.towers !== null && this.towers.length > 0) {
                for (let i = 0; i < this.towers.length; i++) {
                    if (this.towers[i].cord == ind) {
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
//# sourceMappingURL=TowerSystem.js.map