"use strict";

import ReactiveObject from "../reactivity/reactive.js";

export default function Text(
    input: string | ReactiveObject = ''
): Text {
    if (input instanceof ReactiveObject) {
        return ReactiveText(input);
    }
    return document.createTextNode(input);
}

function ReactiveText(input: ReactiveObject) {
    const ref = document.createTextNode('');
    new ReactiveObject(
        updateText.bind(ref),
        [ input ]
    );
    return ref;
}

function updateText(t: string) {
    this.nodeValue = t;
}