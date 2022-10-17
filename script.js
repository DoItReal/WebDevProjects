/* to attache a context menu to all divs, you can do this:

var divs = document.querySelectorAll(".div");

divs.forEach(function(d) {
    addContextMenu(d);
});
*/


window.onload = function init() {
    //defining RightClickButtonAPI
         //  var RightClickButton = new contextMenu;
    //starting RightClickButtonAPI
         // RightClickButton.start();

    //TO DO event that handles resizing of the window

//    window.addEventListener('resize', function (e) { _resizeHandler(e);}, false);
}
function _resizeHandler(e) {
    var divViewPort = document.querySelector('#viewport');
    var divNav = document.querySelector('#navigation');
    var divFooter = document.querySelector('#footer');
    console.log(divNav.clientHeight);
    divViewPort.style.height = ((window.innerHeight - divNav.clientHeight - divFooter.clientHeight - 8)+'px');
    //divViewPort.style.height = '100px';
    
}



