// MAP PAGES TO HTML FILES

const fs = require("fs");
const path = require('path');
const exec = require('child_process').exec;

const PLAYGROUND_FOLDER = 'playground\\';
const DIST_FOLDER = 'dist\\';
const SRC_FOLDER = 'src\\';

const PAGES = {};

const loadPages = (dir = PLAYGROUND_FOLDER + SRC_FOLDER) => {
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
    loadOtherFile(rpath);
};

const addPage = (route, content) => {
    route = route.replaceAll('\\', '/');
    PAGES[route] = content;
};

const loadOtherFile = (path) => {
    const origin = path.replace(PLAYGROUND_FOLDER + SRC_FOLDER, "");
    const target = origin;

    console.log("copy:\t", SRC_FOLDER + origin, "\t=>", DIST_FOLDER + target);
    exec(
        `cd ${PLAYGROUND_FOLDER} && copy ${SRC_FOLDER + origin} ${DIST_FOLDER + target}`,
        () => {} // (err, stdout, stderr) => { console.log({err, stdout, stderr}) }
    );

    const content = fs.readFileSync(PLAYGROUND_FOLDER + SRC_FOLDER + target).toString();
    addPage(target, content);
};

const loadClientJS = (path) => {
    const origin = path.replace(PLAYGROUND_FOLDER + SRC_FOLDER, "");
    const target = origin.replace("client.mjs", "bundle.js");

    console.log("rollup:\t", SRC_FOLDER + origin, "\t=>", DIST_FOLDER + target);
    exec(
        `cd ${PLAYGROUND_FOLDER} && rollup -f es -i ${SRC_FOLDER + origin} -o ${DIST_FOLDER + target}`,
        () => {} // (err, stdout, stderr) => { console.log({err, stdout, stderr}) }
    );

    const content = fs.readFileSync(PLAYGROUND_FOLDER + DIST_FOLDER + target).toString();
    addPage(target, content);
};

const loadServerHTML = (path) => {
    const origin = path.replace(PLAYGROUND_FOLDER + SRC_FOLDER, "");
    const target = origin.replace("server.cjs", "index.html");

    console.log("ssg:\t", SRC_FOLDER + origin, "\t=>", DIST_FOLDER + target);      
    const IndexComponent = require('..\\' + path);
    const content = new IndexComponent()._render();
    fs.writeFileSync(PLAYGROUND_FOLDER + DIST_FOLDER + target, content, console.log);

    addPage(target, content);
};

module.exports = {
    PAGES,
    loadPages
};