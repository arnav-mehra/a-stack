import Element from '../nodes/element.js';
import Text from '../nodes/text.js';

import ReactiveObject from '../reactivity/reactive.js';
import StateObject from '../reactivity/state.js';

// _variableName: means the method should not be used by the user.

export default class Component {
    props:      Object;             // props passed from parent component.
    state:      Object;             // states created within the component.

    _wrapper:   HTMLElement;        // parent to the component's root.
    _reactives: ReactiveObject[];   // effects created within the component.
    _children:  Component[];        // all child components.

    _root:      HTMLElement;        // root of component, child of parent.
    render:     () => HTMLElement;  // mounts component & sets root.

    onMount:    () => void;         // runs when the component mounts (user-defined).
    onUnmount:  () => void;         // runs when the component unmounts (user-defined).

    Mapper: (
        wrapper:    HTMLElement,
        reactive:   ReactiveObject,
        mapperFunc: (i: Number) => HTMLElement
    ) => HTMLElement;
    Conditional: (
        wrapper:        HTMLElement,
        reactive:       ReactiveObject,
        trueRenderFunc: () => HTMLElement
    ) => HTMLElement;

    constructor(
        wrapper: HTMLElement = Element(), // component wrapper (components aren't fragments)
        props:   Object      = {}         // props passed down to component
    ) {
        this.props = props;
        this.state = {};
        
        this._wrapper = wrapper;
        this._reactives = [];
        this._children = [];
    }

    // USER METHODS

    State(stateKeyVals: Object): void {
        for (const [ key, initVal ] of Object.entries(stateKeyVals)) {
            if (this.state[key]) {
                console.error(`State key "${key}" already exists.`);
                continue;
            }
            const state = new StateObject(initVal);
            this.state[key] = state;
        }
    }

    Reactive(
        cb:   (...args: any[]) => any,
        deps: Array<StateObject | ReactiveObject>
    ): ReactiveObject {
        const reactive = new ReactiveObject(cb, deps);
        this._reactives.push(reactive);
        return reactive;
    }

    Text(input: string | ReactiveObject): Text {
        return Text(input);
    }

    Element(
        tag:      keyof HTMLElementTagNameMap = 'div',
        props:    Object                      = {},
        children: Array<HTMLElement>          = []
    ): HTMLElement {
        return Element(tag, props, children);
    }

    Component(
        ComponentClass: any,
        wrapper:        HTMLElement,
        props:          Object,
        ...args:        any[]
    ): HTMLElement {
        const child = this._Component(ComponentClass, wrapper, props, ...args);
        return child._wrapper;
    }

    printReactiveTree(): void {}

    // INTERNAL METHODS

    _Component(
        ComponentClass: any,
        wrapper:        HTMLElement,
        props:          Object,
        ...args:        any[]
    ): Component {
        const child = new ComponentClass(wrapper, props, ...args);
        console.log(child)
        this._children.push(child);
        this._wrapper.appendChild(child._wrapper);
        return child;
    }

    _mount(): void {
        if (this._root) return;
        // 1. create this component's DOM tree.
        this._root = this.render();
        // 2. do steps 1-3 for all children.
        this._children.forEach(c => c._mount());
        // 3. mount the node.
        if (this._root) this._wrapper.appendChild(this._root);
        if (this.onMount) this.onMount();
    }

    _recursiveCleanup(): void {
        // 1. cleanup chlidren.
        this._children.forEach(c => c._recursiveCleanup());
        this._children = [];
        // 2. cleanup self.
        if (this.onUnmount) this.onUnmount();
        this._reactives.forEach(r => r.delete());
        this._reactives = [];
    }

    _unmount(): void {
        if (!this._root) return;
        this._recursiveCleanup();
        this._root.remove();
        this._root = undefined;
    }
}