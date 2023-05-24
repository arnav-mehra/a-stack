import { Component, Element, Text, State, Mapper } from "./framework/main.mjs";

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
            Element('div', {}, []),
            items, (i) => (
                Element('div', {}, [
                    Element('p', {}, [
                        Text(x => x[i].name, [ items ])
                    ]),
                    Element('p', {}, [
                        Text(x => x[i].price, [ items ])
                    ])
                ])
            )
        ),
        // Element('p', {}, [
        //     Text('Hi!')
        // ]),
        Element('button', {
            onclick: () => {
                items.setState(prev => {
                    prev.pop();
                    return prev;
                })
            },
        }, [
            Text('Click Me!')
        ]),
        // Text(c => c, [ count ])
    ])
).render();