class Experience {          // TO ADD EXP BAR CLASS 
    private level: number;          // the Level of the unit
    private maxLevel: number;       // the max Level of the unit
    private value: number;          // current EXP of the unit
    private expToLevelUp: number;      // the amount of EXP needed for leveling up  ($expToLevelUp - $value = current need of exp to level up) 
    private objCord: cord;          // cord of the object
    private expBar: ExperienceBar;
    constructor(cord:cord) {
        this.level = 1;
        this.maxLevel = 3;    // to do later, maybe upgrading something to get higher max level of the unit
        this.value = 0;
        this.expToLevelUp = this.calculateToNextLvl();
        this.objCord = cord;
        this.expBar = new ExperienceBar(this.objCord);
    }
    getLevel() {
        return this.level;
    }
    getMaxLevel() {
        return this.maxLevel;
    }
    getValue() {
        return this.value;
    }
    getExpToLevelUp() {
        return this.expToLevelUp;
    }
    setMaxLevel(newMax: number) {
        this.maxLevel = newMax;
    }
    update() {
        this.expBar.draw(this.value,this.expToLevelUp);
    }
    // here goes the logic for how much EXP is needed for leveling up
    private calculateToNextLvl(): number {
        return (Math.pow(this.level, 4) + 20);
    }
    addExp(value: number) {
        if (this.level == this.maxLevel && this.value == this.expToLevelUp) return; // if MAX LEVEL && MAX EXP
        if (this.level == this.maxLevel && this.value < this.expToLevelUp) {        // if MAX LEVEL && NOT Max EXP
            if (value + this.value > this.expToLevelUp) this.value = this.expToLevelUp;
            else this.value += value;
            return;
        }
        if (value + this.value > this.expToLevelUp) {       // if Level UP
            value -= this.expToLevelUp - this.value;
            this.levelUp();
            this.addExp(value);
        } else {
            this.value += value;
        }
    }
    levelUp(): void {
        this.level += 1;
        this.value = 0;
        this.expToLevelUp = this.calculateToNextLvl();
    }

}

class ExperienceBar {
    img: HTMLImageElement = new Image();
    cord: cord;
    ctx: CanvasRenderingContext2D;
    paddingBottom: number = 45; // [px]
    paddingLeft: number = -40;
    dim: dim;
    constructor(cord:cord) {
        this.img.src = "textures/content/exp_bar/exp_bar.png";
        this.cord = cord;
        this.ctx = MainInterface.getPlayground().getContext();
        this.dim = { w: 80, h: 15 };

    }
    draw(exp: number, maxExp: number) {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.translate(this.cord.x+this.paddingLeft, this.cord.y + this.paddingBottom);

        //draw the border
        this.ctx.drawImage(this.img, 100, 900,      // img, x, y - cord of the image to draw
                                      1800, 200,    // w, h - of the image to draw
                                      0, 0,        // x,y - location of canvas to draw
                                      this.dim.w+4,this.dim.h+4);     // w,h - dimensions to drarw

        //empty the bar
        this.ctx.drawImage(this.img, 1600, 900,      // img, x, y - cord of the image to draw
            100, 200,    // w, h - of the image to draw
            2, 2,        // x,y - location of canvas to draw
            this.dim.w , this.dim.h );     // w,h - dimensions to drarw

        let k = exp / maxExp;
        //fill the bar
        this.ctx.drawImage(this.img, 150, 955,      // img, x, y - cord of the image to draw
            1370, 80,    // w, h - of the image to draw
            2, 2,        // x,y - location of canvas to draw
            k*(this.dim.w),this.dim.h);     // w,h - dimensions to drarw

        //add text 
        this.ctx.font = "14px Roboto";
        this.ctx.fillText(exp + "/" + maxExp, this.dim.w / 4,this.dim.h);
        this.ctx.restore();

    }
}