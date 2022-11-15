class Experience {          // TO ADD EXP BAR CLASS 
    private level: number;          // the Level of the unit
    private maxLevel: number;       // the max Level of the unit
    private value: number;          // current EXP of the unit
    private expToLevelUp: number;      // the amount of EXP needed for leveling up  ($expToLevelUp - $value = current need of exp to level up) 

    constructor() {
        this.level = 1;
        this.maxLevel = 3;    // to do later, maybe upgrading something to get higher max level of the unit
        this.value = 0;
        this.expToLevelUp = this.calculateToNextLvl();
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