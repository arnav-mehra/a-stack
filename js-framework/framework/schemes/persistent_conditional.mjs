// A conditional where both branches are rendered,
// but only one is visible at a time.

// Better to use when branches are large and the condition is frequently changing.

export default class PersistentConditionalObject {
    constructor(wrapper, reactive, trueElement, falseElement) {
        this.wrapper = wrapper;
        this.trueElement = trueElement;
        this.falseElement = falseElement;
        this.addReactivity(reactive);
    }

    addReactivity(reactive) {
        reactive.activate(this.updateBranch.bind(this));
    }

    updateBranch(val) {
        const wrapperRef = this.wrapper.ref;
        const newNode = val ? this.trueElement : this.falseElement;

        if (!this.oldNode) { // null -> new node
            wrapperRef.appendChild(newNode.ref);
        }
        else if (newNode === this.oldNode) { // old node -> same old node
            return;
        }
        else { // old node -> new node
            wrapperRef.replaceChild(newNode.ref, this.oldNode.ref);
        }
        this.oldNode = newNode;
    }
}