export default class StateObject {
    constructor(initialValue) {
        this.value = initialValue;
        this.callbacks = new Set();
    }

    setState(newValue) {
        this.value = typeof newValue === 'function'
                     ? newValue(this.value)
                     : newValue;
        this.callbacks.forEach(cb => cb());
    }
}