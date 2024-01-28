#[derive(Debug)]
pub struct Component {
    pub name: String,
    pub props: Vec<String>,
    pub script: String,
    pub root: Element
}

#[derive(Debug)]
pub enum Node {
    Element(Element),
    Text(Text),
    None()
}

#[derive(Debug)]
pub struct Element {
    pub tag: String,
    pub attrs: Vec<(String, String)>,
    pub children: Vec<Node>
}

#[derive(Debug)]
pub struct Text {
    pub msg: String
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
}

impl Node {
    pub fn new() -> Self {
        Self::None()
    }

    pub fn with_txt(t: &str) -> Self {
        Self::Text(Text::new(t))
    }
}

impl Element {
    pub fn new() -> Self {
        Self {
            tag: String::new(),
            attrs: Vec::new(),
            children: Vec::new()
        }
    }
}

impl Text {
    pub fn new(m: &str) -> Self {
        Self {
            msg: m.to_string()
        }
    }
}