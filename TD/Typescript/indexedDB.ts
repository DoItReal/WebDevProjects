var divDB: HTMLDivElement;
var buttonCreateDB: HTMLButtonElement, buttonRemoveCustomer, buttonUpdateCustomer, buttonSearchCustomer;
var db;
var fieldsetDB;
var inputDB = [];
function init_indexedDB() {
    divDB = document.createElement('div');
    document.body.appendChild(divDB);
    //style
    divDB.setAttribute ("style", "border:1px solid black;margin:2px;padding:5px;");

    buttonCreateDB = document.createElement('button');
    divDB.appendChild(buttonCreateDB);
    buttonCreateDB.innerHTML = "Create DB";
    buttonCreateDB.setAttribute("onclick", "createDatabase();");

    fieldsetDB = document.createElement('fieldset');
    fieldsetDB.id = 'fieldsetDB';
    divDB.appendChild(fieldsetDB);
            //style

    inputDB = { "id": "", "email": "", "name": "", "gold": "",  "button": "" };

        inputDB["id"] = document.createElement("input");
        inputDB["id"].type = "number";
        inputDB["id"].placeholder = 0;
        inputDB["id"].innerHTML = "0";
        inputDB["id"].required = true;
        inputDB["id"].disabled = true;

        inputDB["email"] = document.createElement("input");
        inputDB["email"].type = "email";

        inputDB["name"] = document.createElement("input");
        inputDB["name"].type = "text";

        inputDB["gold"] = document.createElement("input");
        inputDB["gold"].type = "number";
        inputDB["gold"].min = "0";

        inputDB["button"] = document.createElement("button");
        inputDB["button"].innerHTML = "Add a new Player";
        inputDB["button"].setAttribute('onclick', "addACustomer();");

    fieldsetDB.append("ID: ");
    fieldsetDB.appendChild(inputDB["id"]);
    fieldsetDB.appendChild(document.createElement('br'));
    fieldsetDB.append("Email: ");
    fieldsetDB.appendChild(inputDB["email"]);
    fieldsetDB.appendChild(document.createElement('br'));
    fieldsetDB.append("Name: ");
    fieldsetDB.appendChild(inputDB["name"]);
    fieldsetDB.appendChild(document.createElement('br'));
    fieldsetDB.append("Gold: ");
    fieldsetDB.appendChild(inputDB["gold"]);
    fieldsetDB.appendChild(document.createElement('br'));
    
    fieldsetDB.appendChild(inputDB["button"]);

    buttonRemoveCustomer = document.createElement('button');
    divDB.appendChild(buttonRemoveCustomer);
    buttonRemoveCustomer.innerHTML = "Remove a Customer";
    buttonRemoveCustomer.setAttribute("onclick", "removeACustomer();");

    buttonUpdateCustomer = document.createElement('button');
    divDB.appendChild(buttonUpdateCustomer);
    buttonUpdateCustomer.innerHTML = "Update a Customer";
    buttonUpdateCustomer.setAttribute("onclick", "updateACustomer();");

    buttonSearchCustomer = document.createElement('button');
    divDB.appendChild(buttonSearchCustomer);
    buttonSearchCustomer.innerHTML = "Search a Customer";
    buttonSearchCustomer.setAttribute("onclick", "searchACustomer();");
}

    function createDatabase() {

        if (!window.indexedDB) {
            window.alert("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");
        }

        // This is what our customer data looks like.
            //to be changed to GetDataFromDatabase()!
        var playerData = [
            { id: 0, email: "admin@root", name: "root", gold: 0 },
        ];
        var dbName = "PlayerDB";

        // Open database with version=2. Use integer valueonly ! Not 1.1, 1.2 etc.
        var request = indexedDB.open(dbName, 2);
       
        request.onerror = function (event) {
            // Handle errors.
            console.log("request.onerror errcode = " + event.target.error.name);
        };
        request.onupgradeneeded = function (event) {
            console.log("request.onupgradeneeded, we are creating a new version of the dataBase");
            db = event.target.result;

            // Create an objectStore to hold information about our customers. We're
            // going to use "email" as our key path because it's guaranteed to be
            // unique.
            var objectStore = db.createObjectStore("player", { keyPath: "email" });

            // Create an index to search customers by name. We may have duplicates
            // so we can't use a unique index.
            objectStore.createIndex("name", "name", { unique: false });

            // Create an index to search customers by id. We want to ensure that
            // no two customers have the same id, so use a unique index.
            objectStore.createIndex("id", "id", { unique: true, autoIncrement: true });

            // Store values in the newly created objectStore.
            for (var i in playerData) {
                objectStore.add(playerData[i]);
            }
        };

        request.onsuccess = function (event) {
            // Handle errors.
            console.log("request.onsuccess, database opened, now we can add / remove / look for data in it!");
            // The result is the database itself
            db = event.target.result;
        };
    }



