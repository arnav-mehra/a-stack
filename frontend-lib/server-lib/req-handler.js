const { PAGES } = require('./pages');
const mime = require('mime');

const patchRoute = (route) => {
    if (!route.includes('.')) {
        route += 'index.html';
    }
    if (route[0] == '/') {
        route = route.substring(1);
    }
    return route;
}

const requestListener = function (req, res) {
    const route = patchRoute(req.url);
    console.log(route)
    
    res.setHeader('Content-Type', mime.getType(route));

    if (!PAGES[route]) {
        res.writeHead(404);
        res.end('<div>Page Not Found</div>');
        return;
    }

    res.writeHead(200);
    res.end(PAGES[route])
};

module.exports = {
    requestListener
};