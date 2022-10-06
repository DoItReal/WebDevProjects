
var n = 1;
setTimeout(function () { console.log('Worker self desctruction!');close(); }, 5000);
search: while (true) {
    n += 1;
    for (var i = 2; i <= Math.sqrt(n); i += 1)
        if (n % i == 0)
            continue search;
    // found a prime!
    postMessage(n);
}
