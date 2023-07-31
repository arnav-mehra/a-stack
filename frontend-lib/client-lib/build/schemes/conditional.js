import Component from "./component.js";
export default class ConditionalComponent extends Component {
    constructor(wrapper, parent, reactive, trueRenderFunc) {
        super(wrapper, parent.props);
        this.state = parent.state;
        this.render = trueRenderFunc.bind(this);
        parent.Reactive(this.updateBranch.bind(this), [reactive]);
        // disable Component _mount calls.
        this._cmount = this._mount;
        this._mount = () => { };
    }
    updateBranch(val) {
        if (val) {
            this._cmount();
        }
        else {
            this._unmount();
        }
    }
}
