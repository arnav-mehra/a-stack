import ReactiveObject from "./reactive";
import possiblyChanged from "./possiblyChanged";

export default class StateObject {
    value:      any;                    // value: current value of the state.
    reactives:  Set<ReactiveObject>;    // children: effects of state changes.

    constructor(initialValue: any) {
        this.value = initialValue;
        this.reactives = new Set();
    }

    addReactive(r: ReactiveObject) {
        this.reactives.add(r);
    }

    removeReactive(r: ReactiveObject) {
        this.reactives.delete(r);
    }

    setState(update: any) {
        const prevValue = this.value;
        this.value = typeof update === 'function'
                     ? update(this.value)
                     : update;
        if (possiblyChanged(prevValue, this.value)) {
            this.reactives.forEach(r => r.run());
        }
    }
}