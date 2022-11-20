class wave_node {
    constructor(unit, delay, next = null) {
        this.unit = unit;
        this.delay = delay;
        this.next = next;
    }
}
class Wave {
    constructor(node = null) {
        //public
        this.active = null;
        this.size = 0;
        this.timer = new Timer();
        this.head = node;
        if (this.head !== null) {
            this.size += 1;
        }
        this.delay = 1;
        this.way = [{ x: 0, y: 0 }];
    }
    //public methods
    init_wave() {
        if (this.active === null) {
            this.active = true;
            setTimeout(() => { this.spawnUnits(); }, this.head.delay * 1000);
        }
        else {
            console.log('Error Wave:init_wave() - Already active(true) || finished(false): ' + this.active);
        }
    }
    addUnit(unit) {
        unit.setCord({ x: this.way[0].x, y: this.way[0].y });
        unit.way = structuredClone(this.way);
        if (this.getTail() != null)
            this.getTail().next = new wave_node(unit, this.delay);
        else
            this.head = new wave_node(unit, this.delay);
        this.size += 1;
    }
    draw() {
        let ctx = MainInterface.getPlayground().getContext();
        ctx.save();
        ctx.beginPath();
        ctx.lineWidth = 5;
        ctx.strokeStyle = "lightgreen";
        ctx.globalAlpha = 0.3;
        if (this.way) {
            for (let i = 0; i < this.way.length - 1; i++) {
                drawArrow(this.way[i], this.way[i + 1]);
            }
        }
        function drawArrow(from, to) {
            let headlen = 20; // length of head in pixels
            let dx = to.x - from.x;
            let dy = to.y - from.y;
            let angle = Math.atan2(dy, dx);
            ctx.moveTo(from.x, from.y);
            ctx.lineTo(to.x, to.y);
            ctx.moveTo(to.x, to.y);
            ctx.lineTo(to.x - headlen * Math.cos(angle - Math.PI / 6), to.y - headlen * Math.sin(angle - Math.PI / 6));
            ctx.moveTo(to.x, to.y);
            ctx.lineTo(to.x - headlen * Math.cos(angle + Math.PI / 6), to.y - headlen * Math.sin(angle + Math.PI / 6));
        }
        ctx.stroke();
        ctx.restore();
    }
    //setters 
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
    //getters
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
    getActive() {
        return this.active;
    }
    //private methods 
    spawnUnits(node = this.getHead()) {
        if (node != null) {
            game1.getEnemiesInterface().addEnemy(node.unit);
            node = node.next;
            if (node != null) {
                setTimeout(() => { this.spawnUnits(node); }, node.delay * 1000);
            }
            else {
                this.active = false;
            }
        }
    }
}
class WayGenerator {
    constructor() {
        this.way = [];
    }
    lastWay() {
        if (this.way && this.way.length > 0)
            return this.way[this.way.length - 1];
    }
    level_1() {
        let tmp = [{ x: 100, y: 50 }, { x: 100, y: 350 }, { x: 700, y: 350 }, { x: 700, y: 50 }, { x: 1400, y: 50 }, { x: 1400, y: 500 }, { x: 0, y: 500 }];
        this.way.push(tmp);
        return this.lastWay();
    }
    level_2() {
        let tmp = [{ x: 100, y: 50 }, { x: 150, y: 500 }, { x: 500, y: 450 }, { x: 550, y: 50 }, { x: 900, y: 100 }, { x: 950, y: 450 }, { x: 1350, y: 400 }];
        this.way.push(tmp);
        return this.lastWay();
    }
}
class WavesGenerator {
    constructor() {
        this.waves = [];
        this.wayGen = new WayGenerator();
    }
    level_1() {
        let wave = new Wave();
        wave.setWay(this.wayGen.level_1());
        wave.setDelay(2);
        let groupA = 10;
        for (let i = 0; i < groupA; i++) {
            wave.addUnit(new enemy_Peon({ x: 0, y: 0 }, []));
        }
        wave.setDelay(4);
        let groupB = 5;
        for (let i = 0; i < groupB; i++) {
            wave.addUnit(new enemy_Warrior({ x: 0, y: 0 }, []));
        }
        wave.setDelay(1);
        let groupC = 8;
        for (let i = 0; i < groupC; i++) {
            wave.addUnit(new enemy_Peon({ x: 0, y: 0 }, []));
        }
        this.waves.push(wave);
        return wave;
    }
    level_2() {
        let wave = new Wave();
        wave.setWay(this.wayGen.level_2());
        wave.setDelay(1);
        let groupA = 6;
        for (let i = 0; i < groupA; i++) {
            wave.addUnit(new enemy_Peon({ x: 0, y: 0 }, []));
        }
        wave.setDelay(2);
        let groupB = 3;
        for (let i = 0; i < groupB; i++) {
            wave.addUnit(new enemy_Warrior({ x: 0, y: 0 }, []));
        }
        wave.setDelay(1.2);
        let groupC = 8;
        for (let i = 0; i < groupC; i++) {
            wave.addUnit(new enemy_Peon({ x: 0, y: 0 }, []));
        }
        this.waves.push(wave);
        return wave;
    }
    getWave() {
        if (this.waves && this.waves.length > 0)
            return this.waves[this.waves.length - 1]; // returning the last created wave
    }
}
//# sourceMappingURL=WavesSystem.js.map