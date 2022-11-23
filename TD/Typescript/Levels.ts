class Level {
    waveGen = new WavesGenerator();
    wayGen = new WayGenerator();
    wave: Wave = null;
    way: way = null;

    constructor() {
    if (this.constructor === Level) {
        throw new Error("Abstract classes can't be instantiated.");
    }
    }
    //public methods
//getters
    getWave(): Wave {
        return this.wave;
    }
    getWay(): way {
        return this.way;
    }
init(){
    game1.player.getBase().setCord(this.wave.getWay()[this.wave.getWay().length - 1]);
    game1.setWave(this.wave);

}
}
class Level_1 extends Level{
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