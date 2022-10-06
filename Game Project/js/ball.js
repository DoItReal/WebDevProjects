// Constructor function for balls
function Ball(x, y, angle, v, diameter) {
    // property of each ball: a x and y position, speeds, radius
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.v = v;
    this.radius = diameter / 2;
    this.color = 'black';
    // methods
    this.draw = function (ctx) {
        ctx.beginPath();
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();
    };
    this.move = function () {
        // add horizontal increment to the x pos
        // add vertical increment to the y pos
        this.x += this.v * Math.cos(this.angle);
        this.y += this.v * Math.sin(this.angle);
    };
}