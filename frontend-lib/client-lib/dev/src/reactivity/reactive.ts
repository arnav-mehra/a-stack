import StateObject from "./state.js";
import possiblyChanged from "./possiblyChanged.js";

export default class ReactiveObject {
    deps:       Array<ReactiveObject | StateObject>;    // parents: arg dependencies of callback.
    callback:   (...args: any[]) => any;                // reactive function.
    value:      any;                                    // cached result of callback.
    wasCalled:  boolean;                                // whether callback was ran after some update.
    reactives:  Set<ReactiveObject>;                    // children: effects if callback value changes.

    constructor(
        cb: (...args: any[]) => any,
        deps: Array<ReactiveObject | StateObject>
    ) {
        this.callback = cb;
        this.reactives = new Set();
        
        this.deps = deps;
        this.deps.forEach(d => d.addReactive(this));

        // run on init
        this.wasCalled = false;
        this.initialRun();
    }

    setCallback(cb: () => any) {
        this.callback = cb;
    }

    addReactive(r: ReactiveObject) {
        this.reactives.add(r);
    }

    // runners: always use in-order DFS.

    initialRun() {
        const args: any[] = this.deps.map(d => d.value);
        this.value = this.callback(...args);
        this.reactives.forEach(r => r.run());
    }

    run() {
        if (this.wasCalled) return;
        this.wasCalled = true;

        // compute.
        const prevValue = this.value;
        const args: any[] = this.deps.map(d => d.value);
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
    }

    removeReactive(r: ReactiveObject) {
        this.reactives.delete(r);
    }
}