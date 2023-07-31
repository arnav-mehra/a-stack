import possiblyChanged from "./possiblyChanged.js";
export default class ReactiveObject {
    constructor(cb, deps) {
        this.callback = cb;
        this.reactives = new Set();
        this.deps = deps;
        this.deps.forEach(d => d.addReactive(this));
        // run on init
        this.wasCalled = false;
        this.initialRun();
    }
    setCallback(cb) {
        this.callback = cb;
    }
    addReactive(r) {
        this.reactives.add(r);
    }
    // runners: always use in-order DFS.
    initialRun() {
        const args = this.deps.map(d => d.value);
        this.value = this.callback(...args);
        this.reactives.forEach(r => r.run());
    }
    run() {
        if (this.wasCalled)
            return;
        this.wasCalled = true;
        // compute.
        const prevValue = this.value;
        const args = this.deps.map(d => d.value);
        this.value = this.callback(...args);
        // recurse on children if possible change detected.
        if (possiblyChanged(prevValue, this.value)) {
            this.reactives.forEach(r => r.run());
        }
        this.wasCalled = false;
    }
    // cleanup
    delete() {
        this.deps.forEach(d => d.removeReactive(this));
        this.deps = undefined;
        this.reactives.forEach(r => r.delete());
        this.reactives = undefined;
        this.value = undefined;
    }
    removeReactive(r) {
        this.reactives.delete(r);
    }
}
