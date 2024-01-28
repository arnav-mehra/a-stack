use pest_derive::Parser;
use pest::iterators::Pair;

use crate::ds::{Component, Element, Node};

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
    let mut s = String::new();
    for p in e.into_inner() {
        let n = get_text_node(p);
        s += &match n {
            Node::Text(txt) => txt.msg.clone(),
            _ => String::new()
        }
    }
    s
}

fn get_text_node(e: Pair<'_, Rule>) -> Node {
    match e.as_rule() {
        Rule::JS_STRING => {
            Node::with_txt(e.as_str())
        }
        Rule::JS_BLOCK => {
            Node::with_txt(
                e.clone()
                    .into_inner()
                    .map(|w| w.as_str())
                    .collect::<Vec<&str>>()
                    .first()
                    .unwrap()
            )
        }
        _ => Node::new()
    }
}

fn get_element(e: Pair<'_, Rule>) -> Element {
    let mut el: Element = Element::new();

    for p in e.into_inner() {
        match p.as_rule() {
            Rule::TAG => {
                el.tag = p.as_str().to_string();
            }
            Rule::ATTR => {
                let k = p
                    .clone()
                    .into_inner()
                    .rev()
                    .last()
                    .unwrap()
                    .as_str()
                    .to_string();
                
                let v = p
                    .clone()
                    .into_inner()
                    .last()
                    .unwrap()
                    .into_inner()
                    .last()
                    .unwrap();

                let v_str: String = match get_text_node(v) {
                    Node::Text(v_txt) => v_txt.msg,
                    _ => String::new()
                };
                el.attrs.push((k, v_str))
            }
            Rule::HTML_EL => {
                let child: Node = Node::Element(get_element(p));
                el.children.push(child);
            }
            Rule::TEXT_EL => {
                for x in p.into_inner() {
                    let child: Node = get_text_node(x);
                    el.children.push(child);
                }
            }
            _ => {}
        }
    }

    el
}