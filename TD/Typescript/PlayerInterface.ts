interface player {
    cord: cord;
    dim: dim;
    speed: number;
    inventory: Inventory;
    hp: number;
    gold: number;
}

class Player implements player{ //TO DO it singleton and to extends (to do)USER
    cord: cord;
    dim: dim;
    speed: number;
    inventory: Inventory;
    hp: number;
    gold: number;

    constructor(cord:cord, speed:number) {
        this.cord = cord;
        this.speed = speed; //speed of player pixels/s /int
        this.inventory = new Inventory(); //Inventory of player /array of $items
        this.hp = 10;
        this.gold = 0;
        this.move = this.move.bind(this);
    }

    move() {
        let speed = game1.calcDistanceToMove(this.speed);
        let moveLeft = function () {
            if (this.cord.x - speed >= 0) this.cord.x -= speed;
            else this.cord.x = 0;

        }
        let moveUp = function () {
            if (this.cord.y - speed >= 0) this.cord.y -= speed;
            else this.cord.y = 0;

        }
        let moveRight = function () {
            if (this.cord.x + speed <= MainInterface.getPlayground().getCanvas().width - 80) this.cord.x += speed;
            else this.cord.x = MainInterface.getPlayground().getCanvas().width - 80;

        }
        let moveDown = function () {
            if (this.cord.y + speed <= MainInterface.getPlayground().getCanvas().height - 80) this.cord.y += speed;
            else this.cord.y = MainInterface.getPlayground().getCanvas().height - 80;

        }
        if (MainInterface.pressedKeys.has(37)) moveLeft();
        if (MainInterface.pressedKeys.has(38)) moveUp();
        if (MainInterface.pressedKeys.has(39)) moveRight();
        if (MainInterface.pressedKeys.has(40)) moveDown();
        this.drawPlayer(this.cord.x, this.cord.y);

    }
    gainGold(value: number) {
        this.gold += value;
    }
    drawPlayer(x, y) {
        let ctx = MainInterface.getPlayground().getContext();
        ctx.save();
        ctx.translate(x, y);
        ctx.fillStyle = "green";
        ctx.fillRect(0, 0, 80, 80);
        ctx.fillStyle = "white";
        ctx.fillRect(15, 20, 20, 20);
        ctx.fillRect(50, 20, 20, 20);
        ctx.fillStyle = "blue";
        ctx.fillRect(19, 24, 12, 12);
        ctx.fillRect(54, 24, 12, 12);
        ctx.fillStyle = "black";
        ctx.fillRect(22, 27, 6, 6);
        ctx.fillRect(57, 27, 6, 6);
        ctx.restore();
    }

}
