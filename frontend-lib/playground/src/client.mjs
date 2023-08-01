import {
    Component, hydrate
} from '../../client-lib/dist/bundle';

export class Hello extends Component {
    constructor(props) {
        super(props);
    }

    onMount() {
        console.log("hello")
    }
    
    render() {
        return (
            this.Element("div", {}, [
                this.Text("hi")
            ])
        )
    }
}

hydrate();
