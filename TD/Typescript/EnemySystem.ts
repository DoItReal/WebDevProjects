interface way {
    way: Array<cord>;
}
interface enemy {
    cord: cord;      // {x:number,y:number,w:number,h:number}
    dim: dim;        // dimmension width, height
    way: way;        // Array<cord>
    name: string;    // Name of the unit
    speed: number;   // [px/s]
    hp: number;     // Health points
    dmg: number;     // [dmg/hit]
    aspeed: number;  //  [hits/s]
    lvl: number;    //
}

class Enemy implements enemy{
    cord: cord;
    dim: dim;
    way: way;
    name: string;
    speed: number;
    hp: number;
    dmg: number;
    aspeed: number;
    lvl: number;
    constructor() {
        if (this.constructor === Enemy) {
            throw new Error("Abstract classes can't be instantiated.");
        }
        this.dim = {w:0,h:0};
    }
    update(): void {
        if (this.way && this.way.length > 0)
        this.move();
    }

    move(): void {
        let fps = game1.fps.fps;    
        let tmp = { x: this.cord.x, y: this.cord.y };
        let speedR = this.calcSpeed(this.cord, this.way[0]);
        if((this.cord.x + speedR.speedX/fps ) < this.way[0].x)
            this.cord.x += speedR.speedX / fps;
        if((this.cord.y + speedR.speedY/fps) < this.way[0].y)
            this.cord.y += speedR.speedY / fps;
        if (tmp.x == this.cord.x && tmp.y == this.cord.y) this.way.splice(0, 1);
        this.draw();
    }
    calcSpeed(cord1: cord, cord2: cord): {speedX:number,speedY:number} {
        let dx = cord2.x - cord1.x;
        let dy = cord2.y - cord1.y;
        let c = Math.sqrt((Math.pow(dx, 2) + Math.pow(dy, 2)));
        let sin = dx / c;
        let cos = dy / c;
        return { speedX: (sin * this.speed), speedY: (cos * this.speed) };
    }
    draw(): void {
        let ctx = MainInterface.getPlayground().getContext();
        ctx.save();
        ctx.translate(this.cord.x, this.cord.y);
        ctx.fillStyle = "red";
        ctx.fillRect(0, 0, this.dim.w, this.dim.h);
        ctx.fillStyle = "white";
        ctx.fillRect(this.dim.w/5.33, this.dim.h/4, this.dim.w/4, this.dim.h/4);
        ctx.fillRect(this.dim.w / 1.6, this.dim.h / 4, this.dim.w / 4, this.dim.h / 4);
        ctx.fillStyle = "blue";
        ctx.fillRect(this.dim.w/4.2, this.dim.h/3.33, this.dim.w/6.66, this.dim.h/6.66);
        ctx.fillRect(this.dim.w / 1.48, this.dim.h / 3.33, this.dim.w / 6.66, this.dim.h / 6.66);
        ctx.fillStyle = "black";
        ctx.fillRect(this.dim.w / 3.63, this.dim.h / 2.96, this.dim.w / 13.33, this.dim.h / 13.66);
        ctx.fillRect(this.dim.w / 1.4, this.dim.h / 2.96, this.dim.w / 13.33, this.dim.h / 13.66);

        ctx.restore();
    }
    receiveDmg(dmg: number): number {
        console.log(this);
        let receivedDmg = dmg;
        this.hp -= dmg;
        if (this.hp <= 0) this.destroy();
        return receivedDmg;
    }
    destroy(): void {
        console.log(this.name + " lvl:" + this.lvl + " KO");
        game1.getEnemiesInterface().removeEnemy(this);
        // TO DO
    }
    tooltip(mousePosR) {
        let ctx = MainInterface.getPlayground().getContext();
        let canvas = MainInterface.getPlayground();
        let w = 120; //width of the tooltip
        let h = 50; //height of the tooltip

        ctx.save();
        if (mousePosR.x + w > canvas.width) mousePosR.x = canvas.width - w;
        if (mousePosR.y + h > canvas.height) mousePosR.y = canvas.height - h;
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
        ctx.fillText(this.name + ' lvl ' + this.lvl, 10, 30);


        ctx.restore();
    }
}

class enemy_Peon extends Enemy{
    constructor(cord: cord, way: way) {
        super();
        this.cord = cord;
        this.dim.w = 40;
        this.dim.h = 40;
        this.way = way;
        this.name = "Peon";
        this.speed = 60; 
        this.hp = 10;
        this.dmg = 1;
        this.lvl = 1;
    }
}
class _Enemies {
    enemies: Array<Enemy>;
    constructor() {
        this.enemies = [];
    }
    addEnemy(enemy: Enemy): void {
        this.enemies.push(enemy);
    }
    removeEnemy(ind: number | enemy) {
        if (typeof ind === "number") {
            this.enemies.splice(ind, 1);
        } else { // typeof ind === enemy
            if (this.enemies !== null && this.enemies.length > 0) {
                for (let i = 0; i < this.enemies.length; i++) {
                    if (this.enemies[i] === ind) {
                        this.removeEnemy(i);
                        return;
                    }
                }
            }
        }
    }
    update() {
        if (this.enemies !== null && this.enemies.length > 0) {
            this.enemies.forEach(e => e.update());
        }
    }
    getEnemies() {
        return this.enemies;
    }
}