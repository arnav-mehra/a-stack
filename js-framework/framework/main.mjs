import ElementObject from './nodes/element.mjs';
import TextObject from './nodes/text.mjs';

import ComponentObject from './schemes/component.mjs';
import ConditionalObject from './schemes/conditional.mjs';
import MapperObject from './schemes/mapper.mjs';

import StateObject from './reactivity/state.mjs';
import ReactiveObject from './reactivity/reactive.mjs';

export function MicroComponent(
    wrapper = { ref: document.body },
    render = () => Element()
) {
    return new MicroComponentObject(wrapper, render, onMount, onUnmount, reactives);
}

export function Component(
    wrapper = { ref: document.body },
    render = () => Element(),
    onMount = () => {},
    onUnmount = () => {},
    reactives = []
) {
    return new ComponentObject(wrapper, render, onMount, onUnmount, reactives);
}

export function Element(
    tag = 'div', // html tag
    props = {}, // { key: [value or Reactive] }
    children = [] // list child ElementObjects
) {
    return new ElementObject(tag, props, children);
}

export function Text(
    input = '' // either a displayable value or reactive
) {
    return new TextObject(input);
}

export function Mapper(
    wrapper = Element(), // parent/root of mapped elements
    arrState = State([]), // array state to map
    func = () => Element() // function to map each item to an element
) {
    const mapperObj = new MapperObject(wrapper, arrState, func);
    return wrapper;
}

export function Conditional(
    wrapper = Element(),
    reactive = Reactive(),
    trueElement = Element(),
    falseElement = Element()
) {
    const condObj = new ConditionalObject(wrapper, reactive, trueElement, falseElement)
    return wrapper;
}

export function Reactive(
    component = null,
    func = () => {},
    deps = []
) {
    return new ReactiveObject(component, func, deps);
}

export function State(
    initialValue = null
) {
    return new StateObject(initialValue);
}