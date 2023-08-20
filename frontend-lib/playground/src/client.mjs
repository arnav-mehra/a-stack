import {
    Component, hydrate
} from '../../client-lib/dist/bundle';

function _random(max) {
    return Math.round(Math.random() * 1000) % max;
}

const adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
const colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
const nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];  

export class Hello extends Component {
    constructor(props) {
        super(props);
        
        this.State({
            id: 1,
            backup: null,
            start: 0,
            d: {
                arr: [],
                selected: null
            }
        });
        this.props.select = this.select.bind(this);
        this.props.delete = this.delete.bind(this);
    }

    removeAllRows() {
        this.state.d.setState(d => {
            d.arr.length = 0;
            d.selected = null;
            return d;
        });
    }

    buildData(count, clear = false, selected = null) {
        this.state.d.setState(d => {
            if (clear) d.arr.length = 0;
            for (var i = 0; i < count; i++) {
                const label = (
                    adjectives[_random(adjectives.length)]
                    + " " + colours[_random(colours.length)]
                    + " " + nouns[_random(nouns.length)]
                );
                d.arr.push({ id: this.state.id.value, label });
                this.state.id.setState(id => id + 1);
            }
            d.selected = selected;
            return d;
        });
    }
    
    updateData(selected = null) {
        this.state.d.setState(d => {
            for (let i = 0; i < d.arr.length; i += 10) {
                d.arr[i].label += " !!!";
            }
            d.selected = selected;
            return d;
        });
    }

    delete(i) {
        this.state.d.setState(d => {
            d.arr.splice(i, 1);
            return d;
        });
    }

    run() {
        this.buildData(1000, true, null);
    }

    add() {
        this.buildData(1000, false, null);
    }

    update() {
        this.updateData(null);
    }

    select(i) {
        this.state.d.setState(_ => {
            d.selected = i;
            return d;
        });
    }

    hideAll() {
        this.state.backup.setState(_ => this.state.arr.value);
        this.removeAllRows();
    }

    showAll() {
        this.state.d.setState(d => {
            d.arr.push(...this.state.backup.value);
            d.selected = null;
            return d;
        });
        this.state.backup.setState(_ => null);
    }

    runLots() {
        this.buildData(10000, true, null);
    }

    clear() {
        this.removeAllRows();
    }

    swapData() {
        this.state.d.setState(d => {
            if (d.arr.length > 998) {
                var a = d.arr[1];
                d.arr[1] = d.arr[998];
                d.arr[998] = a;
            }
            d.selected = null;
            return d;
        });
    }

    render() {
        return (
            this.Element("div", { class: "container" }, [
                this.Element("div", { class: "jumbotron" }, [
                    this.Element("div", { class: "row" }, [
                        // TITLE
                        this.Element("div", { class: "col-md-6" }, [
                            this.Element("h1", {}, [
                                this.Text("A-Stack (non-keyed)")
                            ])
                        ]),

                        // BUTTONS
                        this.Element("div", { class: "col-md-6" }, [
                            this.Element("div", { class: "row" }, [
                                this.Element("div", { class: "col-sm-6 smallpad" }, [
                                    this.Element("button", {
                                        onclick: this.run.bind(this, 1000),
                                        class: 'btn btn-primary btn-block',
                                        type: 'button',
                                        id: 'run'
                                    }, [
                                        this.Text("Create 1,000 rows")
                                    ])
                                ]),

                                this.Element("div", { class: "col-sm-6 smallpad" }, [
                                    this.Element("button", {
                                        onclick: this.runLots.bind(this),
                                        class: 'btn btn-primary btn-block',
                                        type: 'button',
                                        id: 'runlots'
                                    }, [
                                        this.Text("Create 10,000 rows")
                                    ])
                                ]),

                                this.Element("div", { class: "col-sm-6 smallpad" }, [
                                    this.Element("button", {
                                        onclick: this.add.bind(this),
                                        class: 'btn btn-primary btn-block',
                                        type: 'button',
                                        id: 'add'
                                    }, [
                                        this.Text("Append 1,000 rows")
                                    ])
                                ]),

                                this.Element("div", { class: "col-sm-6 smallpad" }, [
                                    this.Element("button", {
                                        onclick: this.update.bind(this),
                                        class: 'btn btn-primary btn-block',
                                        type: 'button',
                                        id: 'update'
                                    }, [
                                        this.Text("Update every 10th row")
                                    ])
                                ]),

                                this.Element("div", { class: "col-sm-6 smallpad" }, [
                                    this.Element("button", {
                                        onclick: this.clear.bind(this),
                                        class: 'btn btn-primary btn-block',
                                        type: 'button',
                                        id: 'clear'
                                    }, [
                                        this.Text("clear")
                                    ])
                                ]),

                                this.Element("div", { class: "col-sm-6 smallpad" }, [
                                    this.Element("button", {
                                        onclick: this.swapData.bind(this),
                                        class: 'btn btn-primary btn-block',
                                        type: 'button',
                                        id: 'swaprows'
                                    }, [
                                        this.Text("Swap Rows")
                                    ])
                                ])
                            ])
                        ])
                    ])
                ]),

                // TABLE
                this.Element("table", {
                    class: 'table table-hover table-striped test-data'
                }, [
                    this.Mapper(
                        this.Element("tbody", { id: 'tbody' }),
                        this.Reactive(d => d.arr, [ this.state.d ]),
                        function(i) {
                            const selectedReactive = this.Reactive(d => d.selected == i ? 'danger' : '', [ this.state.d ]);
                            const itemReactive = this.Reactive(d => d.arr[i], [ this.state.d ]);
                            const idReactive = this.Reactive(x => x.id, [ itemReactive ]);
                            const labelReactive = this.Reactive(x => x.label, [ itemReactive ]);

                            return (
                                this.Element("tr", {
                                    class: selectedReactive,
                                }, [
                                    this.Element("td", { class: 'col-md-1' }, [
                                        this.Text(idReactive)
                                    ]),
                                    this.Element("td", { class: 'col-md-4' }, [
                                        this.Element("a", {
                                            class: "lbl",
                                            onclick: () => this.props.select(i)
                                        }, [
                                            this.Text(labelReactive)
                                        ]),
                                    ]),
                                    this.Element("td", { class: 'col-md-1' }, [
                                        this.Element("a", {
                                            class: "remove",
                                            onclick: () => this.props.delete(i)
                                        }, [
                                            this.Element("span", {
                                                class: "remove glyphicon glyphicon-remove",
                                                "aria-hidden": "true"
                                            })
                                        ]),
                                    ]),
                                    this.Element("td", { class: 'col-md-6' })
                                ])
                            )
                        }
                    )
                ]),

                this.Element("span", {
                    class: "preloadicon glyphicon glyphicon-remove",
                    "aria-hidden": "true"
                })
            ])
        )
    }
}

hydrate();