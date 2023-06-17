state = {
    count: 0,
    items: [
        { name: 'Item 1', price: 1 }
    ]
}

render = {
    div: { // onclick = handleClick
        button: { 
            text: 'Click Me!',
        },
        button: {
            text: () => state.count + 1,
        },
    }
}

module.exports = global;