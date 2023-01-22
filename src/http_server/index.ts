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
    console.log(`WebsocketServer port: ${info.port}\nRequest URL: ws://localhost:${info.port}\nfamily: ${info.family}`);
});

wss.on('connection', (ws: WebSocket) => {
  console.log('\x1b[36m%s\x1b[0m', 'Start connection');
  const stream: Duplex = createWebSocketStream(ws);

  stream.on('data', async (data) => {
    const result = await commandHandler(data.toString());
    if (!result) {
      sendResponse(stream, data.toString().split(' ')[0]);
    } else {
      sendResponse(stream, data.toString().split(' ')[0], result);
    }
  });

  stream.on('error', (error) => {
    console.log(error.message);
  });

  stream.on('end', () => {
    console.log('\x1b[36m%s\x1b[0m', 'Close connection');
    stream.destroy();
  });
});

const sendResponse = (stream: Duplex, command: string, result: string = ''): void => {
  let response: string = command;
  if (result) response += result;
  stream._write(response, 'base64', (error) => {
    if (error) console.log(error.message);
  });
};
