import Element from '../nodes/element';
export const hydrate = () => {
    const parents = Array.from(document.getElementsByTagName('component'));
    console.log(parents);
    for (const parent of parents) {
        initComponent(parent);
    }
};
const initComponent = (parent) => {
    const attrs = parent.attributes;
    const propMap = {
        name: "Component"
    };
    for (let i = 0; i < attrs.length; i++) {
        const attr = attrs[i];
        propMap[attr.name] = attr.value;
    }
    console.log(propMap);
    const className = propMap['name'];
    const CompClass = eval(className);
    console.log(CompClass);
    // mount off the dom tree.
    const wrapper = Element();
    const comp = new CompClass(wrapper, propMap);
    comp._mount();
    // swap into dom tree.
    const replacement = wrapper.children[0];
    wrapper.removeChild(replacement);
    parent.replaceWith(replacement);
};
