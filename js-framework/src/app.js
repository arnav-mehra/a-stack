import { Component } from "../framework/main.mjs";

export default class App extends Component {
    constructor(props) {
        super(props);
        
        this.State({
            count: 0,
            items: [
                { name: 'Item 1', price: 1.99 },
                { name: 'Item 2', price: 2.99 },
                { name: 'Item 3', price: 3.99 },
                { name: 'Item 4', price: 4.99 }
            ],
            color: 'red'
        });

        this.Reactive(() => {
            console.log('count:', this.state.count.value);
        }, [ this.state.count ]);
    }

    onMount() {
        console.log('mounted');
    }

    onUnmount() {
        console.log('unmounted');
    }

    render() {
        return this.Element('span', {}, [   
            this.Element('button', {
                // style: this.Reactive(
                //     c => `color: ${c};`, [ this.state.color ]
                // ),
                onclick: () => {
                    // this.state.count.setState(prev => prev + 1);
                    this.state.items.setState(prev => {
                        prev.pop();
                        return prev;
                    });
                    // this.state.items.setState(prev => {
                    //     prev[0].name = 'pp';
                    //     return prev;
                    // })
                    // this.state.color.setState(prev => prev === 'red' ? 'blue' : 'red');
                },
            }, [
                this.Text('Click Me!')
            ]),

            this.Element('button', {
                onclick: () => {
                    this.state.items.setState(prev => {
                        prev.push({ name: 'Item ' + (prev.length + 1) });
                        return prev;
                    });
                }
            }, [
                this.Text('Click Me!')
            ]),
            
            this.Text(
                this.Reactive(
                    x => !!x.length, [ this.state.items ] 
                )
            ),

            // this.Conditional(
            //     this.Element(),
            //     this.Reactive(c => c % 2, [ this.state.count ]),
            //     function() {
            //         return this.Text('Odd');
            //     }
            // ),
            // this.Conditional(
            //     this.Element(),
            //     this.Reactive(c => !(c % 2), [ this.state.count ]),
            //     function() {
            //         return this.Text('Even');
            //     }
            // ),

            this.Mapper(
                this.Element(),
                this.Reactive(x => x, [ this.state.items ]),
                function(i) {
                    return this.Element('p', {}, [
                        this.Text(this.Reactive(x => x[i].name, [ this.state.items ]))
                    ])
                }
            )
        ]);
    }
};

