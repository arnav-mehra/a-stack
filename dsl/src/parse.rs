use pest_derive::Parser;
use pest::iterators::Pair;

use crate::ds::{Component, Element};

#[derive(Parser)]
#[grammar = "component.pest"]
pub struct ComponentParser;

pub fn get_component(c: Pair<'_, Rule>, name: &str) -> Component {
    let mut cp: Component = Component::new();
    cp.name = name
        .to_string()
        .chars()
        .take_while(|p| *p != '.')
        .collect();
    for e in c.into_inner() {
        match e.as_rule() {
            Rule::HTML_EL => cp.root = get_element(e),
            Rule::PROP_EL => cp.props = get_props(e),
            Rule::SCRIPT_EL => cp.script = get_script(e),
            _ => {}
        }
    }
    cp
}

fn get_props(e: Pair<'_, Rule>) -> Vec<String> {
    e.into_inner()
        .map(|p| p.as_str().to_string())
        .collect()
}

fn get_script(e: Pair<'_, Rule>) -> String {
    let mut s = "".to_string();
    for p in e.into_inner() {
        s += p.as_str();
    }
    s
}

fn get_element(e: Pair<'_, Rule>) -> Element {
    let mut el: Element = Element::new();
    
    for p in e.into_inner() {
        println!("p: {:?}", p.as_str());
        match p.as_rule() {
            Rule::TAG => {
                el.tag = p.as_str().to_string();
            }
            Rule::ATTR => {
                let v: Vec<&str> = p
                    .into_inner()
                    .map(|x| x.as_str())
                    .collect();
                el.attrs.push((
                    v[0].to_string(),
                    v[1].to_string()
                ))
            }
            Rule::HTML_EL => {
                let child: Element = get_element(p);
                el.children.push(child);
            }
            _ => {
                println!("pp: {p}");
            }
        }
    }

    el
}