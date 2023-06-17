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

        const possiblyChanged = prevValue === undefined
                                || prevValue !== this.value
                                || (typeof this.value === 'object'
                                    && typeof prevValue === 'object');
        if (!possiblyChanged) return;

        this.reactives.forEach(r => r.run());
    }
}