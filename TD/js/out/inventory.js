let divInvContainer, divInventory, divHeader, divContent, divFooter, invButton, divButton;
class Item {
    //stackable = true; TO DO
    constructor(name, type, rarity, value, icon, stack) {
        this.name = name; //string
        this.type = type; //string
        this.rarity = rarity; //string
        this.value = value; //int
        this.icon = icon;
        this.stack = stack;
    }
}
class Inventory {
    constructor() {
        this.inventory = [];
        this.size = 0;
        this.minSize = 20;
    }
    //METHODS
    add_item(item) {
        this.inventory.push(item);
        this.size++;
    }
    drop_item(slotIndex) {
        this.inventory.splice(slotIndex, 1);
        this.size--;
    }
    get_item_OBJ(itemIndex) {
        return this.inventory[itemIndex];
    }
    fill_inventory() {
        this.add_item(new Item('Diamonds', 'Currency', 'Legendary', 100, 'textures/icons/items/diamonds-icon.png', true));
        this.add_item(new Item('Gold', 'Currency', 'Elite', 2, 'textures/icons/items/gold-icon.png', true));
        this.add_item(new Item('Silver', 'Currency', 'Rare', 13, 'textures/icons/items/silver-icon.png', true));
        this.add_item(new Item('Copper', 'Currency', 'Uncommon', 88, 'textures/icons/items/copper-icon.png', true));
        this.add_item(new Item('Junk', 'Junk', 'Junk', 31, 'textures/icons/items/junk-icon.png', true));
        this.add_item(new Item('Sword', 'Weapon', 'Rare', 1, 'textures/icons/items/sword-icon.png', false));
        this.add_item(new Item('Shield', 'Off Hand', 'Rare', 1, 'textures/icons/items/shield-icon.png', false));
        this.add_item(new Item('Chest', 'Armor', 'Rare', 1, 'textures/icons/items/armor-icon.png', false));
        this.fill_emptySpace();
    }
    fill_emptySpace() {
        const emptyCell = new Item('Empty', 'Empty', 'Empty', 0, '', false);
        for (let i = 0; i < this.size % 5 || this.size < this.minSize; i++) {
            this.add_item(emptyCell);
        }
    }
    return_inventory() {
        return this.inventory;
    }
    get_info(itemIndex) {
        return String(this.get_item_OBJ(itemIndex).value + 'x ' + this.get_item_OBJ(itemIndex).name);
    }
}
//initializing inventory
function init_inventory() {
    define_inventoryPanel();
    define_inventoryButton();
    event_moveInventory();
}
const openInventory = function () {
    divInvContainer.style.display = 'block';
    invButton.status = 'open';
};
const closeInventory = function () {
    divInvContainer.style.display = 'none';
    invButton.status = 'closed';
};
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
    for (let i = 0; i < game1.player.inventory.size; i++) {
        let divItem = document.createElement('div');
        divItem = setItemDivAttributes(divItem, game1.player.inventory.get_item_OBJ(i), i);
        divContent.appendChild(divItem);
    }
}
function define_inventoryButton() {
    invButton = document.querySelector('#invButton');
    invButton.status = 'closed';
    invButton.onclick = function () {
        if (invButton.status == 'closed') {
            openInventory();
        }
        else {
            closeInventory();
        }
    };
}
function event_moveInventory() {
    let drag = false;
    let x, y;
    divHeader.onmousedown = function (e) {
        drag = true;
        x = e.clientX;
        y = e.clientY;
    };
    window.onmousemove = function (e) {
        if (drag)
            move(e);
    };
    var move = function (e) {
        if (!drag)
            return;
        const rect = divInvContainer.getBoundingClientRect();
        divInvContainer.style.left = (e.clientX - x + rect.left) + 'px';
        divInvContainer.style.top = (e.clientY - y + rect.top) + 'px';
        x = e.clientX;
        y = e.clientY;
    };
    window.onmouseup = function () {
        drag = false;
    };
}
function setItemDivAttributes(divItem, itemObj, i) {
    divItem.id = 'item' + (i + 1);
    divItem.classList.add('divItem');
    let color;
    switch (itemObj.rarity) {
        case 'Junk':
            color = 'lightgray';
            break;
        case 'Common':
            color = 'lightgray';
            break;
        case 'Uncommon':
            color = 'lightgreen';
            break;
        case 'Rare':
            color = 'lightblue';
            break;
        case 'Elite':
            color = 'purple';
            break;
        case 'Legendary':
            color = 'yellow';
            break;
    }
    //  divItem.style = 'background-color:'+color;
    divItem.style = ('background-image: url(' + game1.player.inventory.get_item_OBJ(i).icon + ');' +
        'background-color:' + color + ';');
    if (itemObj.stack) {
        const divValue = document.createElement('div');
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
//# sourceMappingURL=inventory.js.map