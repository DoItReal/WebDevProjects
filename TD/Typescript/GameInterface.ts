class Game {
    defaultSpeed: number = 150;
    preview:cord = null;
    animationID = null;
    play:boolean = false;
    pause:boolean = false;
    fps: FPS = new FPS();
    misslesInterface: _Missles;
    towersInterface: _Towers;
    enemyInterface: _Enemies;
    player: Player;
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
        this.player = new Player({x:100,y:100}, this.defaultSpeed);
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
        MainInterface.getScoreboard().getTimer().on();
    }
    stopGame() {
        this.play = false;
        this.player.cord = { x:100, y:100};
        MainInterface.getScoreboard().getTimer().timerReset();
        this.animationID = cancelAnimationFrame(this.animationID);
        this.pause = false;
        MainInterface.getScoreboard().getTimer().off();
    }
    playNow() {
        this.fps.update(performance.now());
        //clear Playground
        if (!this.pause) {
            MainInterface.update();
            if (!this.play) {
                cancelAnimationFrame(this.animationID);
                return 'Game Over';
            }
            //position the player
            //   this.player.move();

            //position the enemies
            this.enemyInterface.update();
            this.misslesInterface.update();
            this.towersInterface.update();
            this.visualisePreview();
            let tmp = MainInterface.getMouse();
            if (MainInterface.getPlayground().overlapping({ clientX: tmp.x, clientY: tmp.y })) {
                this.checkForOverlapingObjectsPlayground();
            }
          //  if (MainInterface.getPlayground() === document.activeElement) this.checkForOverlapingObjectsPlayground();
        }
        this.animationID = requestAnimationFrame(this.playNow);

    }
    hitCheck() { // TO DO

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
            obj.cord = { x: this.preview.x, y: this.preview.y};
            obj.draw(true);
        }
    }
    updatePreview(getX, getY) {
        if (MainInterface.clipboard != null) {
            this.preview = {
                x: getX, // to do
                y: getY
            }
        } else this.preview = null;
    }
    checkForOverlapingObjectsPlayground() {
        let obj = null;
        let rect = MainInterface.getPlayground().getCanvas().getBoundingClientRect();
        let enemies: Array<Enemy> = this.getEnemiesInterface().getEnemies();
        let mousePos: cord = MainInterface.getMouse();
        let mousePosR:cord = {
            x: mousePos.x - rect.left,
            y: mousePos.y - rect.top
        };

        //checking for overlaping enemies
        if (enemies && enemies.length > 0) {
            for (let i = 0; i < enemies.length; i++) {
                if (circRectsOverlap(enemies[i].cord.x-enemies[i].dim.w/2, enemies[i].cord.y-enemies[i].dim.h/2, enemies[i].dim.w, enemies[i].dim.h, mousePosR.x, mousePosR.y, 1)) {
                    obj = enemies[i];
                    if (!obj.getHighlight()) {
                        obj.setHighlight(true);
                    }
                    obj.tooltip(mousePosR);
                    return;
                }
                if (enemies[i].getHighlight()) enemies[i].setHighlight(false);
            }
        }

        //checking for overlaping towers
        let towers:Array<Tower> = this.getTowersInterface().getTowers();
        if (towers && towers.length > 0) {
            for (let i = 0; i < towers.length; i++) {
                if (circRectsOverlap(towers[i].cord.x-towers[i].dim.w/2, towers[i].cord.y-towers[i].dim.h/2, towers[i].dim.w, towers[i].dim.h, mousePosR.x, mousePosR.y, 1)) {
                    obj = towers[i];
                    if (!obj.getHighlight()) {
                        obj.setHighlight(true);
                    }
                    obj.tooltip(mousePosR);
                    return;
                }
                if (towers[i].getHighlight()) towers[i].setHighlight(false);
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
