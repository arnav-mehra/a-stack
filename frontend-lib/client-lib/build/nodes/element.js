import ReactiveObject from "../reactivity/reactive.js";
export default function Element(tag = 'div', props = {}, children = []) {
    const ref = document.createElement(tag);
    setProps(ref, props);
    setChildren(ref, children);
    return ref;
}
function setProps(ref, props) {
    for (const [key, val] of Object.entries(props)) {
        // TO-DO: Add support for more events
        // TO-DO: Add support for reactive event listeners
        if (key === 'onclick') {
            ref.addEventListener('click', val);
            continue;
        }
        if (val instanceof ReactiveObject) {
            new ReactiveObject(ref.setAttribute.bind(ref, key), [val]);
            val.run();
            continue;
        }
        ref.setAttribute(key, val);
    }
}
function setChildren(ref, children) {
    for (const child of children) {
        ref.appendChild(child);
    }
}
