import {
    Component, hydrate
} from '../../client-lib/dist/bundle';

export class Hello extends Component {
    constructor(props) {
        super(props);
        
        this.State({
            id: 1,
            backup: null,
            start: 0,
            d: {
                arr: ["hi"],
                selected: null
            }
        });
    }

    pushEl() {
        this.state.d.setState(a => {
            a.arr.push("hi")
            return a
        })
    }

    popEl() {
        this.state.d.setState(a => {
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
                    this.Reactive(d => d.arr, [ this.state.d ]),
                    function(i) {
                        const textReactive = this.Reactive(d => d.arr[i], [ this.state.d ]);
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