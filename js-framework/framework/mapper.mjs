export default class MapperObject {
    constructor(wrapper, arrState, func) {
        this.arrState = arrState;
        this.func = func;
        
        const updater = this.fixChildCount.bind(this);
        arrState.callbacks.push(updater);

        this.wrapper = wrapper;
        this.wrapper.setChildren(this.getChildren());
    }

    getChildren() {
        return this.arrState.value.map((_, i) => this.func(i))
    }

    addChild() {
        this.wrapper.ref.appendChild(this.func(this.wrapper.children.length));
    }

    removeChild() {
        this.wrapper.ref.removeChild(this.wrapper.lastChild);
    }

    fixChildCount() {
        while (this.wrapper.children.length > this.arrState.value.length) {
            this.removeChild();
        }
        while (this.wrapper.children.length < this.arrState.value.length) {
            this.addChild();
        }
    }
}