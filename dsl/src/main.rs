use pest::Parser;
use std::{fs};

mod ds;
use ds::{Component};
mod parse;
use parse::{COMPS, get_component, ComponentParser, Rule};

fn read_file(path: &str) {
    let str: String = fs::read_to_string(path)
        .unwrap()
        .parse()
        .unwrap();

    let p: Vec<char> = str.chars().collect();
    println!("{:?}", p);

    let res = ComponentParser::parse(Rule::COMPONENT, &str)
        .unwrap();

    for c in res.into_iter() {
        let cp: Component = get_component(c);
        println!("{:?}", cp.serialize());
    }
}

fn main() {
    read_file("Test.jsq");
}
