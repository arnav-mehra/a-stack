use crate::ds::{Component, Element, Node, Text};

pub trait Stringify {
    fn stringify(&self) -> String;
}

impl Stringify for Component {
    fn stringify(&self) -> String {
        format!(
            "
            {}

            export class {} extends Component {{
                constructor(props) {{
                    super(props);
                    {}
                }}
                render() {{
                    return (
                        {}
                    )
                }}
            }}",
            self.imports.join("\n"),
            self.name,
            self.script,
            self.root.stringify()
        )
    }
}

impl Stringify for Node {
    fn stringify(&self) -> String {
        match self {
            Node::Element(el) => el.stringify(),
            Node::Text(txt) => txt.stringify(),
            Node::None() => String::new()
        }
    }
}

impl Stringify for Element {
    fn stringify(&self) -> String {
        let mut spl = self.tag.split(":");
        let tag = spl.next().unwrap();
        let mode = spl.next();

        match mode {
            Some("map") => {
                let mut wrapper_attrs = self.attrs.clone();
                let array = wrapper_attrs.remove("arr").unwrap();
                let closure = wrapper_attrs.remove("ctx").unwrap();
                let ch_node = self.children.first().unwrap();

                let patched_closure = closure
                    .strip_suffix("}").unwrap().to_owned()
                    + "\nreturn (" + &ch_node.stringify() + ")}";

                let wrapper: Element = Element {
                    tag: tag.to_string(),
                    attrs: wrapper_attrs,
                    children: vec![]
                };

                format!(
                    "this.Mapper(
                        {},
                        {},
                        {}
                    )",
                    wrapper.stringify(),
                    array,
                    patched_closure
                )
            }
            Some("cond") => {
                let mut wrapper_attrs = self.attrs.clone();
                let condition = wrapper_attrs.remove("if").unwrap();
                let ch_node = self.children.first().unwrap();

                let wrapper: Element = Element {
                    tag: tag.to_string(),
                    attrs: wrapper_attrs,
                    children: vec![]
                };

                format!(
                    "this.Conditional(
                        {},
                        {},
                        {}
                    )",
                    wrapper.stringify(),
                    condition,
                    ch_node.stringify()
                )
            }
            Some(component) => {
                let mut wrapper_attrs = self.attrs.clone();
                // let var = wrapper_attrs.remove("var").unwrap();
                let props = match wrapper_attrs.remove("props") {
                    Some(x) => x,
                    None => String::from("{}")
                };

                let wrapper: Element = Element {
                    tag: tag.to_string(),
                    attrs: wrapper_attrs,
                    children: vec![]
                };

                format!(
                    "this.Component(
                        {},
                        {},
                        {}
                    )",
                    component,
                    wrapper.stringify(),
                    props
                )
            }
            None => {
                let children: Vec<String> = self.children
                    .iter()
                    .map(|c| c.stringify())
                    .collect();
                let children_str: String = children.join(",\n");

                let attrs: Vec<String> = self.attrs
                    .iter()
                    .map(|(k, v)| "\"".to_owned() + k + "\"" + ": " + v)
                    .collect();
                let attr_str: String = attrs.join(",\n");

                format!(
                    "this.Element(\"{}\", {{
                        {}
                    }}, [
                        {}
                    ])",
                    self.tag,
                    attr_str,
                    children_str
                )
            }
            _ => String::new()
        }
    }
}

impl Stringify for Text {
    fn stringify(&self) -> String {
        format!(
            "this.Text({})",
            self.msg,
        )
    }
}