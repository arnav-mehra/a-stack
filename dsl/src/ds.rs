#[derive(Debug)]
pub struct Component {
    pub props: Vec<String>,
    pub script: String,
    pub root: Element
}

impl Component {
    pub fn new() -> Self {
        Self {
            props: vec![],
            script: "".to_string(),
            root: Element::new()
        }
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
            tag: "".to_string(),
            attrs: vec![],
            children: vec![]
        }
    }
}