class wave_node {
    constructor(unit, delay, next = null) {
        this.unit = unit;
        this.delay = delay;
        this.next = next;
    }
}
class Wave {
    constructor(node = null) {
        this.size = 0;
        this.timer = new Timer();
        this.head = node;
        if (this.head !== null) {
            this.size += 1;
        }
        this.delay = 1;
        this.way = [{ x: 0, y: 0 }];
    }
    init_wave() {
        setTimeout(() => { this.spawnUnits(); }, this.head.delay * 1000);
    }
    spawnUnits(node = this.getHead()) {
        if (node != null) {
            game1.getEnemiesInterface().addEnemy(node.unit);
            node = node.next;
            if (node != null)
                setTimeout(() => { this.spawnUnits(node); }, node.delay * 1000);
        }
    }
    setWay(way) {
        this.way = way;
    }
    setDelay(value) {
        this.delay = value;
    }
    setHead(node) {
        this.head = node;
        this.head.next = null;
        if (this.head != null)
            this.size = 1;
        else
            this.size = 0;
    }
    getHead() {
        if (this.head)
            return this.head;
        else
            return null;
    }
    getTail() {
        let current = this.head;
        while (current && current.next != null) {
            current = current.next;
        }
        return current;
    }
    getSize() {
        return this.size;
    }
    addUnit(unit) {
        unit.setCord({ x: this.way[0].x, y: this.way[0].y });
        unit.way = structuredClone(this.way);
        if (this.getTail() != null)
            this.getTail().next = new wave_node(unit, this.delay);
        else
            this.head = new wave_node(unit, this.delay);
    }
}
var testWay = [{ x: 100, y: 100 }, { x: 100, y: 400 }, { x: 400, y: 400 }, { x: 400, y: 100 }, { x: 700, y: 100 }, { x: 700, y: 500 }, { x: 100, y: 500 }];
class WavesGenerator {
    constructor() {
        this.wave = new Wave();
    }
    level_1() {
        this.wave.setDelay(2);
        this.wave.setWay(testWay);
        let numbers_1 = 10;
        for (let i = 0; i < numbers_1; i++) {
            this.wave.addUnit(new enemy_Peon({ x: 0, y: 0 }, []));
        }
        let numbers_2 = 5;
        for (let i = 0; i < numbers_2; i++) {
            this.wave.addUnit(new enemy_Warrior({ x: 0, y: 0 }, []));
        }
        return this.wave;
    }
    getWave() {
        return this.wave; // returning the last created wave
    }
}
//# sourceMappingURL=WavesSystem.js.map