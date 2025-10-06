#![feature(path_file_prefix)]
#![allow(non_camel_case_types)]

mod stringify;
mod ds;
mod parse;
mod file_io;
use file_io::{translate, read_file};
use std::{path::PathBuf, str::FromStr, env};

fn main() {
    let args: Vec<String> = env::args().collect();

    // let p = env::current_dir().unwrap();
    // let p2 = p.to_str().unwrap();
    // let in_root: PathBuf = PathBuf::from_str(&args[1]).unwrap();
    // let out_root: PathBuf = PathBuf::from_str(&args[2]).unwrap(); 
    // translate(&out_root, &in_root);

    let in_file: PathBuf = PathBuf::from_str(&args[1]).unwrap();
    println!("{}", read_file(&in_file));
}