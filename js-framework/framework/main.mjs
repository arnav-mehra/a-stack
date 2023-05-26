export { default as Component } from './schemes/component.mjs';

import { Component } from './main.mjs';
import ElementObject from './nodes/element.mjs';
import TextObject from './nodes/text.mjs';

import ConditionalObject from './schemes/conditional.mjs';
import MapperObject from './schemes/mapper.mjs';

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
    reactive,
    trueFunc = () => Element(),
    falseFunc = () => Element()
) {
    const condObj = new ConditionalObject(wrapper, reactive, trueFunc, falseFunc)
    return wrapper;
}