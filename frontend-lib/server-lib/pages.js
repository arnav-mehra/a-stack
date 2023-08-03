// MAP PAGES TO HTML FILES

const fs = require("fs");
const path = require('path');
const exec = require('child_process').exec;

const PLAYGROUND_FOLDER = 'playground\\';
const DIST_FOLDER = PLAYGROUND_FOLDER + 'dist\\';
const SRC_FOLDER = PLAYGROUND_FOLDER + 'src\\';

const PAGES = {};
 
const loadPages = (dir = SRC_FOLDER) => {
    fs.readdirSync(dir).forEach(fname => {
        const rpath = path.join(dir, fname);
        if (fs.statSync(rpath).isDirectory()) {
            loadPages(rpath);
        } else {
            loadPage(rpath);
        }
    });
};

const loadPage = (rpath) => {
    if (rpath.includes("client.mjs")) {
        loadClientJS(rpath);
        return;
    }
    if (rpath.includes("server.cjs")) {
        loadServerHTML(rpath);
        return;
    }
};

const addPage = (route, content) => {
    route = route.replaceAll('\\', '/');
    PAGES[route] = content;
}

const loadClientJS = (rpath) => {
    const dpath = rpath.replace(SRC_FOLDER, DIST_FOLDER)
                       .replace("client.mjs", "bundle.js");
    const rel_dpath = dpath.replace(PLAYGROUND_FOLDER, "");
    const rel_rpath = rpath.replace(PLAYGROUND_FOLDER, "");
    
    console.log("rollup:\t", rel_rpath, "\t=>", rel_dpath);
    exec(
        `cd ${PLAYGROUND_FOLDER} && rollup -f es -i ${rel_rpath} -o ${rel_dpath}`,
        (err, stdout, stderr) => { /* console.log({err, stdout, stderr}) */ }
    );

    const route = rpath.replace(SRC_FOLDER, "");
    const content = fs.readFileSync(dpath).toString();
    addPage(route, content);
}

const loadServerHTML = (rpath) => {
    const route = rpath.replace(SRC_FOLDER, "");
    const IndexComponent = require('..\\' + rpath);
    const content = new IndexComponent()._render();
    
    const dpath = rpath.replace(SRC_FOLDER, DIST_FOLDER)
                       .replace("server.cjs", "index.html");

    const rel_dpath = dpath.replace(PLAYGROUND_FOLDER, "");
    const rel_rpath = rpath.replace(PLAYGROUND_FOLDER, "");
    console.log("ssr:\t", rel_rpath, "\t=>", rel_dpath);         
    fs.writeFileSync(dpath, content, console.log);

    addPage(route, content);
}

module.exports = {
    PAGES,
    loadPages
};