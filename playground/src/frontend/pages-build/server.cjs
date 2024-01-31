const { Component } = require('a-stack-server');
                    
        
                    class Pages extends Component {
                        constructor(props) {
                            super(props);
                            this.title = "hi";

                        }
                        render() {
                            return (
                                this.Element("component", {
                        "name": "Hello"
                    }, [
                        
                    ])
                            )
                        }
                    }
                    
                    module.exports = Pages;