import { Component } from 'a-stack-client';
                    
        
                    export default class Hello extends Component {
                        constructor(props) {
                            super(props);
                            this.title = "hi";

                        }
                        render() {
                            return (
                                this.Element("div", {
                        
                    }, [
                        this.Text("hello world")
                    ])
                            )
                        }
                    }