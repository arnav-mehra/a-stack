export default class ReactiveObject {
    constructor(
        cb, // bound(...args) => any
        deps // (ReactiveObject || StateObject)[] 
    ) {
        this.callback = cb;
        this.reactives = new Set();
        
        this.deps = deps;
        this.deps.forEach(d => d.addReactive(this));
        this.uncomputedDeps = this.deps.length;
    }

    setCallback(cb) {
        this.cb = cb;
    }

    addReactive(r) {
        this.reactives.add(r);
    }

    // runners

    runWithArgs(...args) {
        // mark this as computed for children.
        this.reactives.forEach(r => r.uncomputedDeps--);

        // compute and recurse on children (if necessary).
        const prevValue = this.value;
        this.value = this.callback(...args);

        const possiblyChanged = prevValue === undefined
                                || prevValue !== this.value
                                || (typeof this.value === 'object'
                                    && typeof prevValue === 'object');
        if (!possiblyChanged) return;
        
        this.reactives.forEach(r => r.run(this.value));
    }

    run() {
        if (this.uncomputedDeps) return;

        // mark this as computed for children.
        this.reactives.forEach(r => r.uncomputedDeps--);

        // compute and recurse on children (if necessary).
        const prevValue = this.value;
        const args = this.deps.map(d => d.value);
        this.value = this.callback(...args);

        const possiblyChanged = prevValue === undefined
                                || prevValue !== this.value
                                || (typeof this.value === 'object'
                                    && typeof prevValue === 'object');
        if (!possiblyChanged) return;
        
        this.reactives.forEach(r => r.run(this.value));

        // reset
        this.uncomputedDeps = this.deps.length;
    }

    // cleanup

    delete() {
        this.deps.forEach(d => d.removeReactive(this));
        this.deps = undefined;

        this.reactives.forEach(r => r.delete());
        this.reactives = undefined;

        this.func = undefined;
        this.value = undefined;
        this.uncomputedDeps = undefined;
    }

    removeReactive(r) {
        this.reactives.delete(r);
    }
}