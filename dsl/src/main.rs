use pest::Parser;
use std::{fs};

mod ds;
mod parse;
use parse::{COMPS, get_component, ComponentParser, Rule};

fn main() {
    let str: String = fs::read_to_string("Test.jsq")
        .unwrap()
        .parse()
        .unwrap();

    let p: Vec<char> = str.chars().collect();
    println!("{:?}", p);

    let res = ComponentParser::parse(Rule::COMPONENT, &str)
        .unwrap();

    for c in res.into_iter() {
        get_component(c)
    }

    unsafe {
        println!("{:?}", COMPS);
    }
}
