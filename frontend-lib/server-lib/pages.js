// MAP PAGES TO HTML FILES

const fs = require("fs");
const path = require('path');

const SSR_FOLDER = '../playground/';
const PAGES = {};

const loadPages = (dir = SSR_FOLDER) => {
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
    const invalid = !rpath.includes("index.html")
                 && !rpath.includes("bundle.js")
                 && !rpath.includes(".css");
    if (invalid) return;

    const content = fs.readFileSync(rpath).toString();
    const route = rpath.substring(SSR_FOLDER.length - 1)
                       .replaceAll('\\', '/');
    PAGES[route] = content;
};

module.exports = {
    PAGES,
    loadPages
};