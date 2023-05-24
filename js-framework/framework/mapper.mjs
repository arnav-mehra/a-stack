export default class MapperObject {
    constructor(wrapper, arrState, func) {
        this.arrState = arrState;
        this.func = func;
        
        const updater = this.fixChildCount.bind(this);
        this.arrState.callbacks.add(updater);

        this.wrapper = wrapper;
        this.wrapper.setChildren(this.getChildren());
    }

    getChildren() {
        return this.arrState.value.map((_, i) => this.func(i))
    }

    addChild() {
        const wrapperRef = this.wrapper.ref;
        wrapperRef.appendChild(
            this.func(wrapperRef.children.length)
        );
    }

    removeChild() {
        const removalChild = this.wrapper.ref.lastChild;
        removalChild.object.destroy();
    }

    fixChildCount() {
        while (this.wrapper.ref.children.length > this.arrState.value.length) {
            this.removeChild();
        }
        while (this.wrapper.ref.children.length < this.arrState.value.length) {
            this.addChild();
        }
    }
}