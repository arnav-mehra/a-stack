use pest_derive::Parser;
use pest::iterators::Pair;
use std::path::PathBuf;

use crate::ds::{Component, Element, Node, Target};

#[derive(Parser)]
#[grammar = "component.pest"]
pub struct ComponentParser;

pub fn get_component(parse_tree: Pair<'_, Rule>, path: &PathBuf) -> Component {
    let mut cp: Component = Component::new(path);
    for e in parse_tree.into_inner() {
        match e.as_rule() {
            Rule::HTML_EL => cp.root = get_element(e),
            Rule::PROP_EL => cp.props = get_props(e),
            Rule::IMPORT_EL => cp.imports = get_imports(e, cp.target),
            Rule::EXPORT_EL => cp.exports = get_exports(e, cp.target),
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

fn get_imports(e: Pair<'_, Rule>, target: Target) -> Vec<String> {
    let script: String = get_script(e);
    let imps = script.split(";");
    let cnt = imps.clone().count() - 1;

    match target {
        Target::CLIENT_COMP => {
            imps.take(cnt)
                .map(|p| "import ".to_owned() + &p.replace(".jsc", ".mjs"))
                .collect()
        }
        Target::SERVER => {
            imps.take(cnt)
                .map(|p| "const ".to_owned() + &p.replace(".jss", ".cjs"))
                .collect()
        }
        _ => vec![]
    }
}

fn get_exports(e: Pair<'_, Rule>, target: Target) -> Vec<String> {
    let script: String = get_script(e);
    let imps = script.split(";");
    let cnt = imps.clone().count() - 1;

    match target {
        Target::CLIENT_ROOT => {
            imps.take(cnt)
                .map(|p| "export ".to_owned() + &p.replace(".jsc", ".mjs"))
                .collect()
        }
        _ => vec![]
    }
}

fn get_script(e: Pair<'_, Rule>) -> String {
    let block = e.into_inner().next().unwrap();
    get_inner_script(block)
}

fn get_inner_script(block: Pair<'_, Rule>) -> String {
    let js_block = block.into_inner().next().unwrap();
    let js_block_boc = js_block.into_inner().next().unwrap();
    let inner = js_block_boc.into_inner().next().unwrap();
    get_block(inner)
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

                el.attrs.insert(k, v_str);
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

fn get_text_node(e: Pair<'_, Rule>) -> Node {
    match e.as_rule() {
        Rule::JS_STRING => {
            Node::with_txt(e.as_str())
        }
        Rule::BLOCK => {
            Node::with_txt(get_inner_script(e).as_str())
        }
        _ => Node::new()
    }
}

fn get_block(e: Pair<'_, Rule>) -> String {
    let mut s: String = String::new();
    let ch = e.clone().into_inner().next();

    match e.as_rule() {
        Rule::BLOCK | Rule::JS_BLOCK => {
            s += get_block(ch.unwrap()).as_str();
        }
        Rule::JS_BLOCK_B => {
            s += "[";
            s += get_block(ch.unwrap()).as_str();
            s += "]";
        }
        Rule::JS_BLOCK_C => {
            s += "{";
            s += get_block(ch.unwrap()).as_str();
            s += "}";
        }
        Rule::JS_BLOCKINNER => {
            for x in e.into_inner() {
                s += get_block(x).as_str();
            }
        }
        Rule::JS_BLOCKLESS => {
            s += e.as_str();
        }
        Rule::REACTIVE => {
            let mut it = e.into_inner();
            let deps = it.next().unwrap();
            let cb: String = get_block(it.next().unwrap());

            let params: Vec<&str> = deps
                .clone()
                .into_inner()
                .map(|x| x.as_str().split(".").last().unwrap())
                .collect();

            s += format!(
                "this.Reactive(({}) => {}, [{}])",
                params.join(","),
                cb,
                deps.as_str()
            ).as_str();
        }
        Rule::STATE => {
            let mut it = e.into_inner();
            let expr: String = get_block(it.next().unwrap());

            s += format!(
                "this.State({})",
                expr
            ).as_str();
        }
        _ => {}
    }

    s
}