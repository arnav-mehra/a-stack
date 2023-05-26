import { Component } from "../main.mjs";

export default class ConditionalObject {
    constructor(wrapper, reactive, trueFunc, falseFunc) {
        this.wrapper = wrapper;

        this.trueComponent = new Component();
        this.trueComponent._wrapper = this.wrapper;
        this.trueComponent.render = trueFunc;

        this.falseComponent = new Component();
        this.falseComponent._wrapper = this.wrapper;
        this.falseComponent.render = falseFunc;

        this.addReactivity(reactive);
    }

    addReactivity(reactive) {
        reactive.activate(this.updateBranch.bind(this));
    }

    updateBranch(newVal) {
        if (this.oldVal === undefined) { // initial render
            const mountingComponent = newVal ? this.trueComponent : this.falseComponent;
            mountingComponent._mount();
        }
        else if (newVal === this.oldVal) { // no change
            return;
        }
        else { // value changed
            const unmountingComponent = this.oldVal ? this.trueComponent : this.falseComponent;
            unmountingComponent._unmount();
            const mountingComponent = newVal ? this.trueComponent : this.falseComponent;
            mountingComponent._mount();
        }
        this.oldVal = newVal;
    }
}