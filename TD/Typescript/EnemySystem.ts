interface way extends Array<cord>{}
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
    attackSprite;
    sprites;
    scale: number = 0.5;
    constructor() {
        if (this.constructor === Enemy) {
            throw new Error("Abstract classes can't be instantiated.");
        }
        this.dim = {w:0,h:0};
    }
    update(): void {
        if (this.way && this.way.length > 0)
            this.move();
        else this.draw();
    }

    move(): void {
        let speedR = this.calcSpeed(this.cord, this.way[0]);
        if(this.cord.x != speedR.speedX + this.cord.x )
            this.cord.x += speedR.speedX;
        if(this.cord.y != speedR.speedY + this.cord.y)
            this.cord.y += speedR.speedY;
        if (Math.round(this.way[0].x) == Math.round(this.cord.x) && Math.round(this.way[0].y) == Math.round(this.cord.y)) this.way.splice(0, 1);
        this.draw();
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
    draw(): void {
        let ctx = MainInterface.getPlayground().getContext();
        this.sprites.get('walkSprite').draw(ctx,this.cord,this.scale);
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
        this.sprites.set("attackSprite", {
            URL: "textures/content/enemy/Peon/attack/attack.png",
            Width: 294,
            Height: 275,
            NB_Postures: 1,
            NB_FramesPerPosture: 20
        });
        this.sprites.set("walkSprite",{
            URL: "textures/content/enemy/Peon/attack/walk.png",
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
        this.hp = 10;
        this.dmg = 1;
        this.lvl = 1;
        this.sprites = MainInterface.getSprites("Peon");
        this.scale = 0.4;
    }
   
       
}

//Enemies Interface - Contains all enemies in game
class _Enemies {
    enemies: Array<Enemy>;
    constructor() {
        this.enemies = [];
    }
    addEnemy(enemy: Enemy): void {
        enemy.attackSprite = MainInterface.attackSprite;
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