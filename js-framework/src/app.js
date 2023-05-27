import {
    Component,
    Element,
    Text
} from "../framework/main.mjs";

import ConditionalComponent from "../framework/schemes/conditional.mjs";
import MapperComponent from "../framework/schemes/mapper.mjs";

let props = {};
let states = {};

export default class App extends Component {
    constructor(props) {
        super();
        console.log({props})

        states.count = this.State(0);
        states.items = this.State([
            { name: 'Item 1', price: 1.99 },
            { name: 'Item 2', price: 2.99 },
            { name: 'Item 3', price: 3.99 },
            { name: 'Item 4', price: 4.99 }
        ]);
        states.color = this.State('red');

        this.Effect(() => {
            console.log(states.count.value)
        }, [ states.count ]);
    }

    onMount() {}

    onUnmount() {
        states = {};
    }

    render() {
        return Element('span', {}, [   
            Element('button', {
                style: "display: block; margin-top: 10px;",
                onclick: () => {
                    // states.count.setState(prev => prev + 1);
                    states.items.setState(prev => {
                        prev.pop();
                        return prev;
                    });
                    // color.setState(prev => prev === 'red' ? 'blue' : 'red');
                },
            }, [
                Text('Click Me!')
            ]),
            
            // this.Component(
            //     ConditionalComponent,
            //     this.Reactive(c => c % 2, [ states.count ]),
            //     function() {
            //         return Element('p', {}, [ Text('Odd') ]);
            //     }
            // ),

            this.Component(
                MapperComponent,
                this.Reactive(x => x, [ states.items ]),
                function(i) {
                    return Element('p', {}, [
                        Text(this.Reactive(x => x[i].name, [ states.items ]))
                    ])
                }
            )
        ]);
    }
};

