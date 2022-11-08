interface way extends Array<cord>{}
interface enemy {
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
    highlight: boolean;
    status: string;
    deadTime: number;
}

class Enemy implements enemy{
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
    highlight: boolean = false;
    scaleX: number = 1;
    healthBar: HealthBarUnit;
    status = 'alive';
    deadTime: number = 0;
    deadCD: number = 1500; // [ms]
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

    move(): void {
        let speedR = this.calcSpeed(this.cord, this.way[0]);
        if(this.cord.x != speedR.speedX + this.cord.x )
            this.cord.x += speedR.speedX;
        if(this.cord.y != speedR.speedY + this.cord.y)
            this.cord.y += speedR.speedY;
        if (Math.round(this.way[0].x) == Math.round(this.cord.x) && Math.round(this.way[0].y) == Math.round(this.cord.y)) this.way.splice(0, 1);
        if (speedR.speedX > 0) {
            this.scaleX = 1;
        } else if (speedR.speedX < 0) {
            this.scaleX = -1;
        } 
        if (speedR.speedX != 0 && speedR.speedY != 0) this.draw('walk');
        else this.draw('idle');
    }
    calcSpeed(cord1: cord, cord2: cord): {speedX:number,speedY:number} {
        let dx = cord2.x - cord1.x;
        let dy = cord2.y - cord1.y;
        let c = Math.sqrt((Math.pow(dx, 2) + Math.pow(dy, 2)));
        let sin = dx / c;
        let cos = dy / c;
      //  let tan = dy / dx;

        return { speedX: game1.calcDistanceToMove(sin * this.speed), speedY: game1.calcDistanceToMove(cos * this.speed) };
    }
    getHighlight() {
        return this.highlight;
    }
    setHighlight(value) {
        this.highlight = value;
    }
    draw(str: string = 'idle'): void {
        let ctx = MainInterface.getPlayground().getContext();
        console.log(str);
        this.healthBar.draw();
        this.sprites.get(str).draw(ctx, this.cord, this.scale, this.scaleX, 1); // rotating the sprite if needed
        

        if (this.highlight) { // if MouseOn
            ctx.save();
            ctx.translate(this.cord.x, this.cord.y);
            ctx.globalAlpha = 0.2;
            ctx.fillStyle = "lightgreen";
            ctx.fillRect(-this.dim.w / 2, -this.dim.h / 2, this.dim.w, this.dim.h);
            ctx.restore();
        }
        /*
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
        */
    }
    receiveDmg(dmg: number): number {
        
        if (this.status == 'alive') {
            this.hp -= dmg;
            var receivedDmg = dmg;
        }
        if (this.hp <= 0) this.destroy();
        return receivedDmg;
    }
    destroy(): void {
        this.status = 'dead';
        if (this.deadTime == 0) {
            this.deadTime = Date.now();
        } else if (Date.now() - this.deadTime > this.deadCD) {
            game1.getEnemiesInterface().removeEnemy(this);
            return;
        }
        this.draw('die');
        
    }
    tooltip(mousePosR:cord) {
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
    getName() {
        return this.name;
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
    getEnemiesCount() {
        if (this.enemies) return this.enemies.length;
        return 0;
    }
}