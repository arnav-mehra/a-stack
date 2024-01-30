const { METHODS } = require('./pages');
const mime = require('mime');
const http = require("http");

const patchRoute = (route) => {
    if (!route) {
        return route;
    }
    if (route[0] == '/') {
        route = route.substring(1);
    }
    return route;
}

/**
 * @type {http.RequestListener}
 * @param {typeof http.IncomingMessage}
 * @param {typeof http.ServerResponse}
*/
const requestListener = function (req, res) {
    const { url, method } = req;
    const route = patchRoute(url);
    console.log(route)

    if (!method || !METHODS[method]) {
        res.writeHead(500);
        res.end('<div>Unrecognized http method</div>');
        return;
    }
    if (!METHODS[method][route]) {
        res.writeHead(404);
        res.end('<div>Page Not Found</div>');
        return;
    }

    try {
        const { fn, mime } = METHODS[method][route];
        const { data, status } = fn(req, res);

        if (!res.hasHeader("Content-Type")) {
            res.setHeader('Content-Type', mime);
        }
        res.writeHead(status);
        res.end(data);
    } catch (err) {
        console.error(err);
    }
};

module.exports = {
    requestListener
};