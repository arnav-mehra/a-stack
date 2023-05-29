import ReactiveObject from "../reactivity/reactive.mjs";

export default class ElementObject {
    constructor(
        tag = 'div',
        props = {}, // { key: [value || ReactiveObject] }
        children = [] // ElementObject[]
    ) {
        this.ref = document.createElement(tag);
        this.setProps(props);
        this.setChildren(children);
    }

    setProp(key, val) {
        this.ref.setAttribute(key, val);
    }

    setProps(props) {
        for (const [ key, val ] of Object.entries(props)) {
            // TO-DO: Add support for more events
            // TO-DO: Add support for reactive event listeners
            if (key === 'onclick') {
                this.ref.addEventListener('click', val);
                continue;
            }
            if (val instanceof ReactiveObject) {
                val.setCallback(this.setProp.bind(this, key));
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
}