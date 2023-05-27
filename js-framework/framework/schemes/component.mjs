import { Element } from '../main.mjs';
import EffectObject from '../reactivity/effect.mjs';
import ReactiveObject from '../reactivity/reactive.mjs';
import StateObject from '../reactivity/state.mjs';

// _variableName: means the method should not be used by the user.

export default class Component {
    constructor() {
        this._wrapper = Element();
        // this._states = [];
        this._reactives = [];
        this._effects = [];
        this._children = [];
    }

    State(initialValue) {
        const state = new StateObject(initialValue);
        // this._states.push(state);
        return state;
    }
    
    Effect(func = () => {}, deps = []) {
        const boundFunc = func.bind(this);
        const effect = new EffectObject(boundFunc, deps);
        this._effects.push(effect);
        return effect;
    }

    Reactive(func, deps) {
        const reactive = new ReactiveObject(func, deps);
        this._reactives.push(reactive);
        return reactive;
    }

    Component(ComponentClass, ...props) {
        const child = this._Component(ComponentClass, ...props);
        return child._wrapper;
    }

    _Component(ComponentClass, ...props) {
        const child = new ComponentClass(...props);
        this._children.push(child);
        this._wrapper.ref.appendChild(child._wrapper.ref);
        return child;
    }

    _mount() {
        if (this._root) return;
        // 1. create this component's DOM tree.
        this._root = this.render();
        // 2. do steps 1-3 for all children.
        this._children.forEach(c => c._mount());
        // 3. mount the node.
        if (this._root) this._wrapper.ref.appendChild(this._root.ref);
        if (this.onMount) this.onMount();
    }

    _recursiveCleanup() {
        // 1. cleanup chlidren.
        this._children.forEach(c => c._recursiveCleanup());
        this._children = [];
        // 2. cleanup self.
        if (this.onUnmount) this.onUnmount();
        // this._states = [];
        this._reactives.forEach(r => r.deactivate());
        this._reactives = [];
        this._effects.forEach(e => e.deactivate());
        this._effects = [];
    }

    _unmount() {
        if (!this._root) return;
        this._recursiveCleanup();
        this._root.ref.remove();
        this._root = undefined;
    }
}