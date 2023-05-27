// A conditional where both branches are rendered,
// but only one is visible at a time.

// Better to use when branches are large and the condition is frequently changing.

export default class PersistentConditionalObject {
    constructor(reactive, trueFunc) {
        super();
        const child = this._Component(Component);
        child.render = trueFunc.bind(child);
        this.addReactivity(reactive);
    }

    addReactivity(reactive) {
        reactive.activate(this.updateBranch.bind(this));
    }

    updateBranch(val) {
        this._wrapper.ref.setChildren(
            val ? [ this._children[0]._wrapper.ref ] : []
        );
    }

    _mount() {} // give full control of mounting to reactivity.

}