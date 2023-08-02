var PDFLib = PDFLib;
const width = PDFLib.PageSizes.A4[0];
const height = PDFLib.PageSizes.A4[1];
const signsInPage = 8; // TO DO
var password = '';
var signs: Array<HTMLCanvasElement> = [];
//var data = []; 
var labelList; 
var db, png, categories, allergens, labels;
function test1() { console.log('test1') };
window.onload = function init() {
    db = new DB();
    png = new PNGs();
    categories = new Categories();
    allergens = new Allergens();
    labelList = new addedLabelsList();
    labels = new Labels();
    $('#btnDeleteLabels').on('click', () => { deleteButton(); });
    $('#fetchSignsButton').on('click', () => {db.fetchSigns();
    });
    
    initEventsSearch();
    let input = document.querySelector('#searchInput');
    
}

function createLabel() {
   
    let inputBG: HTMLInputElement = document.querySelector('#LabelBG');
    let inputEN: HTMLInputElement = document.querySelector('#LabelEN');
    let inputDE: HTMLInputElement = document.querySelector('#LabelDE');
    let inputRUS: HTMLInputElement = document.querySelector('#LabelRUS');

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
function saveLabel(id: string) {
    
    let inputBG: HTMLInputElement = document.querySelector('#LabelBG');
    let inputEN: HTMLInputElement = document.querySelector('#LabelEN');
    let inputDE: HTMLInputElement = document.querySelector('#LabelDE');
    let inputRUS: HTMLInputElement = document.querySelector('#LabelRUS');
    let arr = allergens.selectedAllergens.map(Number);
    arr = arr.sort((a, b) => a - b);
    let label = {
        "allergens": arr,
        "bg": inputBG.value,
        "en": inputEN.value,
        "de": inputDE.value,
        "rus": inputRUS.value,
        "category": categories.selectedCategories
    }
    db.saveLabel(JSON.stringify(label), id);
}
function createNewLabel() {
    $("#saveButton").text("Create New Label");
    $("#saveLabel p input").val('');
    $('.filter_list input[type="checkbox"]').each(function () {
        if ($(this).is(":checked")) $(this).click();
    });
    $('#saveButton').unbind();
    $("#saveButton").on('click', () => {createLabel();
});
    
    }

function search() {
    console.log(1);
    labels.labels = [];
    let value = String($('#searchInput').val());
    for (let i = 0; i < db.data.length; i++) {
        if (db.data[i].bg.toLowerCase().search(value.toLowerCase()) !== -1) labels.labels.push(db.data[i]);
    }
    labels.update();

}
function initEventsSearch() {
    $("#searchInput").keyup(function (e) {
        search();
    });
        }

//add Delete Button
function deleteButton() {
            var inputID = [];
    for (let i = 0; i < db.data.length; i += 1) {
        let checkbox = document.getElementById(db.data[i]._id) as HTMLInputElement;
        if (checkbox && checkbox.checked) {
           inputID.push(db.data[i]);
        }
    }
    console.log(inputID);
            if (inputID.length > 1) {
                if (confirm('Delete ' + inputID.length + ' labels?') == true) {
                    for (let i = 0; i < inputID.length; i++) {
                        db.deleteLabel(String(inputID[i]._id));
                    }
                }
            } else if (inputID.length == 1) {
                if (confirm('Delete 1 Label: ' + inputID[0].bg)) db.deleteLabel(inputID[0]._id);
            }
                setTimeout(labels.update, 500);
        }            