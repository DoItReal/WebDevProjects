class Level {
    constructor() {
        this.waveGen = new WavesGenerator();
        this.wayGen = new WayGenerator();
        this.wave = null;
        this.way = null;
        if (this.constructor === Level) {
            throw new Error("Abstract classes can't be instantiated.");
        }
    }
    //public methods
    //getters
    getWave() {
        return this.wave;
    }
    getWay() {
        return this.way;
    }
    init() {
        game1.player.getBase().setCord(this.wave.getWay()[this.wave.getWay().length - 1]);
        game1.setWave(this.wave);
    }
}
class Level_1 extends Level {
    constructor() {
        super();
        this.way = this.wayGen.level_1();
        this.wave = this.waveGen.level_1(this.way);
    }
}
class Level_2 extends Level {
    constructor() {
        super();
        this.way = this.wayGen.level_2();
        this.wave = this.waveGen.level_2(this.way);
    }
}
//# sourceMappingURL=Levels.js.map