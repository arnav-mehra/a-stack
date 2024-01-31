function possiblyChanged(prev, curr) {
    if (prev !== curr)
        return true; // x -> y: definitely changed.
    return (typeof prev === 'object'
        && typeof curr === 'object'); // object -> object: possibly changed.
}

class ReactiveObject {
    constructor(cb, deps) {
        this.callback = cb;
        this.reactives = new Set();
        this.deps = deps;
        this.deps.forEach(d => d.addReactive(this));
        // run on init
        this.wasCalled = false;
        this.initialRun();
    }
    setCallback(cb) {
        this.callback = cb;
    }
    addReactive(r) {
        this.reactives.add(r);
    }
    // runners: always use in-order DFS.
    initialRun() {
        const args = this.deps.map(d => d.value);
        this.value = this.callback(...args);
        this.reactives.forEach(r => r.run());
    }
    run() {
        if (this.wasCalled)
            return;
        this.wasCalled = true;
        // compute.
        const prevValue = this.value;
        const args = this.deps.map(d => d.value);
        this.value = this.callback(...args);
        // recurse on children if possible change detected.
        if (possiblyChanged(prevValue, this.value)) {
            this.reactives.forEach(r => r.run());
        }
        this.wasCalled = false;
    }
    // cleanup
    delete() {
        this.deps.forEach(d => d.removeReactive(this));
        this.deps = undefined;
    }
    removeReactive(r) {
        this.reactives.delete(r);
    }
}

function Element(tag = 'div', props = {}, children = []) {
    const ref = document.createElement(tag);
    setProps(ref, props);
    setChildren(ref, children);
    return ref;
}
function setProps(ref, props) {
    for (const [key, val] of Object.entries(props)) {
        // TO-DO: Add support for more events
        // TO-DO: Add support for reactive event listeners
        if (key === 'onclick') {
            ref.addEventListener('click', val);
            continue;
        }
        if (val instanceof ReactiveObject) {
            new ReactiveObject(ref.setAttribute.bind(ref, key), [val]);
            val.run();
            continue;
        }
        ref.setAttribute(key, val);
    }
}
function setChildren(ref, children) {
    for (const child of children) {
        ref.appendChild(child);
    }
}

function Text(input = '') {
    if (input instanceof ReactiveObject) {
        return ReactiveText(input);
    }
    return document.createTextNode(input);
}
function ReactiveText(input) {
    const ref = document.createTextNode('');
    new ReactiveObject(updateText.bind(ref), [input]);
    return ref;
}
function updateText(t) {
    this.nodeValue = t;
}

class StateObject {
    constructor(initialValue) {
        this.value = initialValue;
        this.reactives = new Set();
    }
    addReactive(r) {
        this.reactives.add(r);
    }
    removeReactive(r) {
        this.reactives.delete(r);
    }
    setState(update) {
        const prevValue = this.value;
        this.value = typeof update === 'function'
            ? update(this.value)
            : update;
        if (possiblyChanged(prevValue, this.value)) {
            this.reactives.forEach(r => r.run());
        }
    }
}

// _variableName: means the method should not be used by the user.
class Component {
    constructor(wrapper = Element(), // component wrapper (components aren't fragments)
    props = {} // props passed down to component
    ) {
        this.props = props;
        this._wrapper = wrapper;
        this._reactives = [];
        this._children = [];
    }
    // USER METHODS
    State(initVal) {
        return new StateObject(initVal);
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

const hydrate = () => {
    const parents = Array.from(document.getElementsByTagName('component'));
    for (const parent of parents) {
        initComponent(parent);
    }
};
const initComponent = (parent) => {
    const attrs = parent.attributes;
    const propMap = {
        name: "Component"
    };
    for (let i = 0; i < attrs.length; i++) {
        const attr = attrs[i];
        propMap[attr.name] = attr.value;
    }
    const className = propMap['name'];
    const CompClass = eval(className);
    // mount off the dom tree.
    const wrapper = Element();
    const comp = new CompClass(wrapper, propMap);
    comp._mount();
    // swap into dom tree.
    const replacement = wrapper.children[0];
    wrapper.removeChild(replacement);
    parent.replaceWith(replacement);
};

class ConditionalComponent extends Component {
    constructor(wrapper, parent, reactive, trueRenderFunc) {
        super(wrapper, parent.props);
        this.state = parent.state;
        this.render = trueRenderFunc.bind(this);
        parent.Reactive(this.updateBranch.bind(this), [reactive]);
        // disable Component _mount calls.
        this._cmount = this._mount;
        this._mount = () => { };
    }
    updateBranch(val) {
        if (val) {
            this._cmount();
        }
        else {
            this._unmount();
        }
    }
}

class MapperComponent extends Component {
    constructor(wrapper, parent, reactive, mapperFunc) {
        super(wrapper, parent.props);
        this.state = parent.state;
        this.mapperFunc = mapperFunc;
        this.Reactive(this.fixChildCount.bind(this), [reactive]);
    }
    fixChildCount(newArr) {
        const correctLength = newArr.length;
        while (this._children.length > correctLength) {
            this.removeChild();
        }
        while (this._children.length < correctLength) {
            this.addChild();
        }
    }
    removeChild() {
        const removalChild = this._children.pop();
        removalChild === null || removalChild === void 0 ? void 0 : removalChild._unmount();
    }
    addChild() {
        const child = this.createChild(this._children.length);
        child._mount();
    }
    createChild(i) {
        const child = this._Component(Component, this._wrapper, this.props);
        child.state = this.state;
        child.render = this.mapperFunc.bind(child, i);
        return child;
    }
    _mount() { } // revoke parent mounting rights.
}

Component.prototype.Mapper = function (wrapper, reactive, mapperFunc) {
    return this.Component(MapperComponent, wrapper, this, reactive, mapperFunc);
};
Component.prototype.Conditional = function (wrapper, reactive, trueRenderFunc) {
    return this.Component(ConditionalComponent, wrapper, this, reactive, trueRenderFunc);
};

class Hello extends Component {
                        constructor(props) {
                            super(props);
                            this.title = "hi";

                        }
                        render() {
                            return (
                                this.Element("div", {
                        
                    }, [
                        this.Text("hello world")
                    ])
                            )
                        }
                    }

hydrate();

export { Hello };
