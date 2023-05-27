export default class StateObject {
    constructor(initialValue) {
        this.value = initialValue;
        this.callbacks = new Set();
    }

    setState(update) {
        this.value = typeof update === 'function'
                     ? update(this.value)
                     : update;
        
        const possiblyChanged = this.prevValue === undefined
                                || this.prevValue !== this.value
                                || typeof this.value === 'object';
        if (!possiblyChanged) return;
        this.prevValue = this.value;

        this.callbacks.forEach(cb => cb());
    }
}