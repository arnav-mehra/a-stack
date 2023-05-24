import ElementObject from './element.mjs';
import ComponentObject from './component.mjs';
import TextObject from './text.mjs';
import StateObject from './state.mjs';
import MapperObject from './mapper.mjs';
import ReactiveObject from './reactive.mjs';

export function Component(parent, root) {
    return new ComponentObject(parent, root);
}

export function Element(
    tag, /* html tag */
    props /* { key: [value or Reactive] } */,
    children /* list child ElementObjects */
) {
    return new ElementObject(tag, props, children);
}

export function Text(input) { // either a displayable value or reactive
    return new TextObject(input);
}

export function Mapper(wrapper, arrState, func) {
    const mapperObj = new MapperObject(wrapper, arrState, func);
    return wrapper;
}

export function Reactive(func, deps) {
    return new ReactiveObject(func, deps);
}

export function State(initialValue) {
    return new StateObject(initialValue);
}