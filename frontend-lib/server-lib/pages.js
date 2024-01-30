// MAP PAGES TO HTML FILES

const fs = require("fs");
const path = require('path');
const exec = require('child_process').exec;
const mime = require('mime');

const PLAYGROUND_FOLDER = 'playground\\';
const DIST_FOLDER = 'dist\\';
const SRC_FOLDER = 'src\\';

const METHODS = {
    GET: {},
    POST: {},
    PUT: {},
    DELETE: {},
    PATCH: {}
};

const PRINT_ERR = false;

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

const addPage = (route, content, mime) => {
    route = route.replaceAll('\\', '/');
    METHODS.GET[route] = {
        fn: () => ({
            status: 200,
            data: content
        }),
        mime
    };
};

const loadOtherFile = (path) => {
    const origin = path.replace(PLAYGROUND_FOLDER + SRC_FOLDER, "");
    const target = origin;

    console.log("copy:\t", SRC_FOLDER + origin, "\t=>", DIST_FOLDER + target);
    exec(
        `cd ${PLAYGROUND_FOLDER} && copy ${SRC_FOLDER + origin} ${DIST_FOLDER + target}`,
        (err, stdout, stderr) => { if (PRINT_ERR) console.log({err, stdout, stderr}); }
    );

    const content = fs.readFileSync(PLAYGROUND_FOLDER + SRC_FOLDER + target).toString();
    addPage(target, content, mime.getType(target));
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
    addPage(target, content, mime.getType(target));
};

const loadServerHTML = (path) => {
    const origin = path.replace(PLAYGROUND_FOLDER + SRC_FOLDER, "");
    const target = origin.replace("server.cjs", "index.html");
    
    console.log("ssg:\t", SRC_FOLDER + origin, "\t=>", DIST_FOLDER + target);      
    const IndexComponent = require('..\\' + path);
    const content = new IndexComponent()._render();
    fs.writeFileSync(PLAYGROUND_FOLDER + DIST_FOLDER + target, content, console.log);
    
    const route  = origin.replace("client.mjs", "");
    addPage(route, content, mime.getType(target));
};

module.exports = {
    METHODS,
    loadPages
};