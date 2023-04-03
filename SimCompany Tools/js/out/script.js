function init() {
    console.log('init');
    var url = "https://www.simcompanies.com/api/v3/market/0/1/";
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.send();
    request.responseType = "json";
    request.onload = function () {
        console.log('onload');
        console.log(request.response);
    };
    console.log('finish');
}
//# sourceMappingURL=script.js.map