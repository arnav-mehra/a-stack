export default class MapperObject {
    constructor(wrapper, arrState, func) {
        this.arrState = arrState;
        this.func = func;
        this.addReactivity();
        
        this.wrapper = wrapper;
        this.wrapper.setChildren(this.getChildren());
    }

    getChildren() {
        return this.arrState.value.map(
            (_, i) => this.func(i)
        )
    }

    addReactivity() {
        const updater = this.fixChildCount.bind(this);
        this.arrState.callbacks.add(updater);
    }

    addChild() {
        const wrapperRef = this.wrapper.ref;
        const newElement = this.func(wrapperRef.children.length);
        wrapperRef.appendChild(newElement.ref);
    }

    removeChild() {
        this.wrapper.ref.lastChild.remove();
    }

    fixChildCount() {
        const correctLength = this.arrState.value.length;
        while (this.wrapper.ref.children.length > correctLength) {
            this.removeChild();
        }
        while (this.wrapper.ref.children.length < correctLength) {
            this.addChild();
        }
    }
}