const chokidar = require('chokidar');
const fs = require("fs");

const PLAYGROUND = "playground\\";
const SRC = PLAYGROUND + "src\\";
const FRONTEND = SRC + "frontend\\";
const PAGES = FRONTEND + "pages\\";
const DIST = PLAYGROUND + "dist\\";
const BUILD = PLAYGROUND + "build\\";

const parsePath = (path) => {
  const tree = path.split("\\");
  const dir = tree.splice(-1).join("\\");
  const fname = tree.pop();
  const name = fname.split(".")[0];
  const ext = fname.split(".").pop();
  return [ dir, name, ext ];
}

const translateFilePath = (path) => {
  const [ dir, name, ext ] = parsePath(path);

  if (name == "client" && ext == "jsc") {
    return [
      BUILD + dir + name + ".mjs",
      DIST  + dir + "bundle.js"
    ];
  }
  else if (ext == "jsc") {
    return [
      BUILD + dir + name + ".mjs",
      undefined
    ];
  }
  else if (name == "server" && ext == "jss") {
    return [
      BUILD + dir + name + ".cjs",
      DIST  + dir + "index.html"
    ];
  }
  else if (ext == "jss") {
    return [
      BUILD + dir + name + ".cjs",
      undefined
    ];
  }
  else {
    return [
      BUILD + dir + name + "." + ext,
      DIST  + dir + name + "." + ext,
    ];
  }
}

const addDir = (dir) => {
  fs.mkdirSync(BUILD + dir);
  fs.mkdirSync(DIST + dir);
}

const remDir = (dir) => {
  fs.rmdirSync(BUILD + dir);
  fs.rmdirSync(DIST + dir);
}

const addFile = (path) => {
  const [ build_path, dist_path ] = translateFilePath(path);
}

const handleUpdate = (event, path) => {
  if (path.indexOf(PAGES) == -1) {
    return;
  }
  path = path.replace(PAGES, "");
  
  switch (event) {
    case "addDir": {
      // copy dir to dist.
      addDir(path);
      break;
    }
    case "unlinkDir": {
      // delete dir from dist.
      remDir(path);
      break;
    }
    case "add": {
      let ext = dir.split(".")[1];
      // add file to dist after translation.
      break;
    }
    case "unlink": {
      // delete file.
    }
    case "change": {
      // same as add.
      break;
    }
  }
}

const w = async () => (
  new Promise(() => {
    chokidar.watch([ SRC ]).on('all', (event, path) => {
      console.log(event, path);
      handleUpdate(event, path);
    });
  })
);

console.log("watching for updates...");
w();