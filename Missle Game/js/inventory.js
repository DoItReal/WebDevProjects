var divInvContainer, divInventory, divHeader, divContent, divFooter, invButton;
//initializing inventory
function init_inventory() {
    define_inventoryPanel();
    define_inventoryButton();
    event_moveInventory();
}
var openInventory = function () {
    divInvContainer.style.display = 'block';
    invButton.status = 'open';
}
var closeInventory = function () {
    divInvContainer.style.display = 'none';
    invButton.status = 'closed';
}
function define_inventoryPanel() {

    divInvContainer = document.querySelector('#divInvContainer');
    divInventory = document.createElement('div');
    divInventory.id = '#divInventory';
    divInvContainer.appendChild(divInventory);
    divHeader = document.createElement('div');
    divHeader.classList.add('invHeader');
    divButton = document.createElement('button');
    divButton.id = 'Xbutton';
    divButton.innerHTML = 'X';
    divButton.onclick = closeInventory;
    divHeader.appendChild(divButton);
    divInventory.appendChild(divHeader);
    divContent = document.createElement('div');
    divContent.classList.add('invContent');
    divInventory.appendChild(divContent);
    divFooter = document.createElement('div');
    divFooter.classList.add('invFooter');
    divInventory.appendChild(divFooter);


    for (i = 0; i < player1.inventory.size; i++) {
        let divItem = document.createElement('div');

        divItem = setItemDivAttributes(divItem, player1.inventory.get_item_OBJ(i), i);

        divContent.appendChild(divItem);
    }
}
function define_inventoryButton() {
    invButton = document.querySelector('#invButton');
    invButton.status = 'closed';
    
    invButton.onclick = function () {
        if (invButton.status == 'closed') {
            openInventory();
        } else {
            closeInventory();
        }
    };
}
function event_moveInventory() {
    let drag = false;
    var x, y;
    divHeader.onmousedown = function (e) {
        drag = true;
        x = e.clientX;
        console.log(x);
        y = e.clientY;
    }
    window.onmousemove = function (e) {
        if(drag) move(e);
    }
    move = function (e) {
        if (!drag) return;
        let rect = divInvContainer.getBoundingClientRect();
        divInvContainer.style.left = (e.clientX - x + rect.left) + 'px';
        divInvContainer.style.top = (e.clientY - y + rect.top) + 'px';
        x = e.clientX;
        y = e.clientY;
    }
    window.onmouseup = function () {
        drag = false;
    }
}
function setItemDivAttributes(divItem, itemObj, i) {
    divItem.id = 'item' + (i + 1);
    divItem.classList.add('divItem');
    let color;
    switch (itemObj.rarity) {
        case 'Junk': color = 'lightgray'; break;
        case 'Common': color = 'lightgray'; break;
        case 'Uncommon': color = 'lightgreen'; break;
        case 'Rare': color = 'lightblue'; break;
        case 'Elite': color = 'purple'; break;
        case 'Legendary': color = 'yellow'; break;

    }
    //  divItem.style = 'background-color:'+color;
    divItem.style = (
        'background-image: url(' + player1.inventory.get_item_OBJ(i).icon + ');' +
        'background-color:' + color + ';'
    );

    if (itemObj.stack) {
        let divValue = document.createElement('div');
        divValue.classList.add('itemValue');
        divValue.innerHTML = itemObj.value;
        divItem.appendChild(divValue);
    }

    divItem.name = itemObj.name;
    divItem.value = itemObj.value;
    divItem.rarity = itemObj.rarity;
    divItem.stack = itemObj.stack;
    divItem.title = itemObj.name;
    return divItem;
}
