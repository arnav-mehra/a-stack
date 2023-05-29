Name = 'HiComponent'

state = {
    count: 0,
    items: [
        { name: 'Item 1', price: 1 }
    ]
}

Effects = {
    [[state.count]]: () => {
        console.log(state.count)
    },
    [[state.items, state.count]]: () => {
        console.log(state.count)
    }
}

onMount = () => {
    return;
}

onUnmount = () => {
    return;
}

Render = {
    /* insert jsx-like syntax */
    [div]: {            // style: { color: 'red' }
        [button]: {
            [text]: 'Click Me!',
        },
        [button]: {
            [text]: 'Click Me!',
        },
    }
}