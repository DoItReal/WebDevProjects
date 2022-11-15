class wave_node {
	unit: Enemy;		// containing unit to spawn
	delay: number; // [s]
	next: wave_node;
	constructor(unit:Enemy,delay:number,next = null) {
		this.unit = unit;
		this.delay = delay;
		this.next = next;
	}
}

class Wave {
	private head: wave_node;
	private size: number = 0;
	private delay: number;
	private way: way; 
	private timer: Timer = new Timer();
	constructor(node:wave_node=null) {
		this.head = node;
		if (this.head !== null) {
			this.size += 1;
		}
		this.delay = 1;
		this.way = [{ x: 0, y: 0 }];
	}
	init_wave() {
		setTimeout(()=>{ this.spawnUnits() }, this.head.delay*1000);
	}
	spawnUnits(node: wave_node = this.getHead()) {
		console.log(this.getHead());
		if (node != null) {
			game1.getEnemiesInterface().addEnemy(node.unit);
			node = node.next;
			if (node != null)
				setTimeout(()=> { this.spawnUnits(node) }, node.delay*1000);
		}
	}
	setWay(way: way) {
		this.way = way;
	}
	setDelay(value: number) {
		this.delay = value;
	}
	setHead(node:wave_node) {
		this.head = node;
		this.head.next = null;
		if (this.head != null) this.size = 1;
		else this.size = 0;
	}
	getHead() {
		if (this.head) return this.head;
		else return null;
	}
	getTail():wave_node {
		let current = this.head;
		while (current && current.next != null) {
			current = current.next;
		}
		return current;
	}
	getSize() {
		return this.size;
	}
	addUnit(unit: Enemy) {
		unit.setCord({x:this.way[0].x,y:this.way[0].y});
		unit.way = structuredClone(this.way);
		if (this.getTail() != null)
			this.getTail().next = new wave_node(unit, this.delay);
		else this.head = new wave_node(unit, this.delay);
	}
	//to implement better functionality of the LINKED LIST if needed  // * not needed at the moment *
}

var testWay = [{ x: 100, y:100}, { x: 100, y: 400 }, { x: 400, y: 400 }, { x: 400, y: 100 }, { x: 700, y: 100 }, { x: 700, y: 500 }, { x: 100, y: 500 }];
class WavesGenerator {
	private wave: Wave;
	constructor(){
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