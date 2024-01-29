const http = require("http");
const { loadPages, METHODS } = require('./pages');
const { loadUserMethods } = require("./user-methods");  
const { requestListener } = require('./req-handler');

const HOST = 'localhost';
const PORT = 8000;

const server = http.createServer(requestListener);

server.listen(
    PORT,
    HOST,
    async () => {
        loadPages();
        loadUserMethods();
        // console.log(Object.keys(PAGES));
        console.log("listening...");
    }
);

module.exports = loadUserMethods;