const { Component } = require('a-stack-server');
                    
        
                    class Pages extends Component {
                        constructor(props) {
                            super(props);
                            this.title = "hi";

    this.styleSheets = ["styles/main.css"
    ];

                        }
                        render() {
                            return (
                                this.Element("div", {
                        "style": "width: 100%; display: flex; justify-content: space-between;"
                    }, [
                        this.Element("component", {
                        "name": "Hello"
                    }, [
                        
                    ]),
this.Element("component", {
                        "name": "Hello"
                    }, [
                        
                    ])
                    ])
                            )
                        }
                    }
                    
                    module.exports = Pages;