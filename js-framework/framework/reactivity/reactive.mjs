export default class ReactiveObject {
    constructor(component, func, deps) {
        component.reactives.push(this);
        this.deps = deps;
        this.func = func;
    }

    updateValue(updater) {
        const newValue = this.func(...this.deps.map(x => x.value));
        updater(newValue);
    }

    // updater: updates displayed value
    // this.updater: runs reactive reducer func & runs updater
    activate(updater) {
        this.updater = this.updateValue.bind(this, updater);
        this.updater();
        this.deps.forEach(x => x.callbacks.add(this.updater));
    }

    deactivate() {
        this.deps.forEach(x => x.callbacks.delete(this.updater));
        this.updater = undefined;
    }
}