var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var canv;
var ctx;
var sign;
window.onload = function init() {
    canv = document.getElementById('myCanvas');
    ctx = canv.getContext('2d');
    init_canvas();
    createPDF();
};
/* 0 (��������)
 * ������� ������� (bulgarian)
 * �������� ���    (russian)
 * French Fries    (english)
 * kartofeln kaput (german)
 *
 * */
class Sign {
    constructor(w, h) {
        this.width = w;
        this.height = h;
        this.content = undefined;
        this.canvas = document.createElement('canvas');
        this.canvas.width = w;
        this.canvas.height = h;
        this.ctx = this.canvas.getContext('2d');
    }
    setContent(content) {
        this.content = content;
    }
    generate() {
        let rows = [this.content.alergens, this.content.name.bg, this.content.name.en, this.content.name.de, this.content.name.rus];
        this.ctx.save();
        let step = this.height / rows.length - 20;
        for (let i = 0; i < rows.length; i++) {
            let x = this.width / 20;
            let y = step * (i + 1);
            this.ctx.font = "20px sans-serif";
            this.ctx.fillStyle = "blue";
            this.ctx.fillText(rows[i], x, y);
        }
        this.ctx.restore();
    }
}
class SignContent {
    constructor(alergens, name) {
        this.alergens = alergens;
        this.name = name;
    }
}
function createPDF() {
    return __awaiter(this, void 0, void 0, function* () {
        //creates new PDF Document
        const doc = yield PDFLib.PDFDocument.create();
        //adds page to just created PDF Document
        /*          Method doc.addPage(pageSize(w,h))
         * 1 - (w,h) < <number>, <number> >  ... doc.addPage(700,800);
         * 2 - (PageSizes.*) ... doc.addPage(PageSizes.A4);
         * 3
         * */
        const page = doc.addPage(PDFLib.PageSizes.A4);
        sign = new Sign(290, 280);
        sign.setContent(new SignContent("1, 2, 6, 9", { bg: decodeURI("%D0%9F%D1%8A%D1%80%D0%B6%D0%B5%D0%BD%D0%B8%20%D0%9A%D0%B0%D1%80%D1%82%D0%BE%D1%84%D0%B8"), en: "French Fries", de: "deutsch", rus: decodeURI("%D0%9A%D0%B0%D1%80%D1%82%D0%BE%D1%88%D0%BA%D0%B8%20%D0%A4%D1%80%D0%B8") }));
        sign.generate();
        //creates JPEG image from canvas 
        var jpgImage = yield doc.embedJpg(sign.canvas.toDataURL('image/jpeg'));
        document.body.appendChild(sign.canvas);
        //draws just created JPEG image to the page
        page.drawImage(jpgImage, {
            x: 0,
            y: 0,
            width: sign.width,
            height: sign.height
        });
        //saving the PDF doc as dataUri
        const pdfDataUri = yield doc.saveAsBase64({ dataUri: true });
        //adding the PDF document ot the DOM
        var framePDF = document.getElementById('pdf');
        framePDF.src = pdfDataUri;
    });
}
//Creating content for printing
function init_canvas() {
    ctx.save();
    ctx.beginPath();
    ctx.translate(0, 0);
    ctx.fillStyle = "cyan";
    ctx.rect(0, 0, 120, 25);
    ctx.fill();
    ctx.beginPath();
    ctx.font = "20px Helvetica bold italic";
    ctx.fillStyle = "black";
    ctx.fillText("Missle War", 15, 20);
    ctx.fillStyle = "green";
    ctx.fillRect(0, 25, 120, 40);
    ctx.font = "25px Arial bold";
    ctx.fillStyle = "black";
    ctx.fillText("The Game!", 5, 55);
    ctx.restore();
}
//# sourceMappingURL=script.js.map