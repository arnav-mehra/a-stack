"use strict";

import ReactiveObject from "../reactivity/reactive.mjs";

export default function Text(
    input = '' // value || ReactiveObject'
) {
    console.log({input})
    if (input instanceof ReactiveObject) {
        return ReactiveText(input);
    }
    // input is a constant displayable value
    return document.createTextNode(input);
}

function ReactiveText(input) {
    
    const ref = document.createTextNode('');
    new ReactiveObject(
        updateText.bind(ref),
        [ input ]
    );
    return ref;
}

function updateText(t) {
    this.nodeValue = t;
}

// export default class TextObject {
//     constructor(
//         input = '' // value || ReactiveObject'
//     ) {
//         if (input instanceof ReactiveObject) {
//             this.ref = document.createTextNode('');
//             this.addReactivity(input);
//             return;
//         }
//         // input is a constant displayable value
//         this.ref = document.createTextNode(input);
//     }
    
//     updateText(newText) {
//         this.ref.nodeValue = newText;
//     }

//     addReactivity(reactive) {
//         reactive.setCallback(this.updateText.bind(this));
//     }
// }