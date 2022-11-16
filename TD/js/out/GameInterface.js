class Game {
    /*          Constructor()
     *
     *          For creating Game instance we need:
     *              1- Player ID - fetch info from DB - to do
     *
     *  creating new Player;
     *  binding this to playNow() - main animation function
     *
     *  TO DO
     *      1- Fetch Player from DB
     *
     */
    constructor() {
        this.defaultSpeed = 150;
        this.preview = null;
        this.animationID = null;
        this.play = false;
        this.pause = false;
        this.fps = new FPS();
        this.timer = new Timer();
        this.player = new Player({ x: 100, y: 100 }, this.defaultSpeed);
        this.playNow = this.playNow.bind(this);
        this.misslesInterface = new _Missles();
        this.towersInterface = new _Towers();
        this.enemyInterface = new _Enemies();
        //TO DO fetch the inventory from DB
        this.player.inventory.fill_inventory();
    }
    getMisslesInterface() {
        return this.misslesInterface;
    }
    getTowersInterface() {
        return this.towersInterface;
    }
    getEnemiesInterface() {
        return this.enemyInterface;
    }
    get getGame() { return this; }
    init() {
        this.fps.init();
    }
    startGame() {
        this.play = true;
        this.animationID = requestAnimationFrame(this.playNow);
        MainInterface.timer.on();
    }
    stopGame() {
        this.play = false;
        this.player.cord = { x: 100, y: 100 };
        MainInterface.timer.timerReset();
        this.animationID = cancelAnimationFrame(this.animationID);
        this.pause = false;
        MainInterface.timer.off();
    }
    playNow() {
        this.fps.update(performance.now());
        //clear Playground
        if (!this.pause) {
            MainInterface.update();
            MainInterface.timer.update();
            if (!this.play) {
                cancelAnimationFrame(this.animationID);
                return 'Game Over';
            }
            //position the player
            //   this.player.move();
            //position the enemies
            this.enemyInterface.update();
            this.towersInterface.update();
            this.misslesInterface.update();
            this.visualisePreview();
            this.checkForOverlapingObjectsPlayground();
        }
        this.animationID = requestAnimationFrame(this.playNow);
    }
    hitCheck() {
        /***********************************************************
         *   ___________________________________________________   *
         *  |  ###############################################  |  *
         *  |  ### Here goes the logic for collision check ###  |  *
         *  |  ###############################################  |  *
         *  |___________________________________________________|  *
         ***********************************************************/
        //check for player<--->enemy collision
        let enemies = this.getEnemiesInterface().getEnemies();
        if (enemies.length) {
            for (let i = 0; i < enemies.length; i++) {
                if (rectsOverlap(this.player.cord.x, this.player.cord.y, 80, 80, enemies[i].cord.x, enemies[i].cord.y, 40, 40) == true)
                    console.log('Collision');
            }
        }
    }
    visualisePreview() {
        if (MainInterface.clipboard != null && this.preview != null) {
            let obj = MainInterface.clipboard;
            obj.cord.x = this.preview.x; // this way we are chaning the values of the already existing object keeping the references to it 
            obj.cord.y = this.preview.y;
            //  obj.cord = { x: this.preview.x, y: this.preview.y};   // creates new object 
            obj.draw(true);
        }
    }
    updatePreview(getX, getY) {
        if (MainInterface.clipboard != null) {
            this.preview = {
                x: getX,
                y: getY
            };
        }
        else
            this.preview = null;
    }
    checkForOverlapingObjectsPlayground() {
        let tmp = MainInterface.getMouse();
        //  if (MainInterface.getPlayground() === document.activeElement) this.checkForOverlapingObjectsPlayground();
        if (!MainInterface.getPlayground().overlapping({ clientX: tmp.x, clientY: tmp.y }))
            return;
        let obj = null;
        let rect = MainInterface.getPlayground().getCanvas().getBoundingClientRect();
        let enemies = this.getEnemiesInterface().getEnemies();
        let mousePos = MainInterface.getMouse();
        let mousePosR = {
            x: mousePos.x - rect.left,
            y: mousePos.y - rect.top
        };
        //checking for overlaping enemies
        if (enemies && enemies.length > 0) {
            for (let i = 0; i < enemies.length; i++) {
                if (circRectsOverlap(enemies[i].cord.x - enemies[i].dim.w / 2, enemies[i].cord.y - enemies[i].dim.h / 2, enemies[i].dim.w, enemies[i].dim.h, mousePosR.x, mousePosR.y, 1)) {
                    enemies[i].mouseOver(mousePosR);
                    return;
                }
            }
        }
        //checking for overlaping towers
        let towers = this.getTowersInterface().getTowers();
        if (towers && towers.length > 0) {
            for (let i = 0; i < towers.length; i++) {
                if (circRectsOverlap(towers[i].cord.x - towers[i].dim.w / 2, towers[i].cord.y - towers[i].dim.h / 2, towers[i].dim.w, towers[i].dim.h, mousePosR.x, mousePosR.y, 1)) {
                    towers[i].mouseOver(mousePosR);
                    return;
                }
            }
        }
    }
    // We want the object to move at speed pixels/s (there are 60 frames in a second)
    // If we are really running at 60 frames/s, the delay between frames should be 1/60
    // = 16.66 ms, so the number of pixels to move = (speed * del)/1000. If the delay is twice
    // longer, the formula works : let's move the rectangle twice longer!
    calcDistanceToMove(speed) {
        //console.log("#delta = " + delta + " speed = " + speed);
        return (speed * this.fps.delta) / 1000;
    }
}
//# sourceMappingURL=GameInterface.js.map