class MyWidget extends HTMLElement {
    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: 'open' });

        let t = document.getElementById('mytemplate');
        shadowRoot.appendChild(document.importNode(t.content,true));
    }
}
try {
    customElements.define('my-widget', MyWidget);
    console.log('Element defined');
} catch (error) {
    console.log(error);
}
function init() {
    // Instanciate the template
    var t = document.querySelector('#mytemplate');

    // Create a root node under our H1 title
    var host = document.querySelector('#withShadowDom');

    const shadowRoot = host.attachShadow({ mode: 'open' });

    // insert something into the shadow DOM, this will be rendered
    shadowRoot.appendChild(document.importNode(t.content, true));

    
}