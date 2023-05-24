export default class TextObject {
    constructor(func, deps) {
        if (typeof func !== 'function') {
            this.ref = document.createTextNode(func);
            this.ref.object = this;
            return;
        }
        
        this.ref = document.createTextNode('');
        this.ref.object = this;
        
        this.deps = deps;
        this.func = func;
        this.updateText();
        
        this.addReactivity();
    }

    addReactivity() {
        this.updater = this.updateText.bind(this);
        this.deps.forEach(x => x.callbacks.add(this.updater));
    }

    updateText() {
        const newText = this.func(...this.deps.map(x => x.value));
        this.ref.nodeValue = newText;
    }
    
    removeReactivity() {
        for (const x of this.ref.childNodes) {
            x.object.removeReactivity();
        }
        this.deps.forEach(x => x.callbacks.delete(this.updater));
        this.updater = undefined;
    }

    destroy() {
        this.removeReactivity();
        delete this.ref.object;
        this.ref.remove();
    }
}