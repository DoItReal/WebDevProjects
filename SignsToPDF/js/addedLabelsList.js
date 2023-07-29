class addedLabelsList {
    constructor() {
        this.labels = [];
        this.box = $('#AddedLabels');
        this.ul = $('<ul/>');
        $(this.box).append($(this.ul));
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
        if (indFind != -1) {
            if (this.labels[indFind].count <= 1)
                this.labels.splice(indFind, 1);
            else
                this.labels[indFind].count -= 1;
            this.updateUI();
            return;
        }
    }
    updateUI() {
        $(this.ul).html('');
        for (let i = 0; i < this.labels.length; i++) {
            let remButton = $('<button/>', {
                text: '<<',
                click: () => {
                    this.removeLabel(this.labels[i]._id);
                }
            });
            let count = $('<span/>', {
                text: '    Count: ' + this.labels[i].count
            });
            let p = $('<p/>');
            p.append($(remButton));
            p.append(this.labels[i].bg);
            p.append($(count));
            let li = $('<li/>');
            li.append($(p));
            //to do
            $(this.ul).append($(li));
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