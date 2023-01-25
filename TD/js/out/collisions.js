function circleCollide(x1, y1, r1, x2, y2, r2) {
    const dx = x1 - x2;
    const dy = y1 - y2;
    return ((dx * dx + dy * dy) < (r1 + r2) * (r1 + r2));
}
/* TO DO POOL LIKE CIRCLE COLLISION AND MOVING
function distAlong(x, y, xAlong, yAlong)
{
return ((x * xAlong + y * yAlong) / Math.hypot(xAlong, yAlong));

}
function checkBallCollisions() {
    var towardsThem = distAlong(b.getMoveX(), b.getMoveY(), distX, distY);
    var towardsMe = distAlong(c.getMoveX(), c.getMoveY(), distX, distY);

    var myOrtho = distAlong(b.getMoveX(), b.getMoveY(), distY, -distX);
    var theirOrtho = distAlong(c.getMoveX(), c.getMoveY(), distY, -distX);

    b.setMove(towardsMe * distX + myOrtho * distY,
        towardsMe * distY + myOrtho * -distX);
    c.setMove(towardsThem * distX + theirOrtho * distY,
        towardsThem * distY + theirOrtho * -distX);
}
*/
// Collisions between aligned rectangles
function rectsOverlap(x1, y1, w1, h1, x2, y2, w2, h2) {
    if ((x1 > (x2 + w2)) || ((x1 + w1) < x2))
        return false; // No horizontal axis projection overlap
    if ((y1 > (y2 + h2)) || ((y1 + h1) < y2))
        return false; // No vertical axis projection overlap
    return true; // If previous tests failed, then both axis projections
    // overlap and the rectangles intersect
}
function circRectsOverlap(x0, y0, w0, h0, cx, cy, r) {
    let testX = cx;
    let testY = cy;
    if (testX < x0)
        testX = x0;
    if (testX > (x0 + w0))
        testX = (x0 + w0);
    if (testY < y0)
        testY = y0;
    if (testY > (y0 + h0))
        testY = (y0 + h0);
    return (((cx - testX) * (cx - testX) + (cy - testY) * (cy - testY)) < r * r);
}
function testCollisionWithWalls(ball, w, h, monster, ballArray) {
    //BALLS COLLISION CHECK
    //left collision check
    if (ball.x < ball.radius) {
        ball.x = ball.radius;
        ball.angle = -ball.angle + Math.PI;
    }
    //right collision check
    if (ball.x > w - ball.radius) {
        ball.x = w - ball.radius;
        ball.angle = -ball.angle + Math.PI;
    }
    //top collision check
    if (ball.y < ball.radius) {
        ball.y = ball.radius;
        ball.angle *= -1;
    }
    //down collision check
    if (ball.y > h - ball.radius) {
        ball.y = h - ball.radius;
        ball.angle *= -1;
    }
    //MONSTER COLLISION CHECK
    //left collision check
    if (monster.x < 0) {
        monster.x = 0;
    }
    //right collision check
    if (monster.x > w - monster.width) {
        monster.x = w - monster.width;
    }
    //top collision check
    if (monster.y < 0) {
        monster.y = 0;
    }
    //down collision check
    if (monster.y > h - monster.height) {
        monster.y = h - monster.height;
    }
    //circleCollision
    for (let i = 0; i < ballArray.length - 1; i++) {
        const tmp = ballArray[i];
        for (let j = i + 1; j < ballArray.length; j++) {
            const tmp2 = ballArray[j];
            if (circleCollide(tmp.x, tmp.y, tmp.radius, tmp2.x, tmp2.y, tmp2.radius)) {
                //        console.log('collision');
                tmp.angle = -tmp.angle + Math.PI;
                tmp2.angle = -tmp2.angle + Math.PI;
            }
        }
    }
}
//# sourceMappingURL=collisions.js.map