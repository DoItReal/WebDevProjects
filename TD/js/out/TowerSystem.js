var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Tower = /** @class */ (function () {
    function Tower() {
        this.lvl = 1;
        this.target = null;
        this.atkCD = 0;
        this.enemiesInterface = game1.getEnemiesInterface();
        if (this.constructor === Tower) {
            throw new Error("Abstract classes can't be instantiated.");
        }
        this.dim = { w: 0, h: 0 };
    }
    Tower.prototype.radar = function () {
        var enemies = this.enemiesInterface.getEnemies();
        for (var i = 0; i < enemies.length; i++) {
            if (this.collisionCheck(enemies[i]) && enemies[i].hp > 0) {
                return enemies[i];
            }
        }
    };
    Tower.prototype.collisionCheck = function (enemy) {
        return circRectsOverlap(enemy.cord.x, enemy.cord.y, enemy.dim.w, enemy.dim.h, this.cord.x, this.cord.y, this.range);
    };
    Tower.prototype.attack = function () {
        console.log('atk');
        if (this.atkCD <= 0) {
            this.shoot();
            this.atkCD = this.speed;
        }
        else
            this.reload();
    };
    Tower.prototype.shoot = function () {
        //this.ammunition.setTarget(this.target);
        //game1.getMisslesInterface().addMissle(Object.assign({},this.ammunition)); // SHALLOW COPY
        game1.getMisslesInterface().addMissle(this.ammunition(structuredClone(this.cord), this.target)); //DEEP COPY
    };
    Tower.prototype.update = function () {
        this.draw(); // draw the texture of the tower
        if (!this.target || !this.collisionCheck(this.target) || this.target.hp <= 0) {
            this.target = this.radar();
        }
        if (this.target != null) {
            this.attack();
        }
        else
            this.reload();
    };
    Tower.prototype.reload = function () {
        var fps = game1.fps.fps;
        if (this.atkCD > 0)
            this.atkCD -= 1 / fps;
        if (this.atkCD < 0)
            this.atkCD = 0;
    };
    Tower.prototype.draw = function (preview) {
        if (preview === void 0) { preview = false; }
        var ctx = MainInterface.getPlayground().getContext();
        ctx.save();
        ctx.beginPath();
        if (preview)
            ctx.globalAlpha = 0.5;
        ctx.translate(this.cord.x, this.cord.y);
        ctx.fillStyle = this.color || "blue";
        ctx.fillRect(-(this.dim.w / 2), -this.dim.h / 2, 30, 30);
        ctx.fillStyle = this.color || "green";
        ctx.fillRect(-this.dim.w / 2 + 5, -this.dim.h / 2 + 5, 20, 20);
        ctx.fillStyle = this.color || "red";
        ctx.fillRect(-this.dim.w / 2 + 10, -this.dim.h / 2 + 10, 10, 10);
        ctx.strokeStyle = this.color || "black";
        ctx.arc(0, 0, this.range, 0, 2 * Math.PI, false);
        ctx.stroke();
        ctx.restore();
    };
    return Tower;
}());
var tower_Slinger = /** @class */ (function (_super) {
    __extends(tower_Slinger, _super);
    function tower_Slinger(cord) {
        var _this = _super.call(this) || this;
        _this.cord = cord;
        _this.name = "Slinger Tower";
        _this.lvl = 1;
        _this.speed = 1.2;
        _this.target = null;
        _this.color = null;
        _this.range = 300;
        _this.ammunition = function (cord, target) { return new amm_stone(cord, target); };
        return _this;
    }
    return tower_Slinger;
}(Tower));
var _Towers = /** @class */ (function () {
    function _Towers() {
        this.towers = [];
    }
    _Towers.prototype.addTower = function (tower) {
        this.towers.push(tower);
    };
    _Towers.prototype.removeTower = function (ind) {
        if (typeof ind === "number") {
            this.towers.splice(ind, 1);
        }
        else { // typeof ind === cord
            if (this.towers !== null && this.towers.length > 0) {
                for (var i = 0; i < this.towers.length; i++) {
                    if (this.towers[i].cord == ind) {
                        this.removeTower(i);
                        return;
                    }
                }
            }
        }
    };
    _Towers.prototype.update = function () {
        if (this.towers !== null && this.towers.length > 0) {
            this.towers.forEach(function (e) { return e.update(); });
        }
    };
    return _Towers;
}());
//# sourceMappingURL=TowerSystem.js.map