import { Component } from "../main.mjs";

export default class ConditionalObject {
    constructor(wrapper, reactive, trueFunc, falseFunc) {
        this.wrapper = wrapper;
        this.trueComponent = Component(this.wrapper, trueFunc);
        this.falseComponent = Component(this.wrapper, falseFunc);
        this.addReactivity(reactive);
    }

    addReactivity(reactive) {
        reactive.activate(this.updateBranch.bind(this));
    }

    updateBranch(newVal) {
        if (this.oldVal === undefined) { // initial render
            const mountingComponent = newVal ? this.trueComponent : this.falseComponent;
            mountingComponent.mount();
        }
        else if (newVal === this.oldVal) { // no change
            return;
        }
        else { // value changed
            const unmountingComponent = this.oldVal ? this.trueComponent : this.falseComponent;
            unmountingComponent.unmount();
            const mountingComponent = newVal ? this.trueComponent : this.falseComponent;
            mountingComponent.mount();
        }
        this.oldVal = newVal;
    }
}