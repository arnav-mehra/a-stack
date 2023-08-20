const {
    ServerComponent,
    ClientEntry
} = require('../../server-lib/templating');

class Index extends ServerComponent {
    constructor() {
        super();
        this.title = "A-Stack";
        this.styleSheets = [
            "currentStyle.css"
        ];
    }

    render() { 
        return (
            ClientEntry("Hello", {
                class: "container"
            })
        );
    }
};

module.exports = Index;