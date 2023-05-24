export default class StateObject {
    constructor(initialValue) {
        this.value = initialValue;
        this.callbacks = [];
    }

    setState(newValue) {
        this.value = typeof newValue === 'function'
                     ? newValue(this.value)
                     : this.value = newValue;
        this.callbacks.forEach(callback => callback());
    }
}