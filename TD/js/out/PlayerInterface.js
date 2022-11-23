class Player {
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
    getIcon() {
        return this.iconSrc;
    }
    getName() {
        return this.name;
    }
    getBase() {
        return this.base;
    }
    update() {
        this.base.draw();
    }
    gainGold(value) {
        this.gold += value;
    }
}
//# sourceMappingURL=PlayerInterface.js.map