import { server } from './src/http_server/index.js';

const HTTP_PORT = 8080;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
server.listen(HTTP_PORT);

process.on('SIGINT', () => {
  process.exit();
});
