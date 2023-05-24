export default class TextObject {
    constructor(func, deps) {
        if (typeof func !== 'function') {
            this.ref = document.createTextNode(func);
            return;
        }
        console.log({func, deps})

        this.ref = document.createTextNode('');
        this.updateText(func, deps);
        
        const updater = this.updateText.bind(this, func, deps);
        deps.forEach(x => x.callbacks.push(updater));
    }

    updateText(func, deps) {
        const newText = func(...deps.map(x => x.value));
        this.ref.nodeValue = newText;
    }
}