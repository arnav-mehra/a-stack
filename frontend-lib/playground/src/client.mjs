import {
    Component, hydrate
} from '../../client-lib/dist/bundle';

function _random(max) {
    return Math.round(Math.random() * 1000) % max;
}

const adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
const colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
const nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];  

const buttonStyle = `
    display: block;
    width: 100%;    
    color: #fff;
    background-color: #337ab7;
    border-color: #2e6da4;
    border: 1px solid transparent;
    border-radius: 4px;
    margin: 10px 0px;
    padding: 6px 12px;
`;
const tdStyle = `
    padding: 8px;
    line-height: 1.42857143;
    vertical-align: top;
    border-top: 1px solid #ddd;
`;

export class Hello extends Component {
    constructor(props) {
        super(props);
    }

    onMount() {
        this.State({
            arr: [],
            id: 1
        });
    }

    appendData(count) {
        this.state.arr.setState(arr => {
            for (var i = 0; i < count; i++) {
                const label = (
                    adjectives[_random(adjectives.length)]
                    + " " + colours[_random(colours.length)]
                    + " " + nouns[_random(nouns.length)]
                );
                arr.push({ id: this.state.id.value, label });
                this.state.id.setState(id => id + 1);
            }
            console.log(arr);
            return arr;
        });
    }

    createData(count) {
        this.state.arr.setState(arr => {
            arr.length = 0;
            for (var i = 0; i < count; i++) {
                const label = (
                    adjectives[_random(adjectives.length)]
                    + " " + colours[_random(colours.length)]
                    + " " + nouns[_random(nouns.length)]
                );
                arr.push({ id: i, label });
            }
            console.log(arr);
            return arr;
        });
    }

    clearData() {
        this.state.arr.setState(arr => {
            arr.length = 0;
            console.log(arr)
            return arr;
        });
    }

    updateData() {
        this.state.arr.setState(arr => {
            for (let i = 0; i < arr.length; i += 10) {
                const label = (
                    adjectives[_random(adjectives.length)]
                    + " " + colours[_random(colours.length)]
                    + " " + nouns[_random(nouns.length)]
                );
                arr[i].label = label;
            }
        });
    }

    removeRow(i) {
        this.state.arr.setState(arr => {
            arr.splice(i, 1);
            return arr;
        });
    }
    
    render() {
        return (
            this.Element("div", {}, [
                this.Element("div", {
                    style: `
                        background: lightgray;
                        padding: 10px;
                        border-radius: 8px;
                    `
                }, [
                    this.Element("div", {
                        style: `
                            text-align: center;
                            font-size: 30px;
                            margin: 10px 0px 20px 0px;
                        `
                    }, [
                        this.Text("A-Stack (non-keyed)")
                    ]),

                    this.Element("button", {
                        onclick: this.createData.bind(this, 1000),
                        style: buttonStyle
                    }, [
                        this.Text("Create 1,000 rows")
                    ]),

                    this.Element("button", {
                        onclick: this.createData.bind(this, 10000),
                        style: buttonStyle
                    }, [
                        this.Text("Create 10,000 rows")
                    ]),

                    this.Element("button", {
                        onclick: this.appendData.bind(this, 1000),
                        style: buttonStyle
                    }, [
                        this.Text("Append 1,000 rows")
                    ]),

                    this.Element("button", {
                        onclick: this.updateData.bind(this, 1000),
                        style: buttonStyle
                    }, [
                        this.Text("Update every 10th row")
                    ]),

                    this.Element("button", {
                        onclick: this.clearData.bind(this),
                        style: buttonStyle
                    }, [
                        this.Text("clear")
                    ]),

                    this.Element("button", {
                        onclick: this.clearData.bind(this),
                        style: buttonStyle
                    }, [
                        this.Text("Swap Rows")
                    ]),
                ]),                

                this.Element("table", {
                    class: 'table table-hover table-striped test-data'
                }, [
                    this.Mapper(
                        this.Element("tbody"),
                        this.Reactive(x => x, [ this.state.arr ]),
                        function(i) {
                            const labelReactive = this.Reactive(x => x[i].label, [this.state.arr]);
                            const idReactive = this.Reactive(x => x[i].id, [this.state.arr])
                            return (
                                this.Element("tr", {}, [
                                    this.Element("td", {
                                        class: 'col-md-1'
                                    }, [
                                        this.Text(idReactive)
                                    ]),
                                    this.Element("td", {
                                        class: 'col-md-4'
                                    }, [
                                        this.Element("a", {}, [
                                            this.Text(labelReactive)
                                        ]),
                                    ]),
                                    this.Element("td", {
                                        style: 'col-md-1'
                                    }, [
                                        this.Element("a", {}, [
                                            this.Element("span", {}, [
                                                this.Text('X')
                                            ]),
                                        ]),
                                    ]),
                                    this.Element("td", {
                                        style: 'col-md-6'
                                    })
                                ])
                            )
                        }
                    )
                ])
            ])
        )
    }
}

hydrate();