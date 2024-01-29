use pest::{Parser, iterators::Pair};
use std::{fs, io::Write, path};
use path::{Path, PathBuf};

use crate::stringify::Stringify;
use crate::ds::Component;
use crate::parse::{get_component, ComponentParser, Rule};

pub fn read_file(path: &Path) -> String {
    let ext: &str = path.extension().unwrap().to_str().unwrap();
    let str: String = fs::read_to_string(path).unwrap().parse().unwrap();

    match ext {
        "jsq" => {       
            let ch_cnt = str.chars()
                .filter(|x| x.is_whitespace())
                .count();
            println!("JSQ char count (no whitespace): {}", ch_cnt);

            let res = ComponentParser::parse(Rule::COMPONENT, &str).unwrap();
            let c: Pair<'_, Rule> = res.into_iter().last().unwrap();
            let name: &str = path.file_prefix().unwrap().to_str().unwrap();
            let cp: Component = get_component(c, name);
            let cp_str = cp.stringify();

            let ch_cnt = cp_str.chars()
                .filter(|x| x.is_whitespace())
                .count();
            println!("JS char count (no whitespace): {}", ch_cnt);

            cp_str
        }
        _ => str
    }    
}

pub fn iter_folder(out_root: &Path, in_root: &Path, dir: &Path) {
    for ent in fs::read_dir(dir).unwrap() {
        let path: PathBuf = ent.unwrap().path();
        
        if path.is_dir() {
            iter_folder(out_root, in_root, &path);
        }
        else {
            let g_old_prefix: String = in_root.to_str().unwrap().to_owned() + "\\";
            let g_new_prefix: String = out_root.to_str().unwrap().to_owned() + "\\";
            let out_name: String = g_new_prefix
                + &path.to_str()
                    .unwrap()
                    .strip_prefix(&g_old_prefix)
                    .unwrap()
                    .replace(".jsq", ".js");

            let cp: String = read_file(&path);
            fs::File::create(out_name)
                .unwrap()
                .write_all(cp.as_bytes())
                .unwrap();
        }
    }
}