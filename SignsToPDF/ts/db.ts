function fetchDBSigns() {
    //get data from db
    fetch('http://localhost:8080/signs').then(response => response.json()).then(Getdata => { data = Getdata });
    let fetchButton = document.querySelector('#fetchSignsButton') as HTMLButtonElement;
    fetchButton.setAttribute('style', "background-color:lightgreen"); // to do turning green only when connected to DB
    fetchButton.disabled = true;
}
async function getSignById(id:string) {
    fetch('http://localhost:8080/signs/'+id).then(response => response.json()).then(sign => { return sign });
}

function createNewLabelDB(label) {
    let protocol = "http";
    let server = "localhost";
    let port = "8080";
    let address = "signs";
    let xhr = new XMLHttpRequest();

    xhr.open("POST", protocol + "://" + server + ":" + port + "/" + address);
    // xhr.open("POST", "http://localhost:8080/signs"); 
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            console.log(xhr.status);
            console.log(xhr.responseText);
        }
    };
    xhr.send(label);
}
function saveLabelDB(label, id:string) {
    let protocol = "http";
    let server = "localhost";
    let port = "8080";
    let address = "signs";
    let xhr = new XMLHttpRequest();
    xhr.open("PATCH", protocol + "://" + server + ":" + port + "/" + address + "/" + id);
    // xhr.open("POST", "http://localhost:8080/signs"); 
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            console.log(xhr.status);
            console.log(xhr.responseText);
        }
    };
    xhr.send(label);
}
function deleteLabelDB(id: string) {
    let protocol = "http";
    let server = "localhost";
    let port = "8080";
    let address = "signs";
    let xhr = new XMLHttpRequest();
    xhr.open("DELETE", protocol + "://" + server + ":" + port + "/" + address + "/" + id);
    // xhr.open("POST", "http://localhost:8080/signs"); 
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            console.log(xhr.status);
            console.log(xhr.responseText);
        }
    };
    xhr.send();
}