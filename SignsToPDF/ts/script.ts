var pngs: Array<HTMLImageElement> = new Array<HTMLImageElement>;
var signs: Array<URL> = [];

const data = [
    { bg: "%D0%9F%D1%8A%D1%80%D0%B6%D0%B5%D0%BD%D0%B8%20%D0%9A%D0%B0%D1%80%D1%82%D0%BE%D1%84%D0%B8", en: 'Translation 1 + some very very very very long text', numbers: [1, 2, 3, 4, 5, 6, 7, 8] },
    { bg: "%D0%9F%D1%8A%D1%80%D0%B6%D0%B5%D0%BD%D0%B8%20%D0%9A%D0%B0%D1%80%D1%82%D0%BE%D1%84%D0%B8", en: 'Translation 2', numbers: [1] },
    { bg: "%D0%9F%D1%8A%D1%80%D0%B6%D0%B5%D0%BD%D0%B8%20%D0%9A%D0%B0%D1%80%D1%82%D0%BE%D1%84%D0%B8", en: 'Translation 3', numbers: [1, 2] },
    { bg: "%D0%9F%D1%8A%D1%80%D0%B6%D0%B5%D0%BD%D0%B8%20%D0%9A%D0%B0%D1%80%D1%82%D0%BE%D1%84%D0%B8", en: 'Translation 4', numbers: [1, 2, 3] },
    { bg: "%D0%9F%D1%8A%D1%80%D0%B6%D0%B5%D0%BD%D0%B8%20%D0%9A%D0%B0%D1%80%D1%82%D0%BE%D1%84%D0%B8", en: 'Translation 5', numbers: [1, 2, 3, 4] },
    { bg: "%D0%9F%D1%8A%D1%80%D0%B6%D0%B5%D0%BD%D0%B8%20%D0%9A%D0%B0%D1%80%D1%82%D0%BE%D1%84%D0%B8", en: 'Translation 6', numbers: [1, 2, 3, 4, 5] },
    { bg: "%D0%9F%D1%8A%D1%80%D0%B6%D0%B5%D0%BD%D0%B8%20%D0%9A%D0%B0%D1%80%D1%82%D0%BE%D1%84%D0%B8", en: 'Translation 7', numbers: [] },
    { bg: "%D0%9F%D1%8A%D1%80%D0%B6%D0%B5%D0%BD%D0%B8%20%D0%9A%D0%B0%D1%80%D1%82%D0%BE%D1%84%D0%B8", en: 'Translation 8', numbers: [1, 2, 3, 4, 5, 6, 7, 8] },
    { bg: "%D0%9F%D1%8A%D1%80%D0%B6%D0%B5%D0%BD%D0%B8%20%D0%9A%D0%B0%D1%80%D1%82%D0%BE%D1%84%D0%B8", en: 'Translation 9', numbers: [1, 2, 3, 4, 5, 6, 7, 8] },
    { bg: "%D0%9F%D1%8A%D1%80%D0%B6%D0%B5%D0%BD%D0%B8%20%D0%9A%D0%B0%D1%80%D1%82%D0%BE%D1%84%D0%B8", en: 'Translation 10', numbers: [1, 2, 3, 4, 5, 6, 7, 8] },
    { bg: "%D0%9F%D1%8A%D1%80%D0%B6%D0%B5%D0%BD%D0%B8%20%D0%9A%D0%B0%D1%80%D1%82%D0%BE%D1%84%D0%B8", en: 'Translation 11', numbers: [1, 2, 3, 4, 5, 6, 7, 8] },


    // Add more entries as needed
];

window.onload = function init() {
    //canv = document.getElementById('myCanvas');
   // ctx = canv.getContext('2d');

    // Invoke the function to generate the PDF
   // generatePDF();

    

}

/* 0 (алергени)
 * Пържени картофи (bulgarian) 
 * Картошки Фри    (russian)
 * French Fries    (english)
 * kartofeln kaput (german)
 * 
 * */

const pngFiles: string[] = [
    'src/png/1.png',
    'src/png/2.png',
    'src/png/3.png',
    'src/png/4.png',
    'src/png/5.png',
    'src/png/6.png',
    'src/png/7.png',
    'src/png/8.png',
    'src/png/9.png',
    'src/png/10.png',
    'src/png/11.png',
    'src/png/12.png',
    'src/png/13.png',
    'src/png/14.png',
    'src/png/15.png',
];


class Sign {
    width: number;
    height: number;
    border: number = 5;
    content: SignContent;
    canvas: HTMLCanvasElement;
    fontSize: number = 18;
    ctx: CanvasRenderingContext2D;
    pngFiles: string[];
   // pngs: Array<HTMLImageElement> = [];
    URL = undefined;
    constructor(w: number, h: number) {
        this.width = w;
        this.height = h;
        this.content = undefined;
        this.canvas = document.createElement('canvas');
        this.canvas.width = w;
        this.canvas.height = h;
        this.ctx = this.canvas.getContext('2d');
        this.ctx.textAlign = "center";
    }
    setContent(content: SignContent) {
        this.content = content;
    }
    setBorder(num: number) {
        this.border = num;
    }
    generate() {
        let arr = this.content.alergens;  

        //to make it load only the needed images or not at all
        this.loadImages(pngFiles).then((images) => {
            console.log('Images loaded: ', images);
            pngs = images;
            let rows = [this.content.name.bg, this.content.name.en, this.content.name.de, this.content.name.rus];
            this.ctx.save();

            //border
            this.ctx.strokeStyle = "black";
            this.ctx.lineWidth = this.border;
            this.ctx.fillStyle = "white";

            this.ctx.fillRect(0, 0, this.width, this.height);
            this.ctx.strokeRect(0, 0, this.width, this.height);
            this.generateTranslations(rows);
            this.generateAllergens(arr);
            this.ctx.restore();
            document.body.appendChild(this.canvas);
        //Generate data URL
            try {
                this.URL = this.canvas.toDataURL('image/jpeg');
            } catch (e) {
                console.log(e);
            }
            console.log(this.URL);
            return this.URL;
        }).catch((error) => {
            console.log('Error loading images: ', error);
            return undefined;
        });         
    }
  
    private async loadImage(url: string): Promise < HTMLImageElement > {
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.onload = () => resolve(image);
            image.onerror = (error) => reject(error);
            image.src = url;
        });
    }
    private async loadImages(urls: string[]): Promise<HTMLImageElement[]> {
        const imagePromises = urls.map((url) => this.loadImage(url));
        return Promise.all(imagePromises);
    }

    private generateTranslations(rows) {
        for (let i = 0; i < rows.length; i++) {
            let step = this.fontSize * 1.5;
            let x = this.width / 2;
            let y = step * (i + 1)+ this.height*0.35;
            this.ctx.font = this.fontSize + "px sans-serif";
            this.txtCalibrate(rows[i]);
            step = this.fontSize * 1.5;
            this.ctx.fillStyle = "black";
            this.ctx.fillText(rows[i], x, y);

        }
    }
    private generateAllergens(arr:Array<number>) {
        let saveFont = this.fontSize;
        this.fontSize *= 2;
        let dx = this.width / 2;
        let dy = this.border;
        let dWidth = this.fontSize;
        let dHeight = this.fontSize;
        for (let i = 0; i < arr.length; i++) {
            
            this.ctx.font = this.fontSize + "px sans-serif";
            this.ctx.fillStyle = "blue";
            this.ctx.fillText(String(arr[i]), dx, dy + this.fontSize);
            this.ctx.drawImage(pngs[Number(arr[i])], dx + 10, dy, dWidth, dHeight)
            dx += this.fontSize * 2;

        }
        this.fontSize = saveFont;
    }
    private txtCalibrate(txt: string) {
        let textSize = this.fontSize;
        while (this.ctx.measureText(txt).width > this.width-10) {
            textSize--;
            this.ctx.font = textSize + "px sans-serif";
        }
    }
}



interface translation  {
    bg: string;
    en: string;
    de: string;
    rus: string;
}
class SignContent {
    alergens: Array<number>;
    name: translation;
    constructor(alergens: Array<number>, name: translation) {
        this.alergens = alergens;
        this.name = name;
    }
}

async function createPDF() {
    //pngs = await loadPNGs();
    //creates new PDF Document
    const doc = await PDFLib.PDFDocument.create();

    //adds page to just created PDF Document

    /*          Method doc.addPage(pageSize(w,h))
     * 1 - (w,h) < <number>, <number> >  ... doc.addPage(700,800);
     * 2 - (PageSizes.*) ... doc.addPage(PageSizes.A4);
     * 3
     * 
     */
  //  const page = doc.addPage(PDFLib.PageSizes.A4);

    const chunks = [];
    for (let i = 0; i < signs.length; i += 8) {
        chunks.push(signs.slice(i, i + 8));
    }

    // Generate pages for each chunk of entries
    for (const chunk of chunks) {
        const page = doc.addPage(PDFLib.PageSizes.A4);

        const { width, height } = page.getSize();

        let y = height - 5;
        let x = 0;

        // Print each entry on the page
        for (const sign of chunk) {
            console.log(sign);
            //creates JPEG image from canvas
           // var image = new Image();
           // image.src = sign;
            var jpgImage = await doc.embedJpg(sign);

            //used for debugging

            //draws just created JPEG image to the page
            page.drawImage(jpgImage, {
                x: x + 5,
                y: y - sign.height,
                width: sign.width,
                height: sign.height
            });
            if (x > 0) {
                x = 0;
                y -= sign.height+5;
            } else x = x + sign.width + 5;
        }
  
    }
    //saving the PDF doc as dataUri
    const pdfDataUri = await doc.saveAsBase64({ dataUri: true });

    //adding the PDF document to the DOM
    var framePDF = document.getElementById('pdf');
    framePDF.src = pdfDataUri;
}

async function loadSigns() {
    const chunks = [];
    for (let i = 0; i < data.length; i += 8) {
        chunks.push(data.slice(i, i + 8));
    }
    // Generate pages for each chunk of data entries
    for (const chunk of chunks) {

        const width = PDFLib.PageSizes.A4[0];
        const height = PDFLib.PageSizes.A4[1];

        // Print each entry on the page
        for (const entry of chunk) {
            const signsInPage = 8; // TO DO
            let sign = new Sign(width / 2 - 10, height / (signsInPage / 2) - 10);
            sign.setContent(new SignContent(entry.numbers, { bg: decodeURI(entry.bg), en: entry.en, de: "deutsch", rus: decodeURI("%D0%9A%D0%B0%D1%80%D1%82%D0%BE%D1%88%D0%BA%D0%B8%20%D0%A4%D1%80%D0%B8") }));
            signs.push(await sign.generate());

            //used for debugging and visualising
            document.body.appendChild(sign.canvas);
        }
    }
}

    /*
    // Save the PDF document to a file
    const pdfBytes = await pdfDoc.save();

    // Use the pdfBytes to save the PDF document or perform further operations

    // Example: Save the PDF to a file
    const fs = require('fs');
    fs.writeFileSync('output.pdf', pdfBytes);
    */