function addACustomer() {
    //check if DB exists
    if (db === null) {
        alert('Database must be opened first, please click the Create CustomerDB Database first');
        return;
    }

    //initialize transaction and define the type of operations we would do
    var transaction = db.transaction(["player"], "readwrite");

    // Do something when all the data is added to the database.
    transaction.oncomplete = function (event) {
        console.log("All done!");
    };

    //handle errors
    transaction.onerror = function (event) {
        console.log("transaction.onerror" + event.target.errorCode);
    };


    var objectStore = transaction.objectStore("player");

    var newCustomer = {};
   // newCustomer.id = Number(inputDB["id"].value);
    newCustomer.email = inputDB["email"].value;
    newCustomer.name = inputDB["name"].value;
    newCustomer.gold = inputDB["gold"].value;
    alert('adding customer email=' + newCustomer.email + ' name= ' + newCustomer.name);
    var request = objectStore.add(newCustomer);

    request.onsuccess = function (event) {
        console.log("Customer with email= " + event.target.result + " added.");
    };
    request.onerror = function (event) {
        alert("request.onerror, could not insert customer, errcode = " + event.target.error.name + ". Certainly either the idf or the email is already present in the Database");
    };

}
function removeACustomer() {
    if (db === null) {
        alert('Database must be opened first, please click the Create CustomerDB Database first');
        return;
    }

    var transaction = db.transaction(["player"], "readwrite");

    // Do something when all the data is added to the database.
    transaction.oncomplete = function (event) {
        console.log("All done!");
    };

    transaction.onerror = function (event) {
        console.log("transaction.onerror errcode=" + event.target.error.name);
    };

    var objectStore = transaction.objectStore("player");


    alert('removing player ' + inputDB["email"].value);
    var request = objectStore.delete(inputDB["email"].value);

    request.onsuccess = function (event) {
        console.log("Customer removed.");
    };

    request.onerror = function (event) {
        alert("request.onerror, could not remove player, errcode = " + event.target.error.name + ". The email does not exist in the Database");
    };

}
function updateACustomer() {
    if (db === null || undefined) {
        alert('Database must be opened first, please click the Create CustomerDB Database first');
        return;
    }

    var transaction = db.transaction(["player"], "readwrite");

    // Do something when all the data is added to the database.
    transaction.oncomplete = function (event) {
        console.log("All done!");
    };

    transaction.onerror = function (event) {
        console.log("transaction.onerror errcode=" + event.target.error.name);
    };

    var objectStore = transaction.objectStore("customers");

    var customerToUpdate = {};
    
    customerToUpdate.email = inputDB["email"].value;
    customerToUpdate.id = objectStore.get(customerToUpdate.email).result.id;
    customerToUpdate.name = inputDB["name"].value;
    customerToUpdate.age = inputDB["gold"].value;
    
    alert('updating customer email=' + customerToUpdate.email);

    var request = objectStore.put(customerToUpdate);

    request.onsuccess = function (event) {
        console.log("Customer updated.");
    };
    request.onerror = function (event) {
        alert("request.onerror, could not update customer, errcode = " + event.target.error.name + ". The id is not in the Database");
    };

}

function searchACustomer() {
    console.log('search');
    if (db === null) {
        alert('Database must be opened first, please click the Create CustomerDB Database first');
        return;
    }

    var transaction = db.transaction(["player"], "readwrite");

    // Do something when all the data is added to the database.
    transaction.oncomplete = function (event) {
        console.log("All done!");
    };

    transaction.onerror = function (event) {
        console.log("transaction.onerror errcode=" + event.target.error.name);
    };

    var objectStore = transaction.objectStore("player");

    var customerToSearch = {};

    customerToSearch.email = inputDB["email"].value;

    alert('Looking for customer email=' + customerToSearch.email);

    var request = objectStore.get(customerToSearch.email);

    request.onsuccess = function (event) {
        console.log("Customer found" + event.target.result.name);
        inputDB["id"].value = event.target.result.id;
        inputDB["name"].value = event.target.result.name;
        inputDB["gold"].value = event.target.result.gold;
        
    };
    request.onerror = function (event) {
        alert("request.onerror, could not find customer, errcode = " + event.target.error.name + ". The id is not in the Database");
    };

}
function searchACustomerShort() {
    if (db === null) {
        alert('Database must be opened first, please click the Create CustomerDB Database first');
        return;
    }

    db.transaction("player").objectStore("player")
        .get(inputDB["email"].value).onsuccess = function (event) {
            inputDB["name"].value = event.target.result.name;
            inputDB["gold"].value = event.target.result.gold;
            inputDB["id"].value = event.target.result.id;
        };
}

