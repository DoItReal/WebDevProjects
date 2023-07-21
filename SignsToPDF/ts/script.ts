var PDFLib = PDFLib;
const width = PDFLib.PageSizes.A4[0];
const height = PDFLib.PageSizes.A4[1];
const signsInPage = 8; // TO DO
var password = '';
var pngs = [];

var signs: Array<HTMLCanvasElement> = [];
var data = []; 



window.onload = function init() {
    $("#SignsContainer #filterContainer input:checkbox").change(function () {

        if ($(this).is(":checked")) {
            $("#SignsContainer #Signs input:checkbox").prop("checked", true);
        } else {
            $("#SignsContainer #Signs input:checkbox").prop("checked", false);
        }
    });

    loadPNG();
    let input = document.querySelector('#searchInput');
    input.addEventListener('keypress', function (event){
  
        //  event.preventDefault();
        let searchButton = document.querySelector('#searchButton') as HTMLButtonElement;
        searchButton.click();
        
    });
}

function createLabel() {
   
    let inputAllergens: HTMLInputElement = document.querySelector('#LabelAllergens');
    let inputBG: HTMLInputElement = document.querySelector('#LabelBG');
    let inputEN: HTMLInputElement = document.querySelector('#LabelEN');
    let inputDE: HTMLInputElement = document.querySelector('#LabelDE');
    let inputRUS: HTMLInputElement = document.querySelector('#LabelRUS');
    let arr = inputAllergens.value.split(',').map(Number);
    arr = arr.sort((a,b) => a-b);
    let label = '{ "allergens":[' + arr + '],"bg":"' + inputBG.value + '", "en":"' + inputEN.value + '", "de":"' + inputDE.value + '", "rus":"' + inputRUS.value + '"}';
    createNewLabelDB(label);
    inputAllergens.value = '';
    inputBG.value = '';
    inputEN.value = '';
    inputDE.value = '';
    inputRUS.value = '';
}
function saveLabel(id:string) {
    let inputAllergens: HTMLInputElement = document.querySelector('#LabelAllergens');
    let inputBG: HTMLInputElement = document.querySelector('#LabelBG');
    let inputEN: HTMLInputElement = document.querySelector('#LabelEN');
    let inputDE: HTMLInputElement = document.querySelector('#LabelDE');
    let inputRUS: HTMLInputElement = document.querySelector('#LabelRUS');
    let arr = inputAllergens.value.split(',').map(Number);
    arr = arr.sort((a,b) => a-b);

    let label = '{"allergens":[' + arr + '],"bg":"' + inputBG.value + '", "en":"' + inputEN.value + '", "de":"' + inputDE.value + '", "rus":"' + inputRUS.value + '"}';
    saveLabelDB(label, id);
}

function createNewLabel() {

        let button = document.querySelector('#saveButton') as HTMLButtonElement;
    button.innerHTML = 'Create New Label';
    button.setAttribute('onclick', 'createLabel();');

    }

var activeLabels = [];
function updateList(searchBool:boolean = false) {
    let color = ['lightgray', 'white'];
    let i = 0;
    const search = searchBool;
    update();
    function update() {
        let div = $('#Signs');
        div.text(''); //clear the div

        var searchInput = '';
        if (search) {
            searchInput = String($('#searchInput').val());
        }
        $("#searchInput").keypress(function (е) {
            activeLabels = [];
            let value = String(е.target.value);
            for (let i = 0; i < data.length; i++) {
                if (data[i].bg.toLowerCase().search(value.toLowerCase()) !== -1) activeLabels.push(data[i]);
            }

        }); 
        // TO DO add functionality for backspace
        if (searchInput.length == 0) {  
            activeLabels = [];
            for (let i = 0; i < data.length; i++) {
                activeLabels.push(data[i]);
            }
        } else {
           
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
                function selectCheckbox(){
                    let input = $("<input/>", {
                        type: 'checkbox',
                        id: label._id
                    });

                    return input;
                }


                //TO DO  * Add Edit Button
            function editButton(){
                let editButton = $("<button/>", {
                    text: 'Edit',
                    addClass: "editButton",
                    click: function () {
                        {
                            $('#SignsContainer').removeClass('active');

                            $("#LabelAllergens").val(label.allergens);
                            $("#LabelBG").val(label.bg);
                            $("#LabelEN").val(label.en);
                            $("#LabenDE").val(label.de);
                            $("#LabelRUS").val(label.rus);
                            $('#closeSignsBox').addClass('active');
                            $('#saveLabel').addClass('active');
                            let closeButton = $('#closeSignsBox');
                            closeButton.on('click', () => {
                                $('saveLabel').removeClass('active');
                                $('#closeSignsBox').removeClass('active');
                                $('#SignsContainer').addClass('active');
                            });
                            $('#saveButton').text('Save Label');

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
                            } else {
                                console.log('Canceled');
                            }
                        }
                    });
                    return deleteButton;
                }            
            
            let span = $('<span></span>');
            $(span).css('background-color', color[i]);
            if (i >= 1) i = 0; else i++;

            $(span).append(selectCheckbox());
            $(span).append(title())
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
        let checkbox = document.getElementById(data[i]._id) as HTMLInputElement;
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
