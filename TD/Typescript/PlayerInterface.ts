class Player{ //TO DO it singleton and to extends (to do)USER
    private name: string;
    private iconSrc: string;
    inventory: Inventory;
    hp: number;
    gold: number;
    base: Base;

    constructor() {
        this.inventory = new Inventory(); //Inventory of player /array of $items
        this.name = "Player1";
        this.iconSrc = "textures/content/player/man-mage-icon.png";
        this.hp = 10;
        this.gold = 0;
        this.base = new Castle_lvl_1();
    }

        //public methods
    //getters
    getIcon():string {
        return this.iconSrc;
    }
    getName(): string {
        return this.name;
    }
    getBase(): Base {
        return this.base;
    }

    update() {
        this.base.draw();
    }

    gainGold(value: number) {
        this.gold += value;
    }
    
}
