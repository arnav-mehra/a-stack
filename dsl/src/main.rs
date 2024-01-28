#![feature(path_file_prefix)]

mod stringify;
mod ds;
mod parse;
mod file_io;
use file_io::iter_folder;
use std::path::Path;

fn main() {
    let in_root: &Path = Path::new("./test");
    let out_root: &Path = Path::new("./build"); 
    iter_folder(out_root, in_root, in_root);

    // format!(
    //     "import {{
    //         Component, hydrate
    //     }} from '../../client-lib/dist/bundle';
    //     {}
    //     hydrate();
    //     ",
    //     0
    // );
}
