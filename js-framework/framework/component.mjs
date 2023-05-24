export default class ComponentObject {
    constructor(parent, root) {
        console.log({root})
        this.root = root;
        this.parent = parent || { ref: document.body };
    }

    render() {
        const rootRef = this.root.ref;
        this.parent.ref.appendChild(rootRef);
        return rootRef;
    }
    
    rerender() {
        this.root.rerender();
    }
}