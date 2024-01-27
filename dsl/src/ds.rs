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

    pub fn serialize(self) -> String {
        format!(
            "
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
                }}
            ",
            self.name,
            "",
            ""
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

    pub fn serialize(self) -> String {
        // let children = self.children.map(|c|)

        format!(
            "
                this.Element(\"{}\", {{{}}}, [
                    {}
                ])
            ",
            self.tag,
            "",
            ""
        )
    }
}