use std::collections::HashMap;
use std::path::PathBuf;

#[derive(Debug, Copy, Clone)]
pub enum Target {
    CLIENT_ROOT,
    CLIENT_COMP,
    SERVER,
}

#[derive(Debug)]
pub struct Component {
    pub target: Target,
    pub path: PathBuf,
    pub name: String,
    pub props: Vec<String>,
    pub script: String,
    pub root: Element,
    pub imports: Vec<String>,
    pub exports: Vec<String>
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
    pub attrs: HashMap<String, String>,
    pub children: Vec<Node>
}

#[derive(Debug)]
pub struct Text {
    pub msg: String
}

impl Component {
    pub fn new(path: &PathBuf) -> Self {
        let ext = path.extension().unwrap().to_str().unwrap();
        let fname = path.file_prefix().unwrap().to_str().unwrap();
        let dname = path.parent().unwrap().file_name().unwrap().to_str().unwrap();

        println!("{ext}: {fname}");
        let target = match (ext, fname) {
            ("jsc", "client") => Target::CLIENT_ROOT,
            ("jsc", _) => Target::CLIENT_COMP,
            ("jss", _) | _ => Target::SERVER
        };
        let raw_name = match fname {
            "client" | "server" => dname,
            s => s 
        };
        let name: String = raw_name.chars().next().unwrap().to_uppercase().chain(raw_name.chars().skip(1)).collect();

        Self {
            name,
            target,
            path: path.clone(),

            props: Vec::new(),
            script: String::new(),
            root: Element::new(),
            imports: Vec::new(),
            exports: Vec::new()
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
            attrs: HashMap::new(),
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