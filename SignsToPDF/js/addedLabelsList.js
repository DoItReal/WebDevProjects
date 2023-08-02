class addedLabelsList {
    constructor() {
        this.labels = [];
        this.box = $('#AddedLabels');
        this.table = $('<table/>', { addClass: 'labelsTable' });
        $(this.box).append($(this.table));
        this.initEvents();
    }
    initEvents() {
        $('#addSelectedLabels').on('click', () => { this.addSelectedLabels(); });
    }
    addLabel(label) {
        label = JSON.parse(JSON.stringify(label));
        let indFind = this.findLabel(label._id);
        if (indFind !== -1) {
            this.labels[indFind].count += 1;
        }
        else {
            label.count = 1;
            this.labels.push(label);
        }
        this.updateUI();
    }
    findLabel(id) {
        for (let i = 0; i < this.labels.length; i++) {
            if (this.labels[i]._id == id)
                return i;
        }
        return -1;
    }
    removeLabel(id) {
        let indFind = this.findLabel(id);
        this.labels.splice(indFind, 1);
        this.updateUI();
        return;
    }
    updateUI() {
        $(this.table).html('<tr><th style="width:4em;">Remove</th><th style="width:auto">Label</th><th style="width:3em">Count</th></tr>');
        for (let i = 0; i < this.labels.length; i++) {
            let remButton = $('<button/>', {
                text: '<<',
                click: () => {
                    this.removeLabel(this.labels[i]._id);
                }
            });
            let tr = $('<tr/>');
            let td = $('<td/>');
            let count = $('<input type="number" min=1 max=100/>');
            $(count).val(this.labels[i].count);
            let tmp = this.labels[i];
            $(count).keypress(function (evt) { evt.preventDefault(); });
            $(count).on('change', function () { tmp.count = Number($(this).val()); });
            tr.append($(td).clone().append($(remButton)));
            tr.append($(td).clone().text(this.labels[i].bg));
            tr.append($(td).clone().append($(count)));
            //to do
            $(this.table).append($(tr));
        }
    }
    addSelectedLabels() {
        for (let i = 0; i < db.data.length; i += 1) {
            let checkbox = document.getElementById(db.data[i]._id);
            if (checkbox && checkbox.checked) {
                this.addLabel(db.data[i]);
            }
        }
    }
}
//# sourceMappingURL=addedLabelsList.js.map