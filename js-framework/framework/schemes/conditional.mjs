import Component from "./component.mjs";

export default class ConditionalComponent extends Component {
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
        if (val) {
            this._children[0]._mount();
        } else {
            this._children[0]._unmount();
        }
    }

    _mount() {} // give full control of mounting to reactivity.
}