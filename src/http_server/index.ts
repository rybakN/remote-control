import * as fs from 'fs';
import * as path from 'path';
import * as http from 'http';
import WebSocket, { Server, WebSocketServer, createWebSocketStream, AddressInfo } from 'ws';
import { commandHandler } from '../handler/commandHandler.js';
import { Duplex } from 'stream';

export const server = http.createServer(function (req, res) {
  const __dirname = path.resolve(path.dirname(''));
  const file_path = __dirname + (req.url === '/' ? '/front/index.html' : '/front' + req.url);
  fs.readFile(file_path, function (err, data) {
    if (err) {
      res.writeHead(404);
      res.end(JSON.stringify(err));
      return;
    }
    res.writeHead(200);
    res.end(data);
  });
});

const wss: Server = new WebSocketServer({ server });

wss.on('listening', () => {
  const info: AddressInfo | string = wss.address();
  if (typeof info !== 'string')
    console.log(`WebsocketServer port: ${info.port}\nURL: ws://localhost:${info.port}\nfamily: ${info.family}`);
});

wss.on('connection', (ws: WebSocket) => {
  console.log('\x1b[36m%s\x1b[0m', 'Start connection');
  const duplex: Duplex = createWebSocketStream(ws);

  duplex.on('data', async (data) => {
    await commandHandler(data.toString(), duplex);
  });

  duplex.on('error', () => {
    console.log('ERROR');
  });

  duplex.on('end', () => {
    console.log('\x1b[36m%s\x1b[0m', 'Close connection');
    duplex.destroy();
  });
});
