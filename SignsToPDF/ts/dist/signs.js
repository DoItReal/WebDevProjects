"use strict";
class Sign {
    constructor(w, h) {
        this.border = 5;
        this.fontSize = 18;
        this.id = undefined;
        this.width = w;
        this.height = h;
        this.content = undefined;
        this.canvas = document.createElement('canvas');
        this.canvas.width = w;
        this.canvas.height = h;
        this.ctx = this.canvas.getContext('2d');
        this.ctx.textAlign = "center";
        this.category = [];
    }
    setContent(content) {
        this.content = content;
    }
    addCategory(cat) {
        if (!this.category.includes(cat))
            this.category.push(cat);
    }
    removeCategory(cat) {
        if (this.category.includes(cat))
            this.category.splice(this.category.indexOf(cat), 1);
    }
    setBorder(num) {
        this.border = num;
    }
    setId(id) {
        this.id = id;
    }
    getId() {
        return this.id;
    }
    generate() {
        let arr = this.content.alergens;
        let rows = [this.content.name.bg, this.content.name.en, this.content.name.de, this.content.name.rus];
        this.ctx.save();
        //border
        this.ctx.strokeStyle = "black";
        this.ctx.lineWidth = this.border;
        this.ctx.fillStyle = "white";
        this.ctx.fillRect(0, 0, this.width, this.height);
        this.ctx.strokeRect(0, 0, this.width, this.height);
        this.generateInfoLabelsText(rows);
        this.generateAllergens(arr);
        this.ctx.restore();
        // var image: HTMLImageElement = document.createElement('HTMLImageElement');
        //image.src = this.canvas.toDataURL('image/jpeg');
        return this.canvas;
    }
    generateInfoLabelsText(rows) {
        let color = ['black', 'red'];
        let counter = 0;
        for (let i = 0; i < rows.length; i++) {
            let step = this.fontSize * 1.5;
            let x = this.width / 2;
            let y = step * (i + 1) + this.height * 0.3;
            this.ctx.font = 'bold ' + this.fontSize + "px sans-serif";
            this.txtCalibrateCenter(rows[i]);
            step = this.fontSize * 1.5;
            this.ctx.fillStyle = color[counter];
            this.ctx.fillText(rows[i], x, y);
            if (counter >= 1)
                counter = 0;
            else
                counter++;
        }
    }
    generateAllergens(arr) {
        if (arr.length == 1 && arr[0] == 0)
            return;
        let saveFont = this.fontSize;
        //calibrate and set this.fontSize
        this.imgCalibrate(arr);
        this.fontSize *= 2;
        let dim = this.imgCenter(arr);
        let dx = this.fontSize / 2 + dim.x;
        //  let dy = this.border+this.fontSize;
        let dy = dim.y;
        let dWidth = this.fontSize;
        let dHeight = this.fontSize;
        for (let i = 0; i < arr.length; i++) {
            this.ctx.font = this.fontSize + "px sans-serif";
            this.ctx.fillStyle = "blue";
            this.ctx.fillText(String(arr[i]), dx, dy + this.fontSize * 0.9);
            this.ctx.drawImage(pngs[Number(arr[i] - 1)], dx + this.fontSize / 2, dy, dWidth, dHeight);
            dx += this.fontSize * 2;
        }
        this.fontSize = saveFont;
    }
    imgCalibrate(arr) {
        let txtSize = this.fontSize;
        let wholeSize = arr.length * txtSize * 4;
        while (wholeSize > this.width - (20)) {
            txtSize--;
            wholeSize = arr.length * txtSize * 4;
        }
        this.fontSize = txtSize;
    }
    imgCenter(arr) {
        let txtSize = this.fontSize;
        let wholeSize = arr.length * txtSize * 4 / 2;
        let dx = txtSize * 4 / 2;
        if (this.width > wholeSize)
            dx = (this.width - wholeSize) / 2;
        else
            dx = (wholeSize - this.width) / 2;
        let dy = this.fontSize * 1.5 + this.height * 0.25;
        dy = (dy - this.border) / 2 - this.fontSize;
        return { x: dx, y: dy };
    }
    txtCalibrateCenter(txt) {
        let textSize = this.fontSize;
        while (this.ctx.measureText(txt).width > this.width - 10) {
            textSize--;
            this.ctx.font = textSize + "px sans-serif";
        }
    }
}
class SignContent {
    //   pngFiles: string[];
    // pngs: Array<HTMLImageElement> = [];
    constructor(alergens, name) {
        this.alergens = alergens;
        this.name = name;
    }
}
