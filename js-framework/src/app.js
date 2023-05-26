import {
    Component,
    Element, Text,
    Mapper, Conditional
} from "../framework/main.mjs";

export default class App extends Component {
    constructor(props) {
        super();
        console.log({props})

        this.count = this.State(0);

        this.Effect(() => {
            console.log(this.count.value)
        }, [ this.count ]);
    }

    onMount() { console.log('mounted'); }
    onUnmount() { console.log('unmounted'); }

    render() {
        return Element('div', {}, [   
            Text(this.Reactive(c => c, [ this.count ])),
            Element('button', {
                style: "display: block; margin-top: 10px;",
                onclick: () => {
                    this.count.setState(prev => prev + 1);
                },
            }, [
                Text('Click Me!')
            ]),
        ]);
    }
};

// this.color = this.State('red');
// this.items = this.State([
//     { name: 'Item 1', price: 1.99 },
//     { name: 'Item 2', price: 2.99 },
//     { name: 'Item 3', price: 3.99 },
//     { name: 'Item 4', price: 4.99 }
// ]);

// color.setState(prev => prev === 'red' ? 'blue' : 'red');
// items.setState(prev => { prev[0].name = 'x'; return prev; })

// Conditional(
//     Element(),
//     this.Reactive(c => c % 2, [ this.count ]),
//     () => Element('p', {}, [ Text('Even') ]),
//     () => Element('p', {}, [ Text('Odd') ])
// ),

// Mapper(
//     Element(), // wrapper/container
//     items, (component, i) => (
//         Element('div', {
//             style: Reactive(component, c => `color: ${c};`, [ color ])
//         }, [
//             Element('p', {}, [
//                 Text(Reactive(component, x => x[i].name, [ items ]))
//             ]),
//             Element('p', {}, [
//                 Text(Reactive(component, x => x[i].price, [ items ]))
//             ])
//         ])
//     )
// ),