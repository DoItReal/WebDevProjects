class Experience {
    constructor() {
        this.level = 1;
        this.maxLevel = 3; // to do later, maybe upgrading something to get higher max level of the unit
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
    setMaxLevel(newMax) {
        this.maxLevel = newMax;
    }
    // here goes the logic for how much EXP is needed for leveling up
    calculateToNextLvl() {
        return (Math.pow(this.level, 4) + 20);
    }
    addExp(value) {
        if (this.level == this.maxLevel && this.value == this.expToLevelUp)
            return; // if MAX LEVEL && MAX EXP
        if (this.level == this.maxLevel && this.value < this.expToLevelUp) { // if MAX LEVEL && NOT Max EXP
            if (value + this.value > this.expToLevelUp)
                this.value = this.expToLevelUp;
            else
                this.value += value;
            return;
        }
        if (value + this.value > this.expToLevelUp) { // if Level UP
            value -= this.expToLevelUp - this.value;
            this.levelUp();
            this.addExp(value);
        }
        else {
            this.value += value;
        }
    }
    levelUp() {
        this.level += 1;
        this.value = 0;
        this.expToLevelUp = this.calculateToNextLvl();
    }
}
//# sourceMappingURL=ExperienceSystem.js.map