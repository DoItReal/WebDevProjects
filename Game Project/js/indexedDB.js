var divDB;
var buttonCreateDB, buttonRemoveCustomer, buttonUpdateCustomer, buttonSearchCustomer;
var db;
var fieldsetDB;
var inputDB = [];
function init_indexedDB() {
    divDB = document.createElement('div');
    document.body.appendChild(divDB);
        //style
    divDB.style = "border:1px solid black;margin:2px;padding:5px;";

    buttonCreateDB = document.createElement('button');
    divDB.appendChild(buttonCreateDB);
    buttonCreateDB.innerHTML = "Create DB";
    buttonCreateDB.setAttribute("onclick", "createDatabase();");

    fieldsetDB = document.createElement('fieldset');
    fieldsetDB.id = 'fieldsetDB';
    divDB.appendChild(fieldsetDB);
            //style

    inputDB = { "ssn": "", "name": "", "age": "", "email": "", "button": "" };

        inputDB["ssn"] = document.createElement("input");
        inputDB["ssn"].type = "text";
        inputDB["ssn"].placeholder = "444-44-4444";
        inputDB["ssn"].innerHTML = "444-44-4444";
        inputDB["ssn"].required = true;

        inputDB["name"] = document.createElement("input");
        inputDB["name"].type = "text";

        inputDB["age"] = document.createElement("input");
        inputDB["age"].type = "number";
        inputDB["age"].min = "1";
        inputDB["age"].max = "100";

        inputDB["email"] = document.createElement("input");
        inputDB["email"].type = "email";

        inputDB["button"] = document.createElement("button");
        inputDB["button"].innerHTML = "Add a new Customer";
        inputDB["button"].setAttribute('onclick', "addACustomer();");

    fieldsetDB.append("SSN: ");
    fieldsetDB.appendChild(inputDB["ssn"]);
    fieldsetDB.appendChild(document.createElement('br'));
    fieldsetDB.append("Name: ");
    fieldsetDB.appendChild(inputDB["name"]);
    fieldsetDB.appendChild(document.createElement('br'));
    fieldsetDB.append("Age: ");
    fieldsetDB.appendChild(inputDB["age"]);
    fieldsetDB.appendChild(document.createElement('br'));
    fieldsetDB.append("Email: ");
    fieldsetDB.appendChild(inputDB["email"]);
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
        var customerData = [
            { ssn: "444-44-4444", name: "Bill", age: 35, email: "bill@company.com" },
            { ssn: "555-55-5555", name: "Donna", age: 32, email: "donna@home.org" }
        ];
        var dbName = "CustomerDB";

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
            // going to use "ssn" as our key path because it's guaranteed to be
            // unique.
            var objectStore = db.createObjectStore("customers", { keyPath: "ssn" });

            // Create an index to search customers by name. We may have duplicates
            // so we can't use a unique index.
            objectStore.createIndex("name", "name", { unique: false });

            // Create an index to search customers by email. We want to ensure that
            // no two customers have the same email, so use a unique index.
            objectStore.createIndex("email", "email", { unique: true });

            // Store values in the newly created objectStore.
            for (var i in customerData) {
                objectStore.add(customerData[i]);
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
    var transaction = db.transaction(["customers"], "readwrite");

    // Do something when all the data is added to the database.
    transaction.oncomplete = function (event) {
        console.log("All done!");
    };

    //handle errors
    transaction.onerror = function (event) {
        console.log("transaction.onerror" + event.target.errorCode);
    };


    var objectStore = transaction.objectStore("customers");

    var newCustomer = {};
    newCustomer.ssn = inputDB["ssn"].value;
    newCustomer.name = inputDB["name"].value;
    newCustomer.age = inputDB["age"].value;
    newCustomer.email = inputDB["email"].value;
    alert('adding customer ssn=' + newCustomer.ssn);
    var request = objectStore.add(newCustomer);

    request.onsuccess = function (event) {
        console.log("Customer with ssn= " + event.target.result + " added.");
    };
    request.onerror = function (event) {
        alert("request.onerror, could not insert customer, errcode = " + event.target.error.name + ". Certainly either the ssn or the email is already present in the Database");
    };

}
function removeACustomer() {
    if (db === null) {
        alert('Database must be opened first, please click the Create CustomerDB Database first');
        return;
    }

    var transaction = db.transaction(["customers"], "readwrite");

    // Do something when all the data is added to the database.
    transaction.oncomplete = function (event) {
        console.log("All done!");
    };

    transaction.onerror = function (event) {
        console.log("transaction.onerror errcode=" + event.target.error.name);
    };

    var objectStore = transaction.objectStore("customers");


    alert('removing customer ' + inputDB["ssn"].value);
    var request = objectStore.delete(inputDB["ssn"].value);

    request.onsuccess = function (event) {
        console.log("Customer removed.");
    };

    request.onerror = function (event) {
        alert("request.onerror, could not remove customer, errcode = " + event.target.error.name + ". The ssn does not exist in the Database");
    };

}
function updateACustomer() {
    if (db === null) {
        alert('Database must be opened first, please click the Create CustomerDB Database first');
        return;
    }

    var transaction = db.transaction(["customers"], "readwrite");

    // Do something when all the data is added to the database.
    transaction.oncomplete = function (event) {
        console.log("All done!");
    };

    transaction.onerror = function (event) {
        console.log("transaction.onerror errcode=" + event.target.error.name);
    };

    var objectStore = transaction.objectStore("customers");

    var customerToUpdate = {};
    customerToUpdate.ssn = inputDB["ssn"].value;
    customerToUpdate.name = inputDB["name"].value;
    customerToUpdate.age = inputDB["age"].value;
    customerToUpdate.email = inputDB["email"].value;
    alert('updating customer ssn=' + customerToUpdate.ssn);

    var request = objectStore.put(customerToUpdate);

    request.onsuccess = function (event) {
        console.log("Customer updated.");
    };
    request.onerror = function (event) {
        alert("request.onerror, could not update customer, errcode = " + event.target.error.name + ". The ssn is not in the Database");
    };

}

function searchACustomer() {
    console.log('search');
    if (db === null) {
        alert('Database must be opened first, please click the Create CustomerDB Database first');
        return;
    }

    var transaction = db.transaction(["customers"], "readwrite");

    // Do something when all the data is added to the database.
    transaction.oncomplete = function (event) {
        console.log("All done!");
    };

    transaction.onerror = function (event) {
        console.log("transaction.onerror errcode=" + event.target.error.name);
    };

    var objectStore = transaction.objectStore("customers");

    var customerToSearch = {};

    customerToSearch.ssn = inputDB["ssn"].value;

    alert('Looking for customer ssn=' + customerToSearch.ssn);

    var request = objectStore.get(customerToSearch.ssn);

    request.onsuccess = function (event) {
        console.log("Customer found" + event.target.result.name);
        inputDB["name"].value = event.target.result.name;
        inputDB["age"].value = event.target.result.age;
        inputDB["email"].value = event.target.result.email;
    };
    request.onerror = function (event) {
        alert("request.onerror, could not find customer, errcode = " + event.target.error.name + ". The ssn is not in the Database");
    };

}
function searchACustomerShort() {
    if (db === null) {
        alert('Database must be opened first, please click the Create CustomerDB Database first');
        return;
    }

    db.transaction("customers").objectStore("customers")
        .get(inputDB["ssn"].value).onsuccess = function (event) {
            inputDB["name"].value = event.target.result.name;
            inputDB["age"].value = event.target.result.age;
            inputDB["email"].value = event.target.result.email;
        };
}

