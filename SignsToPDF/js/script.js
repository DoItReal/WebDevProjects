var PDFLib = PDFLib;
const width = PDFLib.PageSizes.A4[0];
const height = PDFLib.PageSizes.A4[1];
const signsInPage = 8; // TO DO
var password = '';
var pngs = [];
var activeLabels = [];
var signs = [];
var data = [];
window.onload = function init() {
    $("#SignsContainer #filterContainer input:checkbox").change(function () {
        if ($(this).is(":checked")) {
            $("#SignsContainer #Signs input:checkbox").prop("checked", true);
        }
        else {
            $("#SignsContainer #Signs input:checkbox").prop("checked", false);
        }
    });
    initEventsSearch();
    loadPNG();
    let input = document.querySelector('#searchInput');
    input.addEventListener('keypress', function (event) {
        //  event.preventDefault();
        let searchButton = document.querySelector('#searchButton');
        searchButton.click();
    });
};
function createLabel() {
    let inputAllergens = document.querySelector('#LabelAllergens');
    let inputBG = document.querySelector('#LabelBG');
    let inputEN = document.querySelector('#LabelEN');
    let inputDE = document.querySelector('#LabelDE');
    let inputRUS = document.querySelector('#LabelRUS');
    //   let inputCat: Array<string> = selectedCategories;
    let arr = inputAllergens.value.split(',').map(Number);
    //   let categories = inputCat.value.split(',').map(String);
    arr = selectedAllergens.map(Number);
    arr = arr.sort((a, b) => a - b);
    let label = {
        'allergens': arr,
        'bg': inputBG.value,
        'en': inputEN.value,
        'de': inputDE.value,
        'rus': inputRUS.value,
        'category': selectedCategories
    };
    //   let label = '{ "allergens":[' + arr + '],"bg":"' + inputBG.value + '", "en":"' + inputEN.value + '", "de":"' + inputDE.value + '", "rus":"' + inputRUS.value + '",' + '"category":[' + selectedCategories + ']}';
    createNewLabelDB(JSON.stringify(label));
    inputAllergens.value = '';
    inputBG.value = '';
    inputEN.value = '';
    inputDE.value = '';
    inputRUS.value = '';
}
function saveLabel(id) {
    let inputAllergens = document.querySelector('#LabelAllergens');
    let inputBG = document.querySelector('#LabelBG');
    let inputEN = document.querySelector('#LabelEN');
    let inputDE = document.querySelector('#LabelDE');
    let inputRUS = document.querySelector('#LabelRUS');
    let arr = inputAllergens.value.split(',').map(Number);
    arr = selectedAllergens.map(Number);
    arr = arr.sort((a, b) => a - b);
    let label = {
        "allergens": arr,
        "bg": inputBG.value,
        "en": inputEN.value,
        "de": inputDE.value,
        "rus": inputRUS.value,
        "category": selectedCategories
    };
    // let label = '{"allergens":[' + arr + '],"bg":"' + inputBG.value + '", "en":"' + inputEN.value + '", "de":"' + inputDE.value + '", "rus":"' + inputRUS.value + '"}';
    saveLabelDB(JSON.stringify(label), id);
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
    for (let i = 0; i < data.length; i++) {
        if (data[i].bg.toLowerCase().search(value.toLowerCase()) !== -1)
            activeLabels.push(data[i]);
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
        // TO DO add functionality for backspace
        if (activeLabels.length == 0 && found) {
            activeLabels = [];
            for (let i = 0; i < data.length; i++) {
                activeLabels.push(data[i]);
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
                            let closeButton = $('#closeSignsBox');
                            closeButton.on('click', () => {
                                $('#saveLabel').removeClass('active');
                                $('#closeSignsBox').removeClass('active');
                                $('#SignsContainer').addClass('active');
                                $('.filter_list input[type="checkbox"]').each(function () {
                                    if ($(this).is(":checked"))
                                        $(this).click();
                                });
                                selectedCategories = [];
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
                            deleteLabelDB(label._id);
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
async function loadSelectedSigns() {
    const selected = [];
    for (let i = 0; i < data.length; i += 1) {
        let checkbox = document.getElementById(data[i]._id);
        if (checkbox && checkbox.checked) {
            selected.push(data[i]);
        }
    }
    // Generate pages for each chunk of data entries
    for (const entry of selected) {
        let sign = new Sign(width / 2 - 10, height / (signsInPage / 2) - 10);
        sign.setContent(new SignContent(entry.allergens, { bg: decodeURI(entry.bg), en: entry.en, de: entry.de, rus: entry.rus }));
        sign.setId(entry._id);
        signs.push(sign.generate());
    }
}
//# sourceMappingURL=script.js.map