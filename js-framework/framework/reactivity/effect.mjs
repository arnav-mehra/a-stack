export default class EffectObject {
    constructor(func, deps) {
        this.deps = deps;
        this.func = func;
        this.deps.forEach(x => x.callbacks.add(this.func));
    }

    deactivate() {
        this.deps.forEach(x => x.callbacks.delete(this.updater));
    }
}