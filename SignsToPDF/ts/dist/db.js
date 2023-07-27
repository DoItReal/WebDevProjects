"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var serverAddress = "https://labels-service-392708.lm.r.appspot.com/";
//var serverAddress = "http://localhost:8080/";
function fetchDBSigns() {
    //get data from db
    var svg = document.querySelector('#fetchSignsButton svg');
    var i = 0;
    var animID = requestAnimationFrame(anim);
    fetch(serverAddress + 'signs/').then(response => response.json()).then(Getdata => { data = Getdata; }).then(() => { updateList(); }).then(() => {
        cancelAnimationFrame(animID);
        let fetchButton = document.querySelector('#fetchSignsButton');
        fetchButton.setAttribute('style', "background-color:lawngreen"); // to do turning green only when connected to DB
        fetchButton.disabled = true;
    });
    function anim() {
        svg.setAttribute('transform', 'rotate(' + i + ')');
        i += 10;
        if (i > 360)
            i = 0;
        animID = requestAnimationFrame(anim);
    }
}
function getSignById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        fetch(serverAddress + 'signs/' + id).then(response => response.json()).then(sign => { return sign; });
    });
}
function createNewLabelDB(label) {
    let protocol = "http";
    let server = "localhost";
    let port = "8080";
    let address = "signs";
    let xhr = new XMLHttpRequest();
    //xhr.open("POST", protocol + "://" + server + ":" + port + "/" + address);
    xhr.open("POST", serverAddress + 'signs');
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            console.log(xhr.status);
            console.log(xhr.responseText);
            let startIndex = xhr.responseText.search('_id') + 6;
            let endIndex = xhr.responseText.search('__v') - 3;
            let id = xhr.responseText.slice(startIndex, endIndex);
            let labelJSON = JSON.parse(label);
            labelJSON._id = id;
            data.push(labelJSON);
            search();
            updateList();
        }
    };
    xhr.send(label);
}
function saveLabelDB(label, id) {
    let protocol = "http";
    let server = "localhost";
    let port = "8080";
    let address = "signs";
    let xhr = new XMLHttpRequest();
    // xhr.open("PATCH", protocol + "://" + server + ":" + port + "/" + address + "/" + id);
    xhr.open("PATCH", serverAddress + 'signs/' + id);
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            console.log(xhr.status);
            console.log(xhr.responseText);
            let index = findIndexByProperty(data, '_id', id);
            if (index != -1)
                data[index] = JSON.parse(xhr.responseText);
            search();
            updateList();
        }
    };
    console.log(label);
    xhr.send(label);
}
function deleteLabelDB(id) {
    if (password != 'asd123456')
        return;
    let protocol = "http";
    let server = "localhost";
    let port = "8080";
    let address = "signs";
    let xhr = new XMLHttpRequest();
    // xhr.open("DELETE", protocol + "://" + server + ":" + port + "/" + address + "/" + id);
    xhr.open("DELETE", serverAddress + 'signs/' + id);
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            console.log(xhr.status);
            console.log(xhr.responseText);
            let index = findIndexByProperty(data, '_id', id);
            if (index != -1)
                data.splice(index, 1);
            search();
            updateList();
        }
    };
    xhr.send();
}
function findIndexByProperty(arr, propName, propValue) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i][propName] === propValue) {
            return i;
        }
    }
    return -1; // Return -1 if the object is not found
}
