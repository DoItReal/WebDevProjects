async function createPDF() {
    signs = [];
    for (const entry of labelList.labels) {


        let sign = new Label(width / 2 - 10, height / (signsInPage / 2) - 10);
        sign.setContent(new LabelContent(entry.allergens, { bg: decodeURI(entry.bg), en: entry.en, de: entry.de, rus: entry.rus }));
        sign.setId(entry._id);
        if (entry.count && entry.count > 1) {
            for (let i = 1; i <= entry.count; i++) {
                signs.push(sign.generate());
            }
        } else {
            signs.push(sign.generate());
        }

    }

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
            var jpgImage = await doc.embedJpg(sign.toDataURL('image/jpeg'));

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
                y -= sign.height + 5;
            } else x = x + sign.width + 5;
        }

    }
    //saving the PDF doc as dataUri
    const pdfDataUri = await doc.saveAsBase64({ dataUri: true });

    //adding the PDF document to the DOM
    var framePDF: HTMLIFrameElement = document.querySelector('#pdf');
    framePDF.src = pdfDataUri;
    $('#pdf').show();
}


/*
// Save the PDF document to a file
const pdfBytes = await pdfDoc.save();

// Use the pdfBytes to save the PDF document or perform further operations

// Example: Save the PDF to a file
const fs = require('fs');
fs.writeFileSync('output.pdf', pdfBytes);
*/