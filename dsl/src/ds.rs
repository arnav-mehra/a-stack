#[derive(Debug)]
pub struct Component {
    pub name: String,
    pub props: Vec<String>,
    pub script: String,
    pub root: Element
}

impl Component {
    pub fn new() -> Self {
        Self {
            name: String::new(),
            props: Vec::new(),
            script: String::new(),
            root: Element::new()
        }
    }

    pub fn serialize(&self) -> String {
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
            self.root.serialize()
        )
    }
}

#[derive(Debug)]
pub struct Element {
    pub tag: String,
    pub attrs: Vec<(String, String)>,
    pub children: Vec<Element>
}

impl Element {
    pub fn new() -> Self {
        Self {
            tag: String::new(),
            attrs: Vec::new(),
            children: Vec::new()
        }
    }

    pub fn serialize(&self) -> String {
        let children: Vec<String> = self.children
            .iter()
            .map(|c| c.serialize())
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