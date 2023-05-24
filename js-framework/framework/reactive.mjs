export default class ReactiveObject {
    constructor(func, deps) {
        this.deps = deps;
        this.func = func;
    }

    getValue() {
        return this.func(...this.deps.map(x => x.value));
    }

    // updater: updates displayed value
    // this.updater: runs reactive reducer func & runs updater
    activate(updater) {
        this.updater = this.setValue.bind(this, updater);
        this.updater();
        this.deps.forEach(x => x.callbacks.add(this.updater));
    }

    setValue(updater) {
        updater(this.getValue());
    }

    deactivate() {
        this.deps.forEach(x => x.callbacks.delete(this.updater));
        this.updater = undefined;
    }
}