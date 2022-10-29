//getInterface() returning Singleton class Interface()
//class Interface() - encapsulates all methods for manipulating the DOM elements;  
var getInterface = (function () {
    var instance;
    function createInstance() {
       let object = new Interface();
        return object;
    }

    return {
            get: function () {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();

class Interface {
    constructor() {
        this.name = 'Interface';
    }
     getName() {
        return this.name;
    }
}