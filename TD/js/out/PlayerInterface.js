class Player {
    constructor() {
        this.inventory = new Inventory(); //Inventory of player /array of $items
        this.name = "Player1";
        this.iconSrc = "textures/content/player/man-mage-icon.png";
        this.hp = 10;
        this.gold = 0;
    }
    //public methods
    //getters
    getIcon() {
        return this.iconSrc;
    }
    getName() {
        return this.name;
    }
    gainGold(value) {
        this.gold += value;
    }
}
//# sourceMappingURL=PlayerInterface.js.map