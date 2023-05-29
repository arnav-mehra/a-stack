import ElementObject from '../nodes/element.mjs';
import TextObject from '../nodes/text.mjs';

import ReactiveObject from '../reactivity/reactive.mjs';
import StateObject from '../reactivity/state.mjs';

// _variableName: means the method should not be used by the user.

export default class Component {
    constructor(
        wrapper = this.Element(), // component wrapper (components aren't fragments)
        props
    ) {
        this._wrapper = wrapper;
        this.props = props;
        this.state = {};

        this._reactives = [];
        this._children = [];
    }

    // USER METHODS

    State(stateKeyVals) {
        for (const [ key, initVal ] of Object.entries(stateKeyVals)) {
            if (this.state[key]) {
                console.error(`State key ${key} already exists.`);
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
        return new TextObject(input);
    }

    Element(tag, props, children) {
        return new ElementObject(tag, props, children);
    }

    Component(ComponentClass, wrapper, ...props) {
        const child = this._Component(ComponentClass, wrapper,...props);
        return child._wrapper;
    }

    printReactiveTree() {

    }

    // INTERNAL METHODS

    _Component(ComponentClass, wrapper, ...props) {
        const child = new ComponentClass(wrapper, ...props);
        this._children.push(child);
        this._wrapper.ref.appendChild(child._wrapper.ref);
        return child;
    }

    _mount() {
        if (this._root) return;
        // 1. create this component's DOM tree.
        this._root = this.render();
        // 2. do steps 1-3 for all children.
        this._children.forEach(c => c._mount());
        // 3. mount the node.
        if (this._root) this._wrapper.ref.appendChild(this._root.ref);
        if (this.onMount) this.onMount();
    }

    _recursiveCleanup() {
        // 1. cleanup chlidren.
        this._children.forEach(c => c._recursiveCleanup());
        this._children = [];
        // 2. cleanup self.
        if (this.onUnmount) this.onUnmount();
        this._reactives.forEach(r => r.delete());
        this._reactives = [];
    }

    _unmount() {
        if (!this._root) return;
        this._recursiveCleanup();
        this._root.ref.remove();
        this._root = undefined;
    }
}