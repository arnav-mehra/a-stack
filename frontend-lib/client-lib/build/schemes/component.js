import Element from '../nodes/element.js';
import Text from '../nodes/text.js';
import ReactiveObject from '../reactivity/reactive.js';
import StateObject from '../reactivity/state.js';
// _variableName: means the method should not be used by the user.
export default class Component {
    constructor(wrapper = Element(), // component wrapper (components aren't fragments)
    props = {} // props passed down to component
    ) {
        this.props = props;
        this.state = {};
        this._wrapper = wrapper;
        this._reactives = [];
        this._children = [];
    }
    // USER METHODS
    State(stateKeyVals) {
        for (const [key, initVal] of Object.entries(stateKeyVals)) {
            if (this.state[key]) {
                console.error(`State key "${key}" already exists.`);
                continue;
            }
            const state = new StateObject(initVal);
            this.state[key] = state;
        }
    }
    Reactive(cb, deps) {
        const reactive = new ReactiveObject(cb, deps);
        this._reactives.push(reactive);
        return reactive;
    }
    Text(input) {
        return Text(input);
    }
    Element(tag = 'div', props = {}, children = []) {
        return Element(tag, props, children);
    }
    Component(ComponentClass, wrapper, props, ...args) {
        const child = this._Component(ComponentClass, wrapper, props, ...args);
        return child._wrapper;
    }
    printReactiveTree() { }
    // INTERNAL METHODS
    _Component(ComponentClass, wrapper, props, ...args) {
        const child = new ComponentClass(wrapper, props, ...args);
        console.log(child);
        this._children.push(child);
        return child;
    }
    _mount() {
        if (this._root)
            return;
        // 1. create this component's DOM tree.
        this._root = this.render();
        // 2. do steps 1-3 for all children.
        this._children.forEach(c => c._mount());
        // 3. mount the node.
        if (this.onMount)
            this.onMount();
        if (this._root)
            this._wrapper.appendChild(this._root);
    }
    _recursiveCleanup() {
        // 1. cleanup chlidren.
        this._children.forEach(c => c._recursiveCleanup());
        this._children = undefined;
        // 2. cleanup self.
        if (this.onUnmount)
            this.onUnmount();
        this._reactives.forEach(r => r.delete());
        this._reactives = undefined;
    }
    _unmount() {
        if (!this._root)
            return;
        this._recursiveCleanup();
        this._root.remove();
        this._root = undefined;
    }
}
