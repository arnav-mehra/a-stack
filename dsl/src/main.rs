#![feature(path_file_prefix)]

mod stringify;
mod ds;
mod parse;
mod file_io;
use file_io::translate;
use std::{path::PathBuf, str::FromStr};

fn main() {
    let in_root: PathBuf = PathBuf::from_str("./test").unwrap();
    let out_root: PathBuf = PathBuf::from_str("./build").unwrap(); 
    translate(&out_root, &in_root);
}