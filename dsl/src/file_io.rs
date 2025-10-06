use pest::Parser;
use std::{fs, io::Write, path};
use path::{Path, PathBuf};

use crate::stringify::Stringify;
use crate::ds::Component;
use crate::parse::{get_component, ComponentParser, Rule};

pub fn print_char_cnt(msg: &str, str: &str) -> usize {
    let ch_cnt = str.chars()
        .filter(|x| x.is_whitespace())
        .count();
    println!("{} char count (no whitespace): {}", msg, ch_cnt);

    ch_cnt
}

pub fn read_file(path: &PathBuf) -> String {
    let ext: &str = path.extension().unwrap().to_str().unwrap();
    let str: String = fs::read_to_string(path).unwrap().parse().unwrap();

    match ext {
        "jsc" | "jss" => {
            let parse_tree = ComponentParser::parse(Rule::COMPONENT, &str)
                .unwrap()
                .into_iter()
                .last()
                .unwrap();
            let cp: Component = get_component(parse_tree, path);
            let cp_str = cp.stringify();

            let n1 = print_char_cnt("JS[C/S]", str.as_str()) as f32;
            let n2 = print_char_cnt("JS", cp_str.as_str()) as f32;
            println!("Saved writing {}% chars!", (100.0 * (n2 - n1) / n2).round());
            cp_str
        }
        _ => str
    }    
}

pub fn iter_folder(out_root: &PathBuf, in_root: &PathBuf, dir: &PathBuf) {
    for ent in fs::read_dir(dir).unwrap() {
        let path: PathBuf = ent.unwrap().path();
        
        if path.is_dir() {
            iter_folder(out_root, in_root, &path);
        }
        else {
            let g_old_prefix = in_root.to_str().unwrap();
            let g_new_prefix = out_root.to_str().unwrap();
            
            let out_name: String = path
                .to_str().unwrap()
                .replacen(g_old_prefix, g_new_prefix, 1)
                .replace(".jsc", ".mjs")
                .replace(".jss", ".cjs");
            let out = Path::new(out_name.as_str());

            let cp: String = read_file(&path);

            fs::create_dir_all(out.parent().unwrap()).unwrap();
            fs::File::create(out)
                .unwrap()
                .write_all(cp.as_bytes())
                .unwrap();
        }
    }
}

pub fn translate(out_root: &PathBuf, in_root: &PathBuf) {
    if out_root.exists() {
        fs::remove_dir_all(out_root).unwrap();
    }
    iter_folder(out_root, in_root, in_root);
}
