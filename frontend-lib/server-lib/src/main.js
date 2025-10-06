const http = require("http");
const { loadPages, METHODS } = require('./pages.js');
const { loadBackendMethods } = require("./be-methods.js");  
const { requestListener } = require('./req-handler.js');
const { Component } = require("./templating.js");

const HOST = 'localhost';

const server = http.createServer(requestListener);

const startServer = ({
    port = 8000,
    backendMethods = {}
}) => {
    server.listen(
        port,
        HOST,
        async () => {
            loadPages();
            loadBackendMethods(backendMethods);
            console.log("listening...");
        }
    );
};

module.exports = {
    startServer,
    Component
};