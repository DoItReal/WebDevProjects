class Tower {
    constructor() {
        this.lvl = 1;
        this.target = null;
        this.atkCD = 0;
        this.enemiesInterface = game1.getEnemiesInterface();
        if (this.constructor === Tower) {
            throw new Error("Abstract classes can't be instantiated.");
        }
        this.set = false;
        this.cord = { x: 0, y: 0 };
        this.dim = { w: 0, h: 0 };
    }
    radar() {
        let enemies = this.enemiesInterface.getEnemies();
        for (let i = 0; i < enemies.length; i++) {
            if (this.collisionCheck(enemies[i]) && enemies[i].hp > 0) {
                return enemies[i];
            }
        }
    }
    collisionCheck(enemy) {
        return circRectsOverlap(enemy.cord.x, enemy.cord.y, enemy.dim.w, enemy.dim.h, this.cord.x, this.cord.y, this.range);
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
        //this.ammunition.setTarget(this.target);
        //game1.getMisslesInterface().addMissle(Object.assign({},this.ammunition)); // SHALLOW COPY
        game1.getMisslesInterface().addMissle(this.ammunition(structuredClone(this.cord), this.target)); //DEEP COPY
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
    reload() {
        let fps = game1.fps.fps;
        if (this.atkCD > 0)
            this.atkCD -= 1 / fps;
        if (this.atkCD < 0)
            this.atkCD = 0;
    }
    draw(preview = false) {
        //  console.log(this.cord);
        //   console.log(MainInterface.getMouse());
        let ctx = MainInterface.getPlayground().getContext();
        ctx.save();
        ctx.beginPath();
        if (preview)
            ctx.globalAlpha = 0.5;
        ctx.translate(this.cord.x + this.dim.w / 2, this.cord.y + this.dim.h / 2);
        ctx.fillStyle = this.color || "blue";
        ctx.fillRect((this.dim.w / 2), this.dim.h / 2, 30, 30);
        ctx.fillStyle = this.color || "green";
        ctx.fillRect(this.dim.w / 2 + 5, this.dim.h / 2 + 5, 20, 20);
        ctx.fillStyle = this.color || "red";
        ctx.fillRect(this.dim.w / 2 + 10, this.dim.h / 2 + 10, 10, 10);
        ctx.strokeStyle = this.color || "black";
        ctx.arc(0, 0, this.range, 0, 2 * Math.PI, false);
        ctx.stroke();
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
        ctx.restore();
    }
}
class tower_Slinger extends Tower {
    constructor() {
        super();
        this.name = "Slinger Tower";
        this.lvl = 1;
        this.dim = { w: 40, h: 40 };
        this.speed = 1.2;
        this.target = null;
        this.color = null;
        this.range = 300;
        this.ammunition = function (cord, target) { return new amm_stone(cord, target); };
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