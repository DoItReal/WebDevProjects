// vars for counting frames/s, used by the measureFPS function
class FPS {
    frameCount: number;
    lastTime: number;
    fpsContainer: HTMLDivElement;
    fps: number;
    oldTime: number;
    delta: number;

    constructor() {
        this.frameCount = 0;
        this.lastTime = null;
        this.fpsContainer = null;
        this.fps = null;
        this.oldTime = null;
        this.delta = 0;
    }
    init() {
        this.oldTime = performance.now();
        this.initFPSCounter();
    }
update (time) {
    this.measureFPS(time);
    this.delta = this.timer(time);
}
measureFPS (newTime) {
    // test for the very first invocation
    if (this.lastTime === undefined) {
        this.lastTime = newTime;
        return;
    }
    //calculate the difference between last & current frame
    let diffTime = newTime - this.lastTime;

    if (diffTime >= 1000) {
        this.fps = this.frameCount;
        this.frameCount = 0;
        this.lastTime = newTime;
    }
    //and display it in an element we appended to the 
    // document in the start() function
    if(this.fps || this.fps == 0)this.fpsContainer.innerHTML = 'FPS: ' + this.fps;
    this.frameCount++;
};

initFPSCounter () {
    // adds a div for displaying the fps value
    this.fpsContainer = document.createElement('div');
    this.fpsContainer.id = 'fpsContainer';
    divControlPanel.appendChild(this.fpsContainer);
    }
    // High resolution timer
timer(currentTime) {
    let delta = currentTime - this.oldTime;
    this.oldTime = currentTime;
    return delta;

}


}