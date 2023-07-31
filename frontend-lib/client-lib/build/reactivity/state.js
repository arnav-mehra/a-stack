import possiblyChanged from "./possiblyChanged";
export default class StateObject {
    constructor(initialValue) {
        this.value = initialValue;
        this.reactives = new Set();
    }
    addReactive(r) {
        this.reactives.add(r);
    }
    removeReactive(r) {
        this.reactives.delete(r);
    }
    setState(update) {
        const prevValue = this.value;
        this.value = typeof update === 'function'
            ? update(this.value)
            : update;
        if (possiblyChanged(prevValue, this.value)) {
            this.reactives.forEach(r => r.run());
        }
    }
}
