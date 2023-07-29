import ReactiveObject from "../reactivity/reactive.mts";
import Component from "./component.mts";

export default class MapperComponent extends Component {
    mapperFunc: (i: Number) => HTMLElement;

    constructor(
        wrapper:    HTMLElement,
        parent:     Component,
        reactive:   ReactiveObject,
        mapperFunc: (i: Number) => HTMLElement
    ) {
        super(wrapper, parent.props);
        this.state = parent.state;
        this.mapperFunc = mapperFunc;
        this.Reactive(this.fixChildCount.bind(this), [ reactive ]);
    }

    fixChildCount(newArr: any[]): void {
        const correctLength = newArr.length;
        while (this._children.length > correctLength) {
            this.removeChild();
        }
        while (this._children.length < correctLength) {
            this.addChild();
        }
    }
    
    removeChild(): void {
        const removalChild = this._children.pop();
        removalChild._unmount();
    }

    addChild(): void {
        const child = this.createChild(this._children.length);
        child._mount();
    }

    createChild(i: Number): Component {
        const child = this._Component(Component, this._wrapper, this.props);
        child.state = this.state;
        child.render = this.mapperFunc.bind(child, i);
        return child;
    }

    _mount() {} // revoke parent mounting rights.
}