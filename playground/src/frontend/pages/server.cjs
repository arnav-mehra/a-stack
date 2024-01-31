const { Component } = require('a-stack-server');

class Index extends Component {
    constructor() {
        super();
        this.title = "A-Stack";
    }

    render() { 
        return (
            this.Element("component", {
                "name": "Hello"
            })
        );
    }
};

module.exports = Index;