/*
// Woman object and sprites
// sprite index corresponding to posture
var WOMAN_DIR_RIGHT = 6;
var WOMAN_DIR_LEFT = 2;
class woman {
    x: 100,
    y: 200,
    width: 48,
    speed: 100, // pixels/s this time !
   // direction: WOMAN_DIR_RIGHT
}

function updateWomanPosition(delta, canvas) {

    // check collision on left or right
    if (((woman.x + woman.width) > canvas.width) || (woman.x < 0)) {
        // inverse speed
        woman.speed = -woman.speed;
    }

    /* // change sprite direction
    if (woman.speed >= 0) {
        woman.direction = WOMAN_DIR_RIGHT;
    } else {
        woman.direction = WOMAN_DIR_LEFT;
    }
    woman.x += game1.calcDistanceToMove(woman.speed);
}*/
/*---------------------------------------*/
/* SPRITE UTILITY FUNCTIONS              */
/*---------------------------------------*/
class SpriteImage{
    img;
    cord: cord;
    dim: dim;
    constructor(img, cord:cord, dim:dim) {

        this.img = img;  // the whole image that contains all sprites
        this.cord = cord;      // x, y position of the sprite image in the whole image
        this.dim = dim;   // width and height of the sprite image
    }
    // xPos and yPos = position where the sprite should be drawn,
    // scale = rescaling factor between 0 and 1
    draw  (ctx, cord:cord, scale,kX= -1,kY = 1) { 
        ctx.save();
        if (kX == -1) ctx.translate(this.dim.w*scale, 0);
        ctx.scale(kX, kY);
        ctx.translate((cord.x - (scale * this.dim.w / 2))*kX, (cord.y - (scale * this.dim.h / 2))*kY);
    //   console.log(MainInterface.getPlayground().getCanvas().width);
        ctx.drawImage(this.img,
            this.cord.x, this.cord.y, // x, y, width and height of img to extract
            this.dim.w, this.dim.h,
            0,0,     // x, y, width and height of img to draw
            this.dim.w * scale, this.dim.h * scale);
        

        ctx.restore();
    }
}

class Sprite {
    spriteArray: Array<SpriteImage>;
    currentFrame: number;
    delayBetweenFrames: number;
    scale: number;
    then: number;
    totalTimeSinceLastRedraw: number;
;
    constructor() {
        this.spriteArray = [];
        this.currentFrame = 0;
        this.delayBetweenFrames = 10;
        this.then = performance.now();
        this.totalTimeSinceLastRedraw = 0;
    }
    extractSprites (spritesheet, nbPostures, postureToExtract, nbFramesPerPosture,
        spriteDim:dim) {
        // number of sprites per row in the spritesheet
        var nbSpritesPerRow = Math.floor(spritesheet.width / spriteDim.w);

        // Extract each sprite
        var startIndex = (postureToExtract - 1) * nbFramesPerPosture;
        var endIndex = startIndex + nbFramesPerPosture;
        for (var index = startIndex; index < endIndex; index++) {
            // Computation of the x and y position that corresponds to the sprite
            // index
            // x is the rest of index/nbSpritesPerRow * width of a sprite
            let cord: cord = {x:0,y:0};
            cord.x = (index % nbSpritesPerRow) * spriteDim.w;
            // y is the divisor of index by nbSpritesPerRow * height of a sprite
            cord.y = Math.floor(index / nbSpritesPerRow) * spriteDim.h;

            // build a spriteImage object
            var s = new SpriteImage(spritesheet, cord, spriteDim);

            this.spriteArray.push(s);
        }
    }
   
    drawStopped(ctx, cord:cord,scale,kX, kY) {
        var currentSpriteImage = this.spriteArray[this.currentFrame];
        currentSpriteImage.draw(ctx, cord, scale, kX, kY);

    }
    draw(ctx, cord:cord, scale, kX, kY) {
        // Use time based animation to draw only a few images per second
        var now = performance.now();
        var delta = now - this.then;

        // draw currentSpriteImage
        var currentSpriteImage = this.spriteArray[this.currentFrame];
        // x, y, scale. 1 = size unchanged
        currentSpriteImage.draw(ctx, cord, scale,kX, kY);

        // if the delay between images is elapsed, go to the next one
        if (this.totalTimeSinceLastRedraw > this.delayBetweenFrames) {
            // Go to the next sprite image
            this.currentFrame++;
            this.currentFrame %= this.spriteArray.length;

            // reset the total time since last image has been drawn
            this.totalTimeSinceLastRedraw = 0;
        } else {
            // sum the total time since last redraw
            this.totalTimeSinceLastRedraw += delta;
        }

        this.then = now;
    }

    setNbImagesPerSecond (nb) {
        // delay in ms between images
        this.delayBetweenFrames = 1000 / nb;
    }
}
    /*---------------------------------------*/
/* END OF SPRITE UTILITY FUNCTIONS        */
/*---------------------------------------*/
