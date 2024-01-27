use pest::Parser;
use std::{fs, path};
use fs::{ReadDir};
use path::{Path, PathBuf};

mod ds;
use ds::{Component};
mod parse;
use parse::{get_component, ComponentParser, Rule};

fn read_file(path: &Path, name: &str) {
    let str: String = fs::read_to_string(path)
        .unwrap()
        .parse()
        .unwrap();

    let p: Vec<char> = str.chars().collect();
    println!("{:?}", p);

    let res  = ComponentParser::parse(Rule::COMPONENT, &str)
        .unwrap();

    for c in res.into_iter() {
        let cp: Component = get_component(c, name);
        let res: String = cp.serialize();
        println!("{res}");
    }
}

fn iter_folder(dir: &Path) {
    for ent in fs::read_dir(dir).unwrap() {
        let path: PathBuf = ent.unwrap().path();
        if path.is_dir() {
            iter_folder(&path);
        } else {
            let prefix: String = dir.to_str().unwrap().to_owned() + "\\";
            let name: &str = path.to_str().unwrap().strip_prefix(&prefix).unwrap();
            read_file(&path, name);
        }
    }
}

fn main() {
    iter_folder(Path::new("./test"));
}
