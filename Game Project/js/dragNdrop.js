

//drag DOM elements
var divDrag;
var dragList;
var dragListItems = [];

//drop DOM elements;
var divDrop;
var dropList;
var DropListItems = [];
function initDragAndDrop() {
    initDrag();
    initDrop();
    initDropFilesZone();
    initFileSelect();
}

function initDrag() {
    //divDrag definition
    divDrag = document.createElement('div');
    document.body.appendChild(divDrag);

        //style
    divDrag.style = "border: 1px solid black; margin:2px";

    //dragList definition
    dragList = document.createElement('ul');
    divDrag.appendChild(dragList);

        //style
    dragList.style = "border:1px dotted blue;min-width:250px;min-height:100px;";

    dragList.setAttribute("ondragstart", "dragStartHandler(event);");
    dragList.setAttribute("ondragend", "dragEndHandler(event);");

    dragList.setAttribute("ondragenter", "dragEnterHandler(event);");
    dragList.setAttribute("ondragleave", "dragLeaveHandler(event);");
    dragList.setAttribute("ondragover", "dragOverHandler(event);");
    dragList.setAttribute("ondrop", "dropHandler(event);");

    //artificialy creating Elements 
    for (var i = 0; i < 5; i++) {
        let tmp = document.createElement('li');
        tmp.innerHTML = "Element: " + i;
        tmp.setAttribute("draggable", "true");
        tmp.setAttribute("data-value", i);
        tmp.setAttribute("id", "liId-" + i);
        dragList.appendChild(tmp);
        //dragListItems.push(tmp);
    }
}

function initDrop() {
    //divDrop definition
    divDrop = document.createElement('div');
    document.body.appendChild(divDrop);

    divDrop.id = "divDrop";
    divDrop.style = "border:3px solid green; min-height:100px;min-width:250px;";

    //dropList definition
    dropList = document.createElement("ul");
    divDrop.appendChild(dropList);

        //style
    dropList.style = "border:1px dotted blue; min-width:250px;min-height:100px; ";

    dropList.setAttribute("ondragstart", "dragStartHandler(event);");
    dropList.setAttribute("ondragend", "dragEndHandler(event);");
    dropList.setAttribute("ondragenter", "dragEnterHandler(event);");
    dropList.setAttribute("ondragleave", "dragLeaveHandler(event);");
    dropList.setAttribute("ondragover", "dragOverHandler(event);");
    dropList.setAttribute("ondrop", "dropHandler(event);");
}

function dragStartHandler(event) {
    //event.preventDefault();
  //  event.dataTransfer.effectAllowed = 'copy';
    if (event.target.type !== undefined) {
        event.target.style.opacity = '0.4';
        event.target.classList.add('dragged');
        event.dataTransfer.setData("id", event.target.id);
        var data = event.dataTransfer.getData("id");
        if (data == '0') console.log("data is 0");
        if (data == '1') console.log("data is 1");
    }
}
function dragEndHandler(event) {
    if (event.target.type !== undefined) {
        event.target.style.opacity = '1';
        event.target.classList.remove('dragged');
    }
}
function dropHandler(event) {
    // Do not propagate the event
    event.stopPropagation();
    // Prevent default behavior, in particular when we drop images or links
    event.preventDefault();
    event.target.classList.remove("draggedOver");
       
    DropListItems.push(tmp);
    if (event.dataTransfer.files.length != 0) {
        dropFilesHandler(event);
        uploadAllFilesUsingAjax(event.dataTransfer.files);
    } else {
        var data = event.dataTransfer.getData("id");
        var tmp;
        if (tmp = document.getElementById(data)) {
            event.target.appendChild(tmp);
            //dropList.appendChild(tmp);
            tmp.classList.remove("dragged");
        }
    }
} 
function dragOverHandler(event) {
    // Do not propagate the event
    event.stopPropagation();
    // Prevent default behavior, in particular when we drop images or links
    event.preventDefault();
}
function dragEnterHandler(event) {
    event.target.classList.add("draggedOver");
}
function dragLeaveHandler(event) {
    event.target.classList.remove("draggedOver");
}

var divDropFilesZone;
var listDropFiles;

function initDropFilesZone() {
    //divDropFilesZone definition
    divDropFilesZone = document.createElement('div');
    document.body.appendChild(divDropFilesZone);

        //style
    divDropFilesZone.style = "border:1px solid gray;min-width:250px;min-height:100px;margin:5px;";

    //listDropFiles definition
    listDropFiles = document.createElement('ul');
    divDropFilesZone.appendChild(listDropFiles);

        //style
    listDropFiles.style = "border:2px dotted blue;min-width:250px;min-height:100px;";

    listDropFiles.setAttribute("ondragstart", "dragStartHandler(event);");
    listDropFiles.setAttribute("ondragend", "dragEndHandler(event);");
    listDropFiles.setAttribute("ondragenter", "dragEnterHandler(event);");
    listDropFiles.setAttribute("ondragleave", "dragLeaveHandler(event);");
    listDropFiles.setAttribute("ondragover", "dragOverHandler(event);");
    listDropFiles.setAttribute("ondrop","dropHandler(event);");
}
function dropFilesHandler(event) {
    event.stopPropagation();
    event.preventDefault();
    
    var files = event.dataTransfer.files;
    console.log(files);
    var filesLen = files.length;
    var filenames = "";
    // iterate on the files, get details using the file API
    // Display file names in a list.
    for (var i = 0; i < filesLen; i++) {
        filenames += '\n' + files[i].name;
        // Create a li, set its value to a file name, add it to the ol
        var li = document.createElement('li');
        li.textContent = files[i].name; event.target.appendChild(li);
    }
    readFilesAndDisplayPreview(event, files);
    console.log(files.length + ' file(s) have been dropped:\n' + filenames);
}
function readFilesAndDisplayPreview(event, files) {
    // Loop through the FileList and render image files as thumbnails.
    for (var i = 0, f; f = files[i]; i++) {

        // Only process image files.
        if (!f.type.match('image.*')) {
            continue;
        }

        var reader = new FileReader();

        //capture the file information.
        reader.onload = function (e) {
            // Render thumbnail.
            var span = document.createElement('span');
            span.innerHTML = "<img class='thumb' width='100' src='" + e.target.result + "'/>";
           event.target.insertBefore(span, null);
        };

        // Read in the image file as a data URL.
        reader.readAsDataURL(f);
    }
}

var divFileSelect;
var inputFileSelect;
var progress;
function initFileSelect() {
    //divFileSelect definition
    divFileSelect = document.createElement('div');
    document.body.appendChild(divFileSelect);

        //style
    divFileSelect.style = "border:2px solid black; margin:2px; padding:0;";

    //inputFileSelect definition
    inputFileSelect = document.createElement('input');
    divFileSelect.appendChild(inputFileSelect);

    inputFileSelect.type = 'file';
    inputFileSelect.setAttribute("onchange", "handleFileSelect(event);");

    //progress bar definition
    progress = document.createElement('progress');
    document.body.appendChild(progress);

    progress.value = "0";
}

function handleFileSelect(event) {
    var files = event.target.files;
    readFilesAndDisplayPreview(files);
}
function uploadAllFilesUsingAjax(files) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'upload.html');

    xhr.upload.onprogress = function (e) {
        progress.value = e.loaded;
        progress.max = e.total;
    };

    xhr.onload = function () {
       console.log('Upload complete!');
    };

    var form = new FormData();
    for (var i = 0; i < files.length; i++) {
        form.append('file', files[i]);
    }

    xhr.send(form);
}