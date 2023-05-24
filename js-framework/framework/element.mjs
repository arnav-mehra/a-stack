import ReactiveObject from "./reactive.mjs";
import StateObject from "./state.mjs";

export default class ElementObject {
    constructor(tag, props, children) {
        this.ref = document.createElement(tag);
        this.ref.object = this;

        this.setProps(props);
        this.setChildren(children);
    }

    setProp(key, val) {
        this.ref.setAttribute(key, val);
    }

    setProps(props) {
        for (const [ key, val ] of Object.entries(props)) {
            // TO-DO: Add support for more events
            if (key === 'onclick') {
                this.ref.addEventListener('click', val);
                continue;
            }
            if (val instanceof ReactiveObject) {
                val.activate(this.setProp.bind(this, key));
                continue;
            }
            this.setProp(key, val);
        }
    }

    setChildren(children) {
        for (const child of children) {
            this.ref.appendChild(child.ref);
        }
    }

    // Unmounting

    removeReactivity() {
        for (const x of this.ref.childNodes) {
            x.object.removeReactivity();
        }
    }

    destroy() {
        this.removeReactivity();
        delete this.ref.object;
        this.ref.remove();
    }
}