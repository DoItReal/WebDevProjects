class Label {
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
        this.generated = false;
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
        if (this.generated)
            return this.canvas;
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
        this.generated = true;
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
            this.ctx.drawImage(png.images[Number(arr[i] - 1)], dx + this.fontSize / 2, dy, dWidth, dHeight);
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
class LabelContent {
    //   pngFiles: string[];
    // pngs: Array<HTMLImageElement> = [];
    constructor(alergens, name) {
        this.alergens = alergens;
        this.name = name;
    }
}
class Labels {
    constructor() {
        this.labels = [];
        this.init = false;
        this.box = $('#Signs');
        this.table = $('<table/>', { addClass: 'labelsTable' });
        this.box.append($(this.table));
        this.initEvent();
    }
    header() {
        let header = $('<tr><th style="width:1.5em;"><input type="checkbox" /></th><th style="width:auto">Label</th><th style="width:10em"></th></tr>');
        return header;
    }
    initEvent() {
        $(".labelsTable > tr > th > input").change(function () {
            console.log($(this));
            if ($(this).is(":checked")) {
                $(".labelsTable > tr > td > input:checkbox").prop("checked", true);
            }
            else {
                $(".labelsTable > tr > td > input:checkbox").prop("checked", false);
            }
        });
    }
    update(reset = false) {
        // Empty the active label list
        if (!this.init) {
            for (let i = 0; i < db.data.length; i++) {
                this.labels.push(db.data[i]);
            }
            this.init = true;
        }
        this.updateDOM();
    }
    updateDOM() {
        this.table.html('');
        this.table.append(this.header());
        this.initEvent();
        for (const label of this.labels) {
            let tr = $('<tr/>');
            let options = $('<td/>');
            tr.append(($('<td/>')).append(this.selectCheckbox(label)));
            tr.append(($('<td/>')).append(this.title(label)));
            options.append(this.editButton(label));
            options.append(this.PreviewButton(label));
            tr.append($(options));
            $(this.table).append($(tr));
        }
        if (this.labels.length == 0) {
            $(this.table).append($('<tr><td/><td style="text-align:center; color:red;font-weight:bold;">No Matching Items</td></td></tr>'));
        }
    }
    title(label) {
        let lbl = $('<label></label>', {
            text: label.bg
        });
        return lbl;
    }
    //add Select checkbox
    selectCheckbox(label) {
        let input = $("<input/>", {
            type: 'checkbox',
            id: label._id
        });
        return input;
    }
    editButton(label) {
        let editButton = $("<button/>", {
            text: 'Edit',
            addClass: "editButton",
            click: function () {
                {
                    categories.resetCatnAll();
                    $('#SignsContainer').removeClass('active');
                    for (let i = 0; i < label.category.length; i++) {
                        $('#categoriesDiv .filter_list input[type="checkbox"]').each(function () {
                            var inputVal = $(this).parent("label").text();
                            if (inputVal == label.category[i])
                                $(this).click();
                        });
                    }
                    for (let i = 0; i < label.allergens.length; i++) {
                        $('#allergensDiv .filter_list input[type="checkbox"]').each(function () {
                            var inputVal = $(this).parent("label").attr('value');
                            if (Number(inputVal) == label.allergens[i])
                                $(this).click();
                        });
                    }
                    $('.select').next('.filter_list').fadeOut();
                    $("#LabelAllergens").val(label.allergens);
                    $("#LabelBG").val(label.bg);
                    $("#LabelEN").val(label.en);
                    $("#LabelDE").val(label.de);
                    $("#LabelRUS").val(label.rus);
                    $('#closeSignsBox').addClass('active');
                    $('#saveLabel').addClass('active');
                    //CLOSE BUTTON
                    let closeButton = $('#closeSignsBox');
                    closeButton.on('click', () => {
                        $('#saveLabel').removeClass('active');
                        $('#closeSignsBox').removeClass('active');
                        $('#SignsContainer').addClass('active');
                        categories.resetCatnAll();
                    });
                    $('#saveButton').text('Save Label');
                    $('#saveButton').unbind();
                    $('#saveButton').on('click', () => {
                        saveLabel(label._id);
                        $("#SignsContainer").addClass("active");
                        $("#saveLabel").removeClass("active");
                        labels.update();
                    });
                }
            }
        });
        return editButton;
    }
    PreviewButton(label) {
        let previewDiv = $('#SignPreview');
        let previewButton = $('<button />', {
            addClass: 'previewButton',
            text: 'Preview',
            click: function () {
                let sign = new Label(width / 2 - 10, height / (signsInPage / 2) - 10);
                sign.setContent(new LabelContent(label.allergens, { bg: decodeURI(label.bg), en: label.en, de: label.de, rus: label.rus }));
                sign.setId(label._id);
                $(previewDiv).text('');
                $(previewDiv).append(sign.generate());
            }
        });
        return previewButton;
    }
}
//# sourceMappingURL=signs.js.map