var PDFLib = PDFLib;
const width = PDFLib.PageSizes.A4[0];
const height = PDFLib.PageSizes.A4[1];
const signsInPage = 8; // TO DO
var password = '';
var activeLabels = [];
var signs = [];
//var data = []; 
var labelList;
var db, png, categories, allergens;
function test1() { console.log('test1'); }
;
window.onload = function init() {
    db = new DB();
    png = new PNGs();
    categories = new Categories();
    allergens = new Allergens();
    labelList = new addedLabelsList();
    $('#fetchSignsButton').on('click', () => {
        db.fetchSigns();
    });
    $("#SignsContainer #filterContainer input:checkbox").change(function () {
        if ($(this).is(":checked")) {
            $("#SignsContainer #Signs input:checkbox").prop("checked", true);
        }
        else {
            $("#SignsContainer #Signs input:checkbox").prop("checked", false);
        }
    });
    initEventsSearch();
    let input = document.querySelector('#searchInput');
    input.addEventListener('keypress', function (event) {
        labelList.addLabel(db.data[1]);
    });
};
function createLabel() {
    let inputBG = document.querySelector('#LabelBG');
    let inputEN = document.querySelector('#LabelEN');
    let inputDE = document.querySelector('#LabelDE');
    let inputRUS = document.querySelector('#LabelRUS');
    let arr = allergens.selectedAllergens.map(Number);
    arr = arr.sort((a, b) => a - b);
    let label = {
        'allergens': arr,
        'bg': inputBG.value,
        'en': inputEN.value,
        'de': inputDE.value,
        'rus': inputRUS.value,
        'category': categories.selectedCategories
    };
    //   let label = '{ "allergens":[' + arr + '],"bg":"' + inputBG.value + '", "en":"' + inputEN.value + '", "de":"' + inputDE.value + '", "rus":"' + inputRUS.value + '",' + '"category":[' + selectedCategories + ']}';
    db.createNewLabel(JSON.stringify(label));
    inputBG.value = '';
    inputEN.value = '';
    inputDE.value = '';
    inputRUS.value = '';
}
function saveLabel(id) {
    let inputBG = document.querySelector('#LabelBG');
    let inputEN = document.querySelector('#LabelEN');
    let inputDE = document.querySelector('#LabelDE');
    let inputRUS = document.querySelector('#LabelRUS');
    let arr = allergens.selectedAllergens.map(Number);
    arr = arr.sort((a, b) => a - b);
    let label = {
        "allergens": arr,
        "bg": inputBG.value,
        "en": inputEN.value,
        "de": inputDE.value,
        "rus": inputRUS.value,
        "category": categories.selectedCategories
    };
    db.saveLabel(JSON.stringify(label), id);
}
function createNewLabel() {
    $("#saveButton").text("Create New Label");
    $("#saveLabel p input").val('');
    $('.filter_list input[type="checkbox"]').each(function () {
        if ($(this).is(":checked"))
            $(this).click();
    });
    $('#saveButton').unbind();
    $("#saveButton").on('click', () => {
        createLabel();
    });
}
function search() {
    activeLabels = [];
    let value = String($('#searchInput').val());
    for (let i = 0; i < db.data.length; i++) {
        if (db.data[i].bg.toLowerCase().search(value.toLowerCase()) !== -1)
            activeLabels.push(db.data[i]);
    }
    if (activeLabels.length == 0)
        updateList(false);
    else
        updateList();
}
function initEventsSearch() {
    $("#searchInput").keyup(function (e) {
        search();
    });
}
function updateList(found = true) {
    let color = ['lightgray', 'white'];
    let i = 0;
    update(found);
    function update(found) {
        let div = $('#Signs');
        div.text(''); //clear the div
        if (activeLabels.length == 0 && found) {
            activeLabels = [];
            for (let i = 0; i < db.data.length; i++) {
                activeLabels.push(db.data[i]);
            }
        }
        else {
        }
        // Generate pages for each chunk of data entries
        for (const label of activeLabels) {
            //add Title Label
            function title() {
                let lbl = $('<label></label>', {
                    text: label.bg
                });
                return lbl;
            }
            //add Select checkbox
            function selectCheckbox() {
                let input = $("<input/>", {
                    type: 'checkbox',
                    id: label._id
                });
                return input;
            }
            //TO DO  * Add Edit Button
            function editButton() {
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
                                updateList();
                            });
                        }
                    }
                });
                return editButton;
            }
            //TO DO  * Add Preview Button
            function PreviewButton() {
                let previewDiv = $('#SignPreview');
                let previewButton = $('<button />', {
                    addClass: 'previewButton',
                    text: 'Preview',
                    click: function () {
                        let sign = new Sign(width / 2 - 10, height / (signsInPage / 2) - 10);
                        sign.setContent(new SignContent(label.allergens, { bg: decodeURI(label.bg), en: label.en, de: label.de, rus: label.rus }));
                        sign.setId(label._id);
                        $(previewDiv).text('');
                        $(previewDiv).append(sign.generate());
                    }
                });
                return previewButton;
            }
            //add Delete Button
            function deleteButton() {
                let deleteButton = $('<button/>', {
                    addClass: 'deleteButton',
                    text: 'Delete',
                    click: function () {
                        if (confirm('Delete: ' + label.bg) == true) {
                            db.deleteLabel(label._id);
                            setTimeout(updateList, 500);
                        }
                        else {
                            console.log('Canceled');
                        }
                    }
                });
                return deleteButton;
            }
            let span = $('<span></span>');
            $(span).css('background-color', color[i]);
            if (i >= 1)
                i = 0;
            else
                i++;
            $(span).append(selectCheckbox());
            $(span).append(title());
            $(span).append(editButton());
            $(span).append(PreviewButton());
            $(span).append(deleteButton());
            $(span).append("</br>");
            $(div).append($(span));
        }
    }
}
//# sourceMappingURL=script.js.map