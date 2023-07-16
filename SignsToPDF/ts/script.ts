var PDFLib = PDFLib;
const width = PDFLib.PageSizes.A4[0];
const height = PDFLib.PageSizes.A4[1];
const signsInPage = 8; // TO DO
var password = '';
var pngs = [];

var signs: Array<HTMLCanvasElement> = [];
var data = []; 



window.onload = function init() {
    loadPNG();
    let input = document.querySelector('#searchInput');
    input.addEventListener('keypress', function (event){
  
        //  event.preventDefault();
        document.querySelector('#searchButton').click();
        
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
    let signsDiv = document.querySelector('#Signs') as HTMLDivElement;
    signsDiv.style.visibility = 'hidden';
    //Add Edit Button

        let saveDiv = document.querySelector('#saveLabel') as HTMLDivElement;

    let inputAllergens: HTMLInputElement = document.querySelector('#LabelAllergens');
    let inputBG: HTMLInputElement = document.querySelector('#LabelBG');
    let inputEN: HTMLInputElement = document.querySelector('#LabelEN');
    let inputDE: HTMLInputElement = document.querySelector('#LabelDE');
    let inputRUS: HTMLInputElement = document.querySelector('#LabelRUS');

    inputAllergens.value = '';
    inputBG.value = '';
    inputEN.value = '';
    inputDE.value = '';
    inputRUS.value = '';

    saveDiv.style.visibility = 'visible';

    

        let button = document.querySelector('#saveButton') as HTMLButtonElement;
    button.innerHTML = 'Create New Label';
    button.setAttribute('onclick', 'createLabel();document.querySelector("#saveLabel").style.visibility = "hidden";document.querySelector("#Signs").style.visibility="visible"');
    let closeButton = document.querySelector('#closeSignsBox') as HTMLButtonElement;
    closeButton.onclick = () => {
        signsDiv.style.visibility = 'visible';
        saveDiv.style.visibility = 'hidden';
    }
    }


function updateList(searchBool:boolean = false) {
    let color = ['lightgray', 'white'];
    let i = 0;
    const search = searchBool;
    update();
    function update() {

        let div = document.querySelector('#Signs') as HTMLDivElement;
        div.innerHTML = ''; //clear the div
        const chunks = [];
        var searchInput = '';
        if (search) {
            let input = document.querySelector('#searchInput') as HTMLInputElement;
            searchInput = input.value;
        }
        if (searchInput.length == 0) {      
            for (let i = 0; i < data.length; i++) {
                chunks.push(data[i]);
            }
        } else {
            for (let i = 0; i < data.length; i++) {
                if (data[i].bg.toLowerCase().search(searchInput.toLowerCase()) !== -1) chunks.push(data[i]);
            }
        }
        // Generate pages for each chunk of data entries
        for (const label of chunks) {
                //add Title Label
                function title(): HTMLLabelElement {
                    let lbl: HTMLLabelElement = document.createElement('label');
                    lbl.innerHTML = label.bg;

                    return lbl;
                }


                //add Select checkbox
                function selectCheckbox(): HTMLInputElement {
                    let input = document.createElement('input');
                    input.type = 'checkbox';
                    input.id = label._id;

                    return input;
                }


                //TO DO  * Add Edit Button
                function editButton(): HTMLButtonElement {
                    let editButton = document.createElement('button');
                    editButton.className = 'editButton';
                    editButton.innerHTML = 'Edit';
                    editButton.onclick = function () {
                        div.style.visibility = 'hidden';
                        let saveDiv = document.querySelector('#saveLabel') as HTMLDivElement;
                        let inputAllergens: HTMLInputElement = document.querySelector('#LabelAllergens');
                        let inputBG: HTMLInputElement = document.querySelector('#LabelBG');
                        let inputEN: HTMLInputElement = document.querySelector('#LabelEN');
                        let inputDE: HTMLInputElement = document.querySelector('#LabelDE');
                        let inputRUS: HTMLInputElement = document.querySelector('#LabelRUS');

                        inputAllergens.value = label.allergens;
                        inputBG.value = label.bg;
                        inputEN.value = label.en;
                        inputDE.value = label.de;
                        inputRUS.value = label.rus;
                        saveDiv.style.visibility = 'visible';

                        let button = document.querySelector('#saveButton') as HTMLButtonElement;
                        button.innerHTML = 'Save Label';

                        button.setAttribute('onclick', 'saveLabel("' + label._id + '"); document.querySelector("#saveLabel").style.visibility = "hidden";document.querySelector("#Signs").style.visibility = "visible";updateList();');
                    }
                    return editButton;
                }



                //TO DO  * Add Preview Button
                function PreviewButton(): HTMLButtonElement {
                    let previewDiv = document.querySelector('#SignPreview');
                    let previewButton = document.createElement('button');
                    previewButton.className = 'previewButton';
                    previewButton.onclick = () => {
                        let sign = new Sign(width / 2 - 10, height / (signsInPage / 2) - 10);
                        sign.setContent(new SignContent(label.allergens, { bg: decodeURI(label.bg), en: label.en, de: label.de, rus: label.rus }));
                        sign.setId(label._id);
                        previewDiv.innerHTML = '';
                        previewDiv.appendChild(sign.generate());
                    };
                    previewButton.innerHTML = "Preview";

                    return previewButton;
                }

                //add Delete Button
                function deleteButton(): HTMLButtonElement {
                    let deleteButton = document.createElement('button');
                    deleteButton.className = 'deleteButton';
                    deleteButton.innerHTML = 'Delete';
                    deleteButton.onclick = function () {
                        if (confirm('Delete: ' + label.bg) == true) {
                            deleteLabelDB(label._id);
                            setTimeout(updateList, 500);
                        } else {
                            console.log('Canceled');
                        }
                    }
                    return deleteButton;
                }
                let span = document.createElement('span');
                span.style.backgroundColor = color[i];
                if (i >= 1) i = 0; else i++;

                span.appendChild(selectCheckbox());
                span.appendChild(title());
                span.appendChild(editButton());
                span.appendChild(PreviewButton());
                span.appendChild(deleteButton());
                span.appendChild(document.createElement('br'));

                div.appendChild(span);
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
