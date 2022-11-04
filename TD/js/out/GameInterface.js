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
        MainInterface.getScoreboard().getTimer().on();
    }
    stopGame() {
        this.play = false;
        this.player.cord = { x: 100, y: 100 };
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
            //*Preview logic *  if (MainInterface.getPlayground === document.activeElement) this.checkForOverlapingObjectsPlayground();
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
            //   tower(this.preview.x, this.preview.y, MainInterface.clipboard.type.width, MainInterface.clipboard.type.height, MainInterface.clipboard.type.range, 30, 200, true);
            obj.cord = { x: this.preview.x, y: this.preview.y };
            obj.draw(true);
        }
    }
    updatePreview(getX, getY) {
        if (MainInterface.clipboard != null) {
            this.preview = {
                x: getX + 40,
                y: getY
            };
        }
        else
            this.preview = null;
    }
    checkForOverlapingObjectsPlayground() {
        let obj = null;
        let rect = MainInterface.getPlayground.getCanvas.getBoundingClientRect();
        let enemies = this.getEnemiesInterface().getEnemies();
        let mousePos = MainInterface.getMouse();
        let mousePosR = {
            x: mousePos.x - rect.left,
            y: mousePos.y - rect.top
        };
        if (enemies && enemies.length > 0) {
            for (let i = 0; i < enemies.length; i++) {
                if (circRectsOverlap(enemies[i].cord.x - 40, enemies[i].cord.y, enemies[i].dim.w, enemies[i].dim.h, mousePosR.x, mousePosR.y, 5)) {
                    obj = enemies[i];
                    obj.tooltip(mousePosR);
                    return;
                }
            }
        }
        let towers = this.getTowersInterface().getTowers();
        if (towers && towers.length > 0) {
            for (let i = 0; i < towers.length; i++) {
                if (circRectsOverlap(towers[i].cord.x - 40, towers[i].cord.y - 20, towers[i].dim.w, towers[i].dim.h, mousePosR.x, mousePosR.y, 5)) {
                    obj = towers[i];
                    obj.tooltip(mousePosR);
                    return;
                }
            }
        }
    }
}
//# sourceMappingURL=GameInterface.js.map