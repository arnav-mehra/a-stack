use crate::ds::{Component, Element, Node, Text};

pub trait Stringify {
    fn stringify(&self) -> String;
}

impl Stringify for Component {
    fn stringify(&self) -> String {
        format!(
            "export class {} extends Component {{
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
}

impl Stringify for Text {
    fn stringify(&self) -> String {
        format!(
            "this.Text({})",
            self.msg,
        )
    }
}