import Element from "../nodes/element.js";
import ReactiveObject from "../reactivity/reactive.js";
import Component from "./component.js";

export default class ConditionalComponent extends Component {
    _cmount: () => void;

    constructor(
        wrapper:        HTMLElement,
        parent:         Component,
        reactive:       ReactiveObject,
        trueRenderFunc: () => HTMLElement
    ) {
        super(wrapper, parent.props);
        this.state = parent.state;
        this.render = trueRenderFunc.bind(this);

        parent.Reactive(this.updateBranch.bind(this), [ reactive ]);

        // disable Component _mount calls.
        this._cmount = this._mount;
        this._mount = () => {};
    }

    updateBranch(val: boolean) {
        if (val) {
            this._cmount();
        } else {
            this._unmount();
        }
    }
}