class Game {
    preview:cord = null;
    animationID = null;
    play:boolean = false;
    pause:boolean = false;
    fps: FPS = new FPS();
    timer: Timer = new Timer();
    misslesInterface: _Missles;
    towersInterface: _Towers;
    enemyInterface: _Enemies;
    player: Player;
    currentWave: Wave = null;
    currentLevel: Level = null;
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
        this.player = new Player();
        this.playNow = this.playNow.bind(this);
        this.misslesInterface = new _Missles();
        this.towersInterface = new _Towers();
        this.enemyInterface = new _Enemies();
        //TO DO fetch the inventory from DB
        this.player.inventory.fill_inventory();

    }
        //public methods
    //getters
    getMisslesInterface() {
        return this.misslesInterface;
    }
    getTowersInterface() {
        return this.towersInterface;
    }
    getEnemiesInterface() {
        return this.enemyInterface;
    }
    getCurrentWave() {
        return this.currentWave;
    }
    getPlayer() {
        return this.player;
    }
    getLevel() {
        return this.currentLevel;
    }
    //setters
    setLevel(level: Level) {
        this.currentLevel = level;
        this.currentLevel.init();
    }
    setWave(wave: Wave) {
        if (this.currentWave == null || this.currentWave.getActive() === false) { //if no Wave or the current Wave finished
            this.currentWave = wave;
            this.currentWave.init_wave();
        } else {
            console.log("Error: Already have active current wave");
        }
    }

    //***
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
            //position the enemies
            if (this.currentWave !== null && (this.currentWave.getActive() || this.currentWave.checkAlive())) this.currentWave.draw(); // drawing only if there are still units to spawn
            else this.currentWave = null;

            if (this.currentLevel != null) {
                this.player.update();
                this.enemyInterface.update();
                this.towersInterface.update();
                this.misslesInterface.update();
                this.visualisePreview();

                this.checkForOverlapingObjectsPlayground();
            }
        }

        this.animationID = requestAnimationFrame(this.playNow);
    }
    GameOver() {
        this.stopGame();
        alert('Game Over');
    }
    updatePreview(getX, getY) {
        if (MainInterface.clipboard != null) {
            this.preview = {
                x: getX, // to do
                y: getY
            }
        } else this.preview = null;
    }
    // We want the object to move at speed pixels/s (there are 60 frames in a second)
    // If we are really running at 60 frames/s, the delay between frames should be 1/60
    // = 16.66 ms, so the number of pixels to move = (speed * del)/1000. If the delay is twice
    // longer, the formula works : let's move the rectangle twice longer!
    calcDistanceToMove(speed) {
        //console.log("#delta = " + delta + " speed = " + speed);
        return (speed * this.fps.delta) / 1000;
    }

        //private methods
   private visualisePreview() {
        if (MainInterface.clipboard != null && this.preview != null) {
            let obj = MainInterface.clipboard;
            obj.cord.x = this.preview.x;        // this way we are chaning the values of the already existing object keeping the references to it 
            obj.cord.y = this.preview.y;
          //  obj.cord = { x: this.preview.x, y: this.preview.y};   // creates new object 
            obj.draw(true);
        }
    }
   private checkForOverlapingObjectsPlayground() {
        let tmp = MainInterface.getMouse();
        if (!MainInterface.getPlayground().overlapping({ clientX: tmp.x, clientY: tmp.y })) return;
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
                    enemies[i].mouseOver(mousePosR);
                    return;
                }
            }
        }

        //checking for overlaping towers
        let towers:Array<Tower> = this.getTowersInterface().getTowers();
        if (towers && towers.length > 0) {
            for (let i = 0; i < towers.length; i++) {
                if (circRectsOverlap(towers[i].cord.x-towers[i].dim.w/2, towers[i].cord.y-towers[i].dim.h/2, towers[i].dim.w, towers[i].dim.h, mousePosR.x, mousePosR.y, 1)) {
                    towers[i].mouseOver(mousePosR);
                    return;
                }
            }
        }
    }

}
