export default class ReactiveObject {
    constructor(func, deps) {
        this.deps = deps;
        this.func = func;
    }

    updateValue(updater) {
        const newValue = this.func(...this.deps.map(x => x.value));

        const possiblyChanged = this.prevValue === undefined
                                || this.prevValue !== newValue
                                || typeof newValue === 'object';
        if (!possiblyChanged) return;
        this.prevValue = newValue;

        updater(newValue);
    }

    // updater: updates displayed value
    // this.updater: runs reactive reducer func & runs updater
    // NOTE: STRICT ORDERING
    activate(updater) {
        this.updater = this.updateValue.bind(this, updater);
        this.deps.forEach(x => x.callbacks.add(this.updater));
        this.updater();
    }

    deactivate() {
        this.deps.forEach(x => x.callbacks.delete(this.updater));
        this.updater = undefined;
    }
}