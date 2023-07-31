const http = require("http");
const { loadPages } = require('./pages');
const { requestListener } = require('./req-handler');

const HOST = 'localhost';
const PORT = 8000;

const server = http.createServer(requestListener);

server.listen(PORT, HOST, async () => {
    loadPages();
});