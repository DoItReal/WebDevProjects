class WayGenerator {
    constructor() {
        this.way = []; //keeps all generated ways
    }
    lastWay() {
        if (this.way && this.way.length > 0)
            return this.way[this.way.length - 1];
    }
    //public methods
    level_1() {
        let tmp = [{ x: 100, y: 50 }, { x: 100, y: 350 }, { x: 700, y: 350 }, { x: 700, y: 50 }, { x: 1400, y: 50 }, { x: 1400, y: 500 }, { x: 200, y: 500 }];
        this.way.push(tmp);
        return this.lastWay();
    }
    level_2() {
        let tmp = [{ x: 100, y: 50 }, { x: 150, y: 500 }, { x: 500, y: 450 }, { x: 550, y: 50 }, { x: 900, y: 100 }, { x: 950, y: 450 }, { x: 1350, y: 400 }];
        this.way.push(tmp);
        return this.lastWay();
    }
}
//# sourceMappingURL=WaySystem.js.map