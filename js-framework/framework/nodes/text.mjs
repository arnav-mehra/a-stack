import ReactiveObject from "../reactivity/reactive.mjs";

export default class TextObject {
    constructor(
        input = '' // value || ReactiveObject'
    ) {
        if (input instanceof ReactiveObject) {
            this.ref = document.createTextNode('');
            this.addReactivity(input);
            return;
        }
        // input is a constant displayable value
        this.ref = document.createTextNode(input);
    }
    
    updateText(newText) {
        this.ref.nodeValue = newText;
    }

    addReactivity(reactive) {
        reactive.activate(this.updateText.bind(this));
    }
}