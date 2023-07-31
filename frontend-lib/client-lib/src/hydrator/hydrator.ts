import Component from '../schemes/component';

export const hydrate = () => {
    const parents = Array.from(document.getElementsByTagName('component'));
    console.log(parents)
    for (const parent of parents) {
        if (parent.childElementCount) {
            continue; // avoid double hydration.
        }
        const comp = initComponent(parent as HTMLElement);
        comp._mount();
    }
};

const initComponent = (parent : HTMLElement) => {
    const attrs = parent.attributes;
    const propMap = {
        name: "Component"
    };
    for (let i = 0; i < attrs.length; i++) {
        const attr : Attr = attrs[i];
        propMap[attr.name] = attr.value;
    }
    console.log(propMap);

    const className : string = propMap['name'];
    const CompClass = eval(className);
    console.log(CompClass)
    return new CompClass(parent, propMap);
};