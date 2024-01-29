import {
    Component, hydrate
} from '../../client-lib/dist/bundle';

export class Hello extends Component {
    constructor(props) {
        super(props);

        this.id = this.State(1);
        this.backup = this.State(null);
        this.start = this.State(0);
        this.d = this.State({
            arr: ["hi"],
            selected: null
        })
    }

    pushEl() {
        this.d.setState(a => {
            a.arr.push("hi")
            return a
        })
    }

    popEl() {
        this.d.setState(a => {
            a.arr.pop()
            return a
        })
    }

    render() {
        return (
            this.Element("div", {}, [
                this.Element("button", {
                    onclick: this.popEl.bind(this)
                }, [
                    this.Text("pop")
                ]),
                this.Element("button", {
                    onclick: this.pushEl.bind(this)
                }, [
                    this.Text("push")
                ]),
                this.Mapper(
                    this.Element("div"),
                    this.Reactive(d => d.arr, [ this.d ]),
                    function(i) {
                        const textReactive = this.Reactive(d => d.arr[i], [ this.d ]);
                        return (
                            this.Element("div", {}, [
                                this.Text(textReactive)
                            ])
                        )
                    }
                )
            ])
        )
    }
}

hydrate();