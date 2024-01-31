const http = require("http");
const { loadPages, METHODS } = require('./pages.cjs');
const { loadBackendMethods } = require("./be-methods.cjs");  
const { requestListener } = require('./req-handler');
const { Component } = require("./templating.cjs");

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