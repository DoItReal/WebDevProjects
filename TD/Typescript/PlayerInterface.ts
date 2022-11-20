interface player {
    inventory: Inventory;
    hp: number;
    gold: number;
}

class Player implements player{ //TO DO it singleton and to extends (to do)USER
    inventory: Inventory;
    hp: number;
    gold: number;

    constructor() {
        this.inventory = new Inventory(); //Inventory of player /array of $items
        this.hp = 10;
        this.gold = 0;
    }


    gainGold(value: number) {
        this.gold += value;
    }
}
