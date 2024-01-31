const http = require("http");
const { loadPages, METHODS } = require('./pages.js');
const { loadBackendMethods } = require("./be-methods.js");  
const { requestListener } = require('./req-handler.js');
const { Component } = require("./templating.js");

const HOST = 'localhost';
const PORT = 8000;

const server = http.createServer(requestListener);

const startServer = (
    backendRoutes = {}
) => {
    server.listen(
        PORT,
        HOST,
        async () => {
            loadPages();
            loadBackendMethods(backendRoutes);
            // console.log(Object.keys(PAGES));
            console.log("listening...");
        }
    );
};

module.exports = {
    startServer,
    Component
};