class Player {
    constructor() {
        this.inventory = new Inventory(); //Inventory of player /array of $items
        this.hp = 10;
        this.gold = 0;
    }
    gainGold(value) {
        this.gold += value;
    }
}
//# sourceMappingURL=PlayerInterface.js.map