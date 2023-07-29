import ReactiveObject from "../reactivity/reactive.mts";

export default function Element(
    tag:        keyof HTMLElementTagNameMap = 'div',
    props:      Object                      = {},
    children:   Array<HTMLElement>          = []
) {
    const ref: HTMLElement = document.createElement(tag);
    setProps(ref, props);
    setChildren(ref, children);
    return ref;
}

function setProps(
    ref: HTMLElement,
    props: Object
) {
    for (const [ key, val ] of Object.entries(props)) {
        // TO-DO: Add support for more events
        // TO-DO: Add support for reactive event listeners
        if (key === 'onclick') {
            ref.addEventListener('click', val);
            continue;
        }
        if (val instanceof ReactiveObject) {
            new ReactiveObject(
                ref.setAttribute.bind(ref, key),
                [ val ]
            );
            val.run();
            continue;
        }
        ref.setAttribute(key, val);
    }
}

function setChildren(
    ref: HTMLElement,
    children: HTMLElement[]
) {
    for (const child of children) {
        ref.appendChild(child);
    }
}