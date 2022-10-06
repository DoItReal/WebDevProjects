// Inits
window.onload = function init() {
    var game = new GF();
  //  game.start();
    
    // initDragAndDrop();
    init_indexedDB();
};


// GAME FRAMEWORK STARTS HERE
var GF = function () {
    // Vars relative to the canvas
    var canvas, ctx, w, h;

    // High resolution timer
    var oldTime = performance.now();

    var inputStates = {};
   
    var monster = {
        width: 100,
        height: 100,
        x: 10,
        y: 10,
        speed: 100,
        boundingCircleRadius: w/2,
        radiusX: this.x + w / 2,
        radiusY: this.y - h / 2
    }
    var player = {
        x: 0,
        y: 0,
        boundingCircleRadius: 20
    };
   
    // clears the canvas content
    function clearCanvas() {
        ctx.clearRect(0, 0, w, h);
    }
    var ballArray = [];

    function checkCollisions() {
        // Bounding rect position and size for the player. We need to translate
        // it to half the player's size
        var playerSize = player.boundingCircleRadius;
        var playerXBoundingRect = player.x - playerSize / 2;
        var playerYBoundingRect = player.y - playerSize / 2;
        // Same with the monster bounding rect
        var monsterXBoundingRect = monster.x;
        var monsterYBoundingRect = monster.y;

        if (rectsOverlap(playerXBoundingRect, playerYBoundingRect,
            playerSize, playerSize,
            monsterXBoundingRect, monsterYBoundingRect,
            monster.width, monster.height)) {
            ctx.save();
            ctx.fillStyle = 'red';
            ctx.fillText("Collision", 150, 20);
            ctx.restore();
        } else {
            ctx.save();
            ctx.fillStyle = 'black';
            ctx.fillText("No collision", 150, 20);
            ctx.restore();
        }
    }

    function createBalls(numberOfBalls) {
        for (var i = 0; i < numberOfBalls; i++) {
            // Create a ball with random position and speed.
            // You can change the radius
            var ball = new Ball(w * Math.random(),
                h * Math.random(),
                (2 * Math.PI) * Math.random(), // angle
                    (10 * Math.random()) - 5,      // speed
                30);
            // add the ball to the array
            ballArray[i] = ball;
        }
    }
    // Functions for drawing the monster and maybe other objects
    function drawMyMonster(monster) {
        // draw a big monster !
        // head
        var x = monster.x;
        var y = monster.y;
        var w = monster.width;
        var h = monster.height;
        // save the context
        ctx.save();

        // translate the coordinate system, draw relative to it
        ctx.translate(x, y);

        // (0, 0) is the top left corner of the monster.
        ctx.strokeRect(0, 0, w, h);

        //100

        // eyes
        ctx.fillRect(20 * w / 100, 20 * w / 100, 10 * w / 100, 10 * w / 100);
        ctx.fillRect(65 * w / 100, 20 * w / 100, 10 * w / 100, 10 * w / 100);

        // nose
        ctx.strokeRect(45 * w / 100, 40 * w / 100, 10 * w / 100, 40 * w / 100);

        // mouth
        ctx.strokeRect(35 * w / 100, 84 * w / 100, 30 * w / 100, 10 * w / 100);

        // teeth
        ctx.fillRect(38 * w / 100, 84 * w / 100, 10 * w / 100, 10 * w / 100);
        ctx.fillRect(52 * w / 100, 84 * w / 100, 10 * w / 100, 10 * w / 100);

        // restore the context
        ctx.restore();
    }

    function timer(currentTime) {
        var delta = currentTime - oldTime;
        oldTime = currentTime;
        return delta;

    }

    var mainLoop = function (time) {
         //main functions, called each frame 
        measureFPS(time);
        delta = timer(time);

        // Clear the canvas
        clearCanvas();

        //check gamepad status
        updateGamePadStatus();

        // draw the monster
        drawMyMonster(monster);
        
        // update and draw balls
        checkCollisions();
        updateBalls(delta);
        updatePlayer(delta);
        womanSprites[woman.direction].draw(ctx, woman.x, woman.y);
        updateWomanPosition(delta, canvas);
        // check inputStates
        updateMonsterPosition(delta);
        // call the animation loop every 1/60th of second
        requestAnimationFrame(mainLoop);
    };

    function updateBalls(delta) {
        // for each ball in the array
        for (var i = 0; i < ballArray.length; i++) {
            var ball = ballArray[i];
            // 1) move the ball
            ball.move();
            // 2) test if the ball collides with a wall
            testCollisionWithWalls(ball, w, h, monster, ballArray);

            // Test if the monster collides
            if (circRectsOverlap(monster.x, monster.y,
                monster.width, monster.height,
                ball.x, ball.y, ball.radius)) {

                //change the color of the ball
                ball.color = 'red';
            } else ball.color = 'black';
            // 3) draw the ball
            ball.draw(ctx);
        }
    }
    function updatePlayer(delta) {
        // The player is just a square drawn at the mouse position
        // Just to test rectangle/rectangle collisions.

        if (inputStates.mousePos) {
            player.x = inputStates.mousePos.x;
            player.y = inputStates.mousePos.y;

            // draws a rectangle centered on the mouse position
            // we draw it as a square.
            // We remove size/2 to the x and y position at drawing time in
            // order to recenter the rectangle on the mouse pos (normally
            // the 0, 0 of a rectangle is at its top left corner)
            var size = player.boundingCircleRadius;
            ctx.fillRect(player.x - size / 2, player.y - size / 2, size, size);
        }
    }
    function updateMonsterPosition(delta) {
        monster.speedX = monster.speedY = 0;
        // Checks inputStates
        if (inputStates.left) {
            ctx.fillText("left", 150, 20);
            monster.speedX = -monster.speed;
        }
        if (inputStates.up) {
            ctx.fillText("up", 150, 40);
            monster.speedY = -monster.speed;
        }
        if (inputStates.right) {
            ctx.fillText("right", 150, 60);
            monster.speedX = monster.speed;
        }
        if (inputStates.down) {
            ctx.fillText("down", 150, 80);
            monster.speedY = monster.speed;
        }
        if (inputStates.space) {
            ctx.fillText("space bar", 140, 100);
        }
        if (inputStates.mousePos) {
            ctx.fillText("x = " + inputStates.mousePos.x + " y = " +
                inputStates.mousePos.y, 5, 150);
        }
        if (inputStates.mousedown) {
            ctx.fillText("mousedown b" + inputStates.mouseButton, 5, 180);
            monster.speed = 500;
        } else {
            // Mouse up
            monster.speed = 100;
        }
        //moving the monster on mousePos
        /* if (inputStates.mousePos) {
            ctx.fillText("x = " + inputStates.mousePos.x + " y = " +
                inputStates.mousePos.y, 5, 150);
            if (monster.x - inputStates.mousePos.x < 0) {
                monster.x += monster.speed;
            } else if (monster.x - inputStates.mousePos.x > 0) {
                monster.x -= monster.speed;
            }
            if (monster.y - inputStates.mousePos.y < 0) {
                monster.y += monster.speed;
            } else if (monster.y - inputStates.mousePos.y > 0) {
                monster.y -= monster.speed;
            }
            */
        monster.x += calcDistanceToMove(delta, monster.speedX);
        monster.y += calcDistanceToMove(delta, monster.speedY);
    }
    // test gamepad status: buttons, joysticks etc.

    var loadAssets = function (callback) {
        var SPRITESHEET_URL = "http://i.imgur.com/3VesWqx.png";
        var SPRITE_WIDTH = 48;
        var SPRITE_HEIGHT = 92;
        var NB_POSTURES = 8;
        var NB_FRAMES_PER_POSTURE = 13;

        // load the spritesheet
        var spritesheet = new Image();
        spritesheet.src = SPRITESHEET_URL;

        // Called when the spritesheet has been loaded
        spritesheet.onload = function () {

            // Create woman sprites
            for (var i = 0; i < NB_POSTURES; i++) {
                var sprite = new Sprite();

                sprite.extractSprites(spritesheet, NB_POSTURES, (i + 1),
                    NB_FRAMES_PER_POSTURE,
                    SPRITE_WIDTH, SPRITE_HEIGHT);
                sprite.setNbImagesPerSecond(20);
                womanSprites[i] = sprite;
            }
            // call the callback function passed as a parameter, 
            // we're done with loading assets and building the sprites
            callback();
        };
    };

    var start = function () {
        initFPSCounter();

        // Canvas, context etc.
        canvas = document.getElementById('myCanvas');

        // often useful
        w = canvas.width;
        h = canvas.height;

        // important, we will draw with this object
        ctx = canvas.getContext('2d');

        addListeners(inputStates, canvas);
        initGamepad(inputStates);
        initWebAudio();

        // start the animation
        createBalls(3);
        loadAssets(function () {
            // when enter here only when all assets have been loaded
            requestAnimationFrame(mainLoop);
        });
    };

    //our GameFramework returns a public API visible from outside its scope
    return {
        start: start
    };
};

