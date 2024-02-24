import { Component } from 'a-stack-client';
                    
        
                    export default class Hello extends Component {
                        constructor(props) {
                            super(props);
                            
                        }
                        render() {
                            return (
                                this.Element("div", {
                        "id": "title"
                    }, [
                        this.Text("hello world")
                    ])
                            )
                        }
                    }