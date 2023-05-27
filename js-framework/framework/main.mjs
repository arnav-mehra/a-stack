export { default as Component } from './schemes/component.mjs';

import ElementObject from './nodes/element.mjs';
import TextObject from './nodes/text.mjs';

export function Element(
    tag = 'div', // html tag
    props = {}, // { key: [value || Reactive] }
    children = [] // list child ElementObjects
) {
    return new ElementObject(tag, props, children);
}

export function Text(
    input = '' /* value || reactive */
) {
    return new TextObject(input);
}