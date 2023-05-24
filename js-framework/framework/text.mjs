import ReactiveObject from "./reactive.mjs";

export default class TextObject {
    constructor(input) {
        if (input instanceof ReactiveObject) {
            this.ref = document.createTextNode('');
            this.ref.object = this;
            this.addReactivity(input);
            return;
        }
        // input is a constant displayable value
        this.ref = document.createTextNode(input);
        this.ref.object = this;
    }
    
    updateText(newText) {
        this.ref.nodeValue = newText;
    }

    addReactivity(reactive) {
        this.reactive = reactive;
        this.reactive.activate(this.updateText.bind(this));
    }
    
    removeReactivity() {
        for (const x of this.ref.childNodes) {
            x.object.removeReactivity();
        }
        this.reactive?.deactivate();
    }

    destroy() {
        this.removeReactivity();
        delete this.ref.object;
        this.ref.remove();
    }
}