/* to attache a context menu to all divs, you can do this:

var divs = document.querySelectorAll(".div");

divs.forEach(function(d) {
    addContextMenu(d);
});
*/


window.onload = function init() {
    var RightClickButton = new contextMenu;
    RightClickButton.start();
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
var contextMenu = function () {
    var div1, menu, menuIsVisible;

    var addContextMenu = function (elem) {
        elem.addEventListener("contextmenu", function (e) {
            console.log("contextmenu activated");
            e.preventDefault();
            toggleMenuOn(e);
            positionMenu(e);
        });
    };

    var toggleMenuOn = function (e) {
        e.stopPropagation();
        if (!menuIsVisible) {
            menuIsVisible = true;
            menu.classList.add("context-menu--active");
        }
    };

    var toggleMenuOff = function (e) {
        e.stopPropagation();
        if (menuIsVisible) {
            menuIsVisible = false;
            menu.classList.remove("context-menu--active");            
        }
    };


    var positionMenu = function (e) {
        // Mouse position is relative to the element clicked

        // We make the coords absolute in the page
        var clickCoordsX = e.pageX;
        var clickCoordsY = e.pageY;


        var menuWidth = menu.offsetWidth + 1;
        var menuHeight = menu.offsetHeight + 1;

        var elementWidth = e.target.innerWidth;
        var elementHeight = e.target.innerHeight;

        if ((elementWidth - clickCoordsX) < menuWidth) {
            menu.style.left = elementWidth - menuWidth + "px";
        } else {
            menu.style.left = clickCoordsX + "px";
        }

        if ((elementHeight - clickCoordsY) < menuHeight) {
            menu.style.top = elementHeight - menuHeight + "px";
        } else {
            menu.style.top = clickCoordsY + "px";
        }
    };

    // Actions called when a menu item is choosen

    var menuItem1 = function (e) {
        console.log('learn');
        toggleMenuOff(e);
    };

    var menuItem2 = function (e) {
        console.log('clear');
        toggleMenuOff(e);
    };
    var main = function () {
        div1 = document.getElementById("navigation");
        menu = document.getElementById("context-menu");
        menuIsVisible = false;
        addContextMenu(div1);
        // Clicking anywhere on the window toggle the menu off
        window.addEventListener('click', toggleMenuOff);
        document.getElementById("context-menu-learn").addEventListener('click', menuItem1);
        document.getElementById("context-menu-clear").addEventListener('click', menuItem2);
        document.getElementById("context-menu-close").addEventListener('click', toggleMenuOff);
    };
    var start = function () {
        main();
    };
    return {
        start: start,
        menuItem1: menuItem1,
        menuItem2: menuItem2,
        toggleMenuOff: toggleMenuOff
    };
};



