const {
    ServerComponent,
    ClientEntry
} = require('../../server-lib/templating');

class Index extends ServerComponent {
    constructor() {
        super();
        this.title = "Hi Page";
    }
    
    render() { 
        return (
            this.Element("div", {}, [
                "hi"
            ])
        ) 
    }
}

module.exports = Index;