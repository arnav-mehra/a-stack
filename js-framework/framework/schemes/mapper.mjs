import Component from "./component.mjs";

export default class MapperComponent extends Component {
    constructor(reactive, mapperFunc) {
        super();
        this.mapperFunc = mapperFunc;
        this.addReactivity(reactive);
    }

    addReactivity(reactive) {
        const updater = this.fixChildCount.bind(this);
        reactive.activate(updater);
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
        removalChild._unmount();
    }

    addChild() {
        const child = this.createChild(this._children.length);
        child._mount();
    }

    createChild(i) {
        const child = this._Component(Component);
        child.render = this.mapperFunc.bind(child, i);
        return child;
    }

    _mount() {} // give full control of mounting to reactivity.
}