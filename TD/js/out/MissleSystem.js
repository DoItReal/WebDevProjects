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
// Missle Interface includes all Missle methods 
var Missle = /** @class */ (function () {
    function Missle() {
        if (this.constructor === Missle) {
            throw new Error("Abstract classes can't be instantiated.");
        }
        this.dim = { w: 0, h: 0 };
    }
    Missle.prototype.setTarget = function (target) {
        this.target = target;
    };
    Object.defineProperty(Missle.prototype, "getDmgDone", {
        get: function () {
            return Missle.dmgDone;
        },
        enumerable: false,
        configurable: true
    });
    Missle.prototype.addDmg = function (dmg) {
        Missle.dmgDone += dmg;
    };
    Missle.prototype.update = function () {
        this.move(); //update cordinates and update/draw the texture
        if (this.collision_check()) {
            this.hit();
        }
    };
    Missle.prototype.move = function () {
        var fps = game1.fps.fps;
        if (this.cord.x < this.target.cord.x)
            this.cord.x += this.speed / fps;
        else if (this.cord.x > this.target.cord.x)
            this.cord.x -= this.speed / fps;
        if (this.cord.y < this.target.cord.y)
            this.cord.y += this.speed / fps;
        else if (this.cord.y > this.target.cord.y)
            this.cord.y -= this.speed / fps;
        this.draw();
    };
    Missle.prototype.collision_check = function () {
        return rectsOverlap(this.cord.x, this.cord.y, this.dim.w, this.dim.h, this.target.cord.x, this.target.cord.y, this.target.dim.w, this.target.dim.h);
    };
    Missle.prototype.hit = function () {
        this.addDmg(this.target.receiveDmg(this.dmg)); // *** TO TEST IT! ***
        this.destroy();
    };
    Missle.prototype.destroy = function () {
        this.status = "death";
        this.destroy_texture();
    };
    Missle.prototype.draw = function () {
        var ctx = MainInterface.getPlayground().getContext();
        ctx.save();
        ctx.beginPath();
        ctx.translate(this.cord.x, this.cord.y);
        ctx.lineWidth = this.dim.w;
        ctx.strokeStyle = this.color;
        ctx.moveTo(0, 0);
        ctx.lineTo(0, this.dim.h);
        ctx.stroke();
        ctx.restore();
    };
    Missle.prototype.destroy_texture = function () {
        this.draw(); // TO DO
    };
    Missle.dmgDone = 0;
    return Missle;
}());
var amm_stone = /** @class */ (function (_super) {
    __extends(amm_stone, _super);
    function amm_stone(cord, target) {
        var _this = _super.call(this) || this;
        _this.cord = cord; //asigning starting cordinates at creation
        _this.dim.w = 5;
        _this.dim.h = 5;
        _this.name = "Stone";
        _this.dmg = 1;
        _this.speed = 80;
        _this.target = target; //asigning target for seeking
        _this.status = "alive";
        _this.color = "lightgray";
        return _this;
    }
    return amm_stone;
}(Missle));
// _Missles Interface - includes all active missles and responds for their operations 
var _Missles = /** @class */ (function () {
    function _Missles() {
        this.missles = [];
    }
    _Missles.prototype.addMissle = function (missle) {
        this.missles.push(missle);
    };
    _Missles.prototype.update = function () {
        if (this.missles !== null && this.missles.length > 0) {
            for (var i = 0; i < this.missles.length; i++) {
                if (this.missles[i].status === "alive")
                    this.missles[i].update();
                else {
                    this.removeMissle(i);
                    i -= 1;
                }
            }
        }
    };
    _Missles.prototype.removeMissle = function (ind) {
        this.missles.splice(ind, 1);
    };
    _Missles.prototype.reportDmg = function () {
        console.log(Missle.dmgDone);
    };
    return _Missles;
}());
//# sourceMappingURL=MissleSystem.js.map