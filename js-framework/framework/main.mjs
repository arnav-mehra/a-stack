import ElementObject from './element.mjs';
import ComponentObject from './component.mjs';
import TextObject from './text.mjs';
import StateObject from './state.mjs';
import MapperObject from './mapper.mjs';

export function Component(parent, root) {
    return new ComponentObject(parent, root);
}

export function Element(tag, props, children) {
    return new ElementObject(tag, props, children);
}

export function Text(func, deps) {
    return new TextObject(func, deps);
}

export function Mapper(wrapper, arrState, func) {
    const mapperObj = new MapperObject(wrapper, arrState, func);
    return wrapper;
}

export function State(initialValue) {
    return new StateObject(initialValue);
}