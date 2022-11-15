interface way extends Array<cord>{}
interface unit {
    cord: cord;      // {x:number,y:number,w:number,h:number}
    dim: dim;        // dimmension width, height
    way: way;        // Array<cord>
    name: string;    // Name of the unit
    speed: number;   // [px/s]
    maxHP: number    // Maximum Health points
    hp: number;     // Health points
    dmg: number;     // [dmg/hit]
    aspeed: number;  //  [hits/s]
    lvl: number;    //
    status: string;
    scale: number;
    scaleX: number;
    healthBar: HealthBarUnit;
    deadTime: number;
    baseBounty: { exp: number, gold: number };

}

class Enemy implements unit{
    cord: cord;
    dim: dim;
    way: way;
    name: string;
    speed: number;
    maxHP: number;
    hp: number;
    dmg: number;
    aspeed: number;
    lvl: number;
    sprites;
    scale: number = 0.4;
    scaleX: number = 1;
    healthBar: HealthBarUnit;
    status = 'alive';
    deadTime: number = 0;
    deadCD: number = 1500; // [ms]
    baseBounty: { exp: number, gold: number };
    constructor() {
        if (this.constructor === Enemy) {
            throw new Error("Abstract classes can't be instantiated.");
        }
        this.dim = {w:0,h:0};
    }
    update(): void {
        if (this.status != 'dead') {
            if (this.way && this.way.length > 0)
                this.move();
            else this.draw('idle');
        } else {
            this.destroy();
        }
    }
    setCord(cord: cord) {
        this.cord.x = cord.x;
        this.cord.y = cord.y;
    }
    receiveDmg(dmg: number,tower:Tower): number {

        if (this.status == 'alive') {
            this.hp -= dmg;
            var receivedDmg = dmg;
        }
        if (this.hp <= 0) {
            tower.gainBounty(this.calculateBounty());
            this.hp = 0;
            this.destroy();

        }
        return receivedDmg;
    }
    mouseOver(mousePosR: cord) {
        this.highlight();           // drawing highlight effect
        this.tooltip(mousePosR);    // drawing tooltip
    }
    mouseClick(e) {
        // TO DO
    }
    getName() {
        return this.name;
    }
    private calculateBounty() {
        let bountyEXP = this.baseBounty.exp + Math.pow(this.lvl, 2);
        let bountyGold = this.baseBounty.gold + Math.pow(this.lvl, 2) * 0.3;
        return { exp: bountyEXP, gold: bountyGold };
    }
    private move(): void {

        let speedR = this.calcSpeed(this.cord, this.way[0]);
        if (this.cord.x != speedR.speedX + this.cord.x)
            
        this.cord.x += speedR.speedX;
        if(this.cord.y != speedR.speedY + this.cord.y)
            this.cord.y += speedR.speedY;
        if ((Math.round(this.way[0].x) == Math.round(this.cord.x) && Math.round(this.way[0].y)) == Math.round(this.cord.y)) {
            this.way.splice(0, 1);
            console.log('splice');
        }
        if (speedR.speedX > 0) {
            this.scaleX = 1;
        } else if (speedR.speedX < 0) {
            this.scaleX = -1;
        } 
        if (speedR.speedX != 0 || speedR.speedY != 0) this.draw('walk');
        else this.draw('idle');
    }
    private calcSpeed(cord1: cord, cord2: cord): {speedX:number,speedY:number} {
        let dx = cord2.x - cord1.x;
        let dy = cord2.y - cord1.y;
        let c = Math.sqrt((Math.pow(dx, 2) + Math.pow(dy, 2)));
        let sin = dx / c;
        let cos = dy / c;
      //  let tan = dy / dx;
        if (!sin && !cos) {
            return { speedX: 0, speedY: 0 };
        }
        return { speedX: game1.calcDistanceToMove(sin * this.speed), speedY: game1.calcDistanceToMove(cos * this.speed) };
    }
    private draw(str: string = 'idle'): void {
        let ctx = MainInterface.getPlayground().getContext();
        
        this.sprites.get(str).draw(ctx, this.cord, this.scale, this.scaleX, 1); // drawing and rotating the sprite if needed
        
        this.widgets(); //  DRAWING THE WIDGETS
    }
    private highlight() {
        let ctx = MainInterface.getPlayground().getContext();
        ctx.save();

        ctx.translate(this.cord.x, this.cord.y);
        ctx.globalAlpha = 0.2;
        ctx.fillStyle = "lightgreen";
        ctx.fillRect(-this.dim.w / 2, -this.dim.h / 2, this.dim.w, this.dim.h);

        ctx.restore();
    }
    private widgets() {
        this.healthBar.draw();
    }
    private destroy(): void {
        this.status = 'dead';
        if (this.deadTime == 0) {
            this.deadTime = Date.now();
        } else if (Date.now() - this.deadTime > this.deadCD) {
            game1.getEnemiesInterface().removeEnemy(this);
            return;
        }
        this.draw('die');
        
    }
    private tooltip(mousePosR: cord) {
        let ctx = MainInterface.getPlayground().getContext();
        let canvas = MainInterface.getPlayground();
        let w = 120; //width of the tooltip
        let h = 50; //height of the tooltip

        ctx.save();
        if (mousePosR.x + w > canvas.width)
            mousePosR.x = canvas.width - w;
        if (mousePosR.y + h > canvas.height)
            mousePosR.y = canvas.height - h;
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
interface unitSprite {
    URL: string;
    Width: number;
    Height: number;
    NB_Postures: number;
    NB_FramesPerPosture: number;
}
class enemy_PeonSprite {
    sprites: Map<string, unitSprite> = new Map();
    tmp = new Map();

    constructor() {
        this.sprites.set("attack", {
            URL: "textures/content/enemy/Peon/attack.png",
            Width: 294,
            Height: 275,
            NB_Postures: 1,
            NB_FramesPerPosture: 20
        });
        this.sprites.set("walk",{
            URL: "textures/content/enemy/Peon/walk.png",
            Width: 294,
            Height: 275,
            NB_Postures: 1,
            NB_FramesPerPosture: 20
        });
        this.sprites.set("run", {
            URL: "textures/content/enemy/Peon/run.png",
            Width: 294,
            Height: 275,
            NB_Postures: 1,
            NB_FramesPerPosture: 20
        });
        this.sprites.set("idle", {
            URL: "textures/content/enemy/Peon/idle.png",
            Width: 294,
            Height: 275,
            NB_Postures: 1,
            NB_FramesPerPosture: 20
        });
        this.sprites.set("die", {
            URL: "textures/content/enemy/Peon/die.png",
            Width: 294,
            Height: 275,
            NB_Postures: 1,
            NB_FramesPerPosture: 20
        });
        this.sprites.set("hurt", {
            URL: "textures/content/enemy/Peon/hurt.png",
            Width: 294,
            Height: 275,
            NB_Postures: 1,
            NB_FramesPerPosture: 20
        });
        this.sprites.set("jump", {
            URL: "textures/content/enemy/Peon/jump.png",
            Width: 294,
            Height: 275,
            NB_Postures: 1,
            NB_FramesPerPosture: 20
        });
    }
    loadAssets() {
        this.sprites.forEach( (value, key)=> {
        /*
         * var SPRITESHEET_URL = "textures/content/enemy/Peon/attack/attack.png";
        var SPRITE_WIDTH = 294;
        var SPRITE_HEIGHT = 275;
        var NB_POSTURES = 1;
        var NB_FRAMES_PER_POSTURE = 20;
        */
        // load the spritesheet
        var spritesheet = new Image();
        spritesheet.src = value.URL;
            let tmp = new Map();
            // Called when the spritesheet has been loaded
            spritesheet.onload =  ()=> {      // Create woman sprites
                for (var i = 0; i < value.NB_Postures; i++) {
                    var sprite = new Sprite();
                    sprite.extractSprites(spritesheet, value.NB_Postures, (i + 1),
                        value.NB_FramesPerPosture,
                        { w: value.Width, h: value.Height });
                    sprite.setNbImagesPerSecond(20);
                    this.tmp.set(key,sprite);
                }

                // call the callback function passed as a parameter, 
                // we're done with loading assets and building the sprites
              //  callback();
            };
        });
    }
    getSprites() {
        this.loadAssets();
        return this.tmp;
    }
}


class enemy_Peon extends Enemy{
    sprites;
   
    constructor(cord: cord, way: way) {
        super();
        this.cord = cord;
        this.dim.w = 60;
        this.dim.h = 60;
        this.way = way;
        this.name = "Peon";
        this.speed = 60; 
        this.maxHP = 10;
        this.hp = this.maxHP;
        this.dmg = 1;
        this.lvl = 1;
        this.sprites = MainInterface.getSprites("Peon");
        this.scale = 0.35;
        this.healthBar = new HealthBarUnit(this);
        this.baseBounty = { exp: 10, gold: 1 };
    }
   
       
}
class enemy_WarriorSprite {
    sprites: Map<string, unitSprite> = new Map();
    images = new Map();

    constructor() {
        this.sprites.set("attack", {
            URL: "textures/content/enemy/Warrior/attack.png",
            Width: 343,
            Height: 348,
            NB_Postures: 1,
            NB_FramesPerPosture: 20
        });
        this.sprites.set("walk", {
            URL: "textures/content/enemy/Warrior/walk.png",
            Width: 343,
            Height: 348,
            NB_Postures: 1,
            NB_FramesPerPosture: 20
        });
        this.sprites.set("run", {
            URL: "textures/content/enemy/Warrior/run.png",
            Width: 343,
            Height: 348,
            NB_Postures: 1,
            NB_FramesPerPosture: 20
        });
        this.sprites.set("idle", {
            URL: "textures/content/enemy/Warrior/idle.png",
            Width: 343,
            Height: 348,
            NB_Postures: 1,
            NB_FramesPerPosture: 20
        });
        this.sprites.set("die", {
            URL: "textures/content/enemy/Warrior/die.png",
            Width: 343,
            Height: 348,
            NB_Postures: 1,
            NB_FramesPerPosture: 20
        });
        this.sprites.set("hurt", {
            URL: "textures/content/enemy/Warrior/hurt.png",
            Width: 343,
            Height: 348,
            NB_Postures: 1,
            NB_FramesPerPosture: 20
        });
        this.sprites.set("jump", {
            URL: "textures/content/enemy/Warrior/jump.png",
            Width: 343,
            Height: 348,
            NB_Postures: 1,
            NB_FramesPerPosture: 20
        });
    }
    loadAssets() {
        this.sprites.forEach((value, key) => {
            var spritesheet = new Image();
            spritesheet.src = value.URL;
            // Called when the spritesheet has been loaded
            spritesheet.onload = () => {      // Create woman sprites
                for (var i = 0; i < value.NB_Postures; i++) {
                    var sprite = new Sprite();
                    sprite.extractSprites(spritesheet, value.NB_Postures, (i + 1),
                        value.NB_FramesPerPosture,
                        { w: value.Width, h: value.Height });
                    sprite.setNbImagesPerSecond(20);
                    this.images.set(key, sprite);
                }

                // call the callback function passed as a parameter, 
                // we're done with loading assets and building the sprites
                //  callback();
            };
        });
    }
    getSprites() {
        this.loadAssets();
        return this.images;
    }
}
class enemy_Warrior extends Enemy {
    sprites;

    constructor(cord: cord, way: way) {
        super();
        this.cord = cord;
        this.dim.w = 80;
        this.dim.h = 80;
        this.way = way;
        this.name = "Warrior";
        this.speed = 70;
        this.maxHP = 25;
        this.hp = this.maxHP;
        this.dmg = 2;
        this.lvl = 1;
        this.sprites = MainInterface.getSprites("Warrior");
        this.scale = 0.35;
        this.healthBar = new HealthBarUnit(this);
        this.baseBounty = { exp: 13, gold: 2 };
    }


}
//Enemies Interface - Contains all enemies in game
class _Enemies {
    enemies: Array<Enemy>;
    constructor() {
        this.enemies = [];
    }
    addEnemy(enemy: Enemy): void {
        this.enemies.push(enemy);
 
    }
    removeEnemy(ind: number | Enemy) {
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
    getEnemiesCount() {
        if (this.enemies) return this.enemies.length;
        return 0;
    }
}