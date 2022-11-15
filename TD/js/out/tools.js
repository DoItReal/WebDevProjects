//tools
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
function getRandomBoolean() {
    return Math.random() < 0.5;
}
class Timer {
    constructor() {
        this.dist = 0;
        this.startTime = null;
        this.pauseTime = null;
        this.timerOn = false;
    }
    on() {
        this.timerOn = true;
    }
    off() {
        this.timerOn = false;
    }
    setTimer() {
        if (this.startTime == null) {
            this.startTime = Date.now();
        }
        else {
            return (Date.now() - this.startTime);
        }
        return (Date.now() - this.startTime);
    }
    timerReset() {
        this.startTime = null;
    }
    update() {
        if (this.timerOn) {
            this.dist = this.setTimer();
        }
        else
            this.dist = 0;
    }
    getDist() {
        return this.dist;
    }
}
//# sourceMappingURL=tools.js.map