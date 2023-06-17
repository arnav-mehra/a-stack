const path = require('path');
const fs = require('fs');

const dirPath = path.resolve(__dirname, './');

const classes = {};

const createComponent = (
    {
        state, reactives,
        onMount, onUnmount, render
    },
    Component
) => {    
    class CompClass extends Component {
        constructor(wrapper, props) {
            super(wrapper, props);
            this.State(state);
            reactives.forEach(r => {
                // r -> ReactiveObject
            })
        }
        render() {
            // renderObject -> renderFunction
        }
    }
    CompClass.prototype.onMount = onMount;
    CompClass.prototype.onUnmount = onUnmount;
    return CompClass;
}

const run = async() => {
    const {Component} = await import('../framework/main.mjs');
    console.log(Component)
    fs.readdirSync(dirPath).forEach(file => {
        const res = require(dirPath + '/' + file);
        const name = file.substring(0, file.length - 3);
        if (name[0] === name[0].toLowerCase()) return;

        classes[name] = createComponent(res, Component);
    })
}
run();