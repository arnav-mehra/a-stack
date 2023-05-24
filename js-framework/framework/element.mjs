import StateObject from "./state.mjs";

export default class ElementObject {
    constructor(tag, props, children) {
        this.ref = document.createElement(tag);
        this.setProps(props);
        this.setChildren(children);
    }

    setProp(key, val) {
        this.ref.setAttribute(key, val);
    }

    setProps(props) {
        for (const [ key, val ] of Object.entries(props)) {
            if (key === 'onclick') {
                this.ref.addEventListener('click', val);
                continue;
            }
            if (val instanceof StateObject) {
                val.callbacks.push(this.setProp.bind(this, key));
            }
            this.setProp(key, val);
        }
    }

    setChildren(children) {
        for (const child of children) {
            this.ref.appendChild(child.ref);
        }
    }
}