class Base {
    hp: number = 0;     // to do BaseHP class extending Health System
    maxHP: number = 1;
    img: Array<HTMLImageElement> = [];
    cord: cord;
    dim: dim;
    constructor() {
        if (this.constructor === Base) {
            throw new Error("Abstract classes can't be instantiated.");
        }
        this.cord = { x: 0, y: 0 };
        this.dim = { w: 250, h: 250 };
    }
        //public methods
    //getters
    getHP() {
        return this.hp;
    }
    getMaxHP() {
        return this.maxHP;
    }
    getCord() {
        return this.cord;
    }
    getDim() {
        return this.dim;
    }
    //setters
    setHP(hp: number) {
        this.hp = hp;
    }
    setMaxHP(maxHP: number) {
        this.maxHP = maxHP;
    }
    setCord(cord: cord) {
        this.cord = cord;
    }
    setDim(dim: dim) {
        this.dim = dim;
    }
    draw() {
        let str:string;
        if (this.hp === this.maxHP) {
            str = "full";
        } else if (this.hp < this.maxHP && this.hp > 0) {
            str = "damaged";
        } else {
            str = "destroyed";
        }
        if (!this.img[str].complete) return;
        
        let ctx = MainInterface.getPlayground().getContext();

        ctx.save();     
        setOrientation(this.cord,this.dim);
        
        ctx.drawImage(this.img[str], 0,0, this.dim.w, this.dim.h); //drawing the texture

        ctx.restore();
        function setOrientation(cord:cord,dim:dim) {
            if (game1.getLevel()) {
                let way = game1.getLevel().getWay();
                if (way[way.length - 2].x > way[way.length - 1].x) {
                    ctx.scale(-1, 1);
                    ctx.translate(-cord.x-dim.w/2, cord.y - dim.h / 2);
                } else {
                    ctx.translate(cord.x-dim.w/2, cord.y - dim.h / 2);
                }
            }
        }
    }
    receiveDmg(dmg:number) {
        this.hp -= dmg;
        if (this.hp <= 0) {
            game1.GameOver();
        }
    }
}


class Castle_lvl_1 extends Base {
    constructor() {
        super();
        this.maxHP = 10;
        this.hp = this.maxHP;

        this.img['full'] = new Image();
        this.img['full'].src = "textures/content/castle/lvl_1-full.png";

        this.img['damaged'] = new Image();
        this.img['damaged'].src = "textures/content/castle/lvl_1-damaged.png";

        this.img['destroyed'] = new Image(); 
        this.img['destroyed'].src = "textures/content/castle/lvl_1-destroyed.png";

    }
}

