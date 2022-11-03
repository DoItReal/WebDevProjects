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
var Enemy = /** @class */ (function () {
    function Enemy() {
        if (this.constructor === Enemy) {
            throw new Error("Abstract classes can't be instantiated.");
        }
        this.dim = { w: 0, h: 0 };
    }
    Enemy.prototype.update = function () {
        if (this.way && this.way.length > 0)
            this.move();
    };
    Enemy.prototype.move = function () {
        var fps = game1.fps.fps;
        var tmp = { x: this.cord.x, y: this.cord.y };
        var speedR = this.calcSpeed(this.cord, this.way[0]);
        if ((this.cord.x + speedR.speedX / fps) < this.way[0].x)
            this.cord.x += speedR.speedX / fps;
        if ((this.cord.y + speedR.speedY / fps) < this.way[0].y)
            this.cord.y += speedR.speedY / fps;
        if (tmp.x == this.cord.x && tmp.y == this.cord.y)
            this.way.splice(0, 1);
        this.draw();
    };
    Enemy.prototype.calcSpeed = function (cord1, cord2) {
        var dx = cord2.x - cord1.x;
        var dy = cord2.y - cord1.y;
        var c = Math.sqrt((Math.pow(dx, 2) + Math.pow(dy, 2)));
        var sin = dx / c;
        var cos = dy / c;
        return { speedX: (sin * this.speed), speedY: (cos * this.speed) };
    };
    Enemy.prototype.draw = function () {
        var ctx = MainInterface.getPlayground().getContext();
        ctx.save();
        ctx.translate(this.cord.x, this.cord.y);
        ctx.fillStyle = "red";
        ctx.fillRect(0, 0, this.dim.w, this.dim.h);
        ctx.fillStyle = "white";
        ctx.fillRect(this.dim.w / 5.33, this.dim.h / 4, this.dim.w / 4, this.dim.h / 4);
        ctx.fillRect(this.dim.w / 1.6, this.dim.h / 4, this.dim.w / 4, this.dim.h / 4);
        ctx.fillStyle = "blue";
        ctx.fillRect(this.dim.w / 4.2, this.dim.h / 3.33, this.dim.w / 6.66, this.dim.h / 6.66);
        ctx.fillRect(this.dim.w / 1.48, this.dim.h / 3.33, this.dim.w / 6.66, this.dim.h / 6.66);
        ctx.fillStyle = "black";
        ctx.fillRect(this.dim.w / 3.63, this.dim.h / 2.96, this.dim.w / 13.33, this.dim.h / 13.66);
        ctx.fillRect(this.dim.w / 1.4, this.dim.h / 2.96, this.dim.w / 13.33, this.dim.h / 13.66);
        ctx.restore();
    };
    Enemy.prototype.receiveDmg = function (dmg) {
        console.log(this);
        var receivedDmg = dmg;
        this.hp -= dmg;
        if (this.hp <= 0)
            this.destroy();
        return receivedDmg;
    };
    Enemy.prototype.destroy = function () {
        console.log(this.name + " lvl:" + this.lvl + " KO");
        game1.getEnemiesInterface().removeEnemy(this);
        // TO DO
    };
    Enemy.prototype.tooltip = function (mousePosR) {
        var ctx = MainInterface.getPlayground().getContext();
        var canvas = MainInterface.getPlayground();
        var w = 120; //width of the tooltip
        var h = 50; //height of the tooltip
        ctx.save();
        if (mousePosR.x + w > canvas.width)
            mousePosR.x = canvas.width - w;
        if (mousePosR.y + h > canvas.height)
            mousePosR.y = canvas.height - h;
        ctx.translate(mousePosR.x, mousePosR.y);
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = "lightblue";
        ctx.strokeStyle = "white";
        ctx.fillRect(0, 0, w, h);
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.7;
        ctx.strokeRect(0, 0, w, h);
        ctx.globalAlpha = 1;
        ctx.fillStyle = "white";
        ctx.font = "20px Roboto";
        ctx.fillText(this.name + ' lvl ' + this.lvl, 10, 30);
        ctx.restore();
    };
    return Enemy;
}());
var enemy_Peon = /** @class */ (function (_super) {
    __extends(enemy_Peon, _super);
    function enemy_Peon(cord, way) {
        var _this = _super.call(this) || this;
        _this.cord = cord;
        _this.dim.w = 40;
        _this.dim.h = 40;
        _this.way = way;
        _this.name = "Peon";
        _this.speed = 60;
        _this.hp = 10;
        _this.dmg = 1;
        _this.lvl = 1;
        return _this;
    }
    return enemy_Peon;
}(Enemy));
var _Enemies = /** @class */ (function () {
    function _Enemies() {
        this.enemies = [];
    }
    _Enemies.prototype.addEnemy = function (enemy) {
        this.enemies.push(enemy);
    };
    _Enemies.prototype.removeEnemy = function (ind) {
        if (typeof ind === "number") {
            this.enemies.splice(ind, 1);
        }
        else { // typeof ind === enemy
            if (this.enemies !== null && this.enemies.length > 0) {
                for (var i = 0; i < this.enemies.length; i++) {
                    if (this.enemies[i] === ind) {
                        this.removeEnemy(i);
                        return;
                    }
                }
            }
        }
    };
    _Enemies.prototype.update = function () {
        if (this.enemies !== null && this.enemies.length > 0) {
            this.enemies.forEach(function (e) { return e.update(); });
        }
    };
    _Enemies.prototype.getEnemies = function () {
        return this.enemies;
    };
    return _Enemies;
}());
//# sourceMappingURL=EnemySystem.js.map