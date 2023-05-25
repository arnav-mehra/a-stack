export default class ComponentObject {
    constructor(wrapper, render,
                onMount, onUnmount, reactives) {
        this.wrapper = wrapper;
        this.root = null;
        
        this.render = render;
        this.onMount = onMount;
        this.onUnmount = onUnmount;
        this.reactives = reactives;
    }

    mount() {
        if (this.root) return;

        this.onMount();

        this.root = this.render(this);
        this.wrapper.ref.appendChild(this.root.ref);
    }
    
    unmount() {
        if (!this.root) return;

        this.onUnmount();
        
        this.reactives.forEach(r => r.deactivate());
        this.reactives = [];

        this.root.ref.remove();
        this.root = null;
    }
}