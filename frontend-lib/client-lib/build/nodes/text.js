"use strict";
import ReactiveObject from "../reactivity/reactive.js";
export default function Text(input = '') {
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
