import ReactiveObject from "../reactivity/reactive.mjs";
import Component from "./component.mjs";

export default class ConditionalComponent extends Component {
    constructor(wrapper, parent, reactive, trueFunc) {
        super(wrapper);

        const child = this._Component(Component, parent.props);
        child.render = trueFunc.bind(child);
        child.state = parent.state;

        this.addReactivity(reactive);
    }

    addReactivity(reactive) {
        reactive.addReactive(
            new ReactiveObject(
                this.updateBranch.bind(this),
                [ reactive ]
            )
        );
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