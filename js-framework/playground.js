import { Component, Element, Text, State, Mapper, Reactive } from "./framework/main.mjs";

const color = State('red');
const count = State(0);
const items = State([
    { name: 'Item 1', price: 1.99 },
    { name: 'Item 2', price: 2.99 },
    { name: 'Item 3', price: 3.99 },
    { name: 'Item 4', price: 4.99 }
]);

Component(
    null,
    Element('div', { id: 'container' }, [
        Mapper(
            Element('div', {}, []), // wrapper/container
            items, (i) => (
                Element('div', {
                    style: Reactive((c) => `color: ${c};`, [ color ])
                }, [
                    Element('p', {}, [
                        Text(Reactive(x => x[i].name, [ items ]))
                    ]),
                    Element('p', {}, [
                        Text(Reactive(x => x[i].price, [ items ]))
                    ])
                ])
            )
        ),
        // Element('p', {}, [
        //     Text('Hi!')
        // ]),
        Element('button', {
            onclick: () => {
                // items.setState(prev => {
                //     console.log({prev})
                //     prev[0].name = 'x';
                //     return prev;
                // })
                items.setState(prev => {
                    prev.push({ name: 'x', price: 5.99 });
                    console.log({prev})
                    return prev;
                })
                // color.setState(prev => prev === 'red' ? 'blue' : 'red');
                // console.log({color})
            },
        }, [
            Text('Click Me!')
        ]),
        // Text(c => c, [ count ])
    ])
).render();