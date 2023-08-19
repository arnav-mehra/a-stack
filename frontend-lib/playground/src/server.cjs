const {
    ServerComponent,
    ClientEntry
} = require('../../server-lib/templating');

class Index extends ServerComponent {
    constructor() {
        super();
        this.title = "Hi Page";
        this.styleSheets = [
            'main.css',
            'bootstrap.min.css',
            'currentStyle.css'
        ];
    }
    
    render() { 
        return (
            ClientEntry("Hello")
        ) 
    }
}

module.exports = Index;