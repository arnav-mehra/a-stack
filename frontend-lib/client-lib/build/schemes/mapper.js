import Component from "./component.js";
export default class MapperComponent extends Component {
    constructor(wrapper, parent, reactive, mapperFunc) {
        super(wrapper, parent.props);
        this.state = parent.state;
        this.mapperFunc = mapperFunc;
        this.Reactive(this.fixChildCount.bind(this), [reactive]);
    }
    fixChildCount(newArr) {
        const correctLength = newArr.length;
        while (this._children.length > correctLength) {
            this.removeChild();
        }
        while (this._children.length < correctLength) {
            this.addChild();
        }
    }
    removeChild() {
        const removalChild = this._children.pop();
        removalChild === null || removalChild === void 0 ? void 0 : removalChild._unmount();
    }
    addChild() {
        const child = this.createChild(this._children.length);
        child._mount();
    }
    createChild(i) {
        const child = this._Component(Component, this._wrapper, this.props);
        child.state = this.state;
        child.render = this.mapperFunc.bind(child, i);
        return child;
    }
    _mount() { } // revoke parent mounting rights.
}
