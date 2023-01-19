import * as fs from 'fs';
import * as path from 'path';
import * as http from 'http';
import WebSocket, { Server, WebSocketServer, createWebSocketStream } from 'ws';
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

wss.on('listening', (ws: WebSocket) => {
  console.log(wss.address());
});

wss.on('connection', (ws: WebSocket) => {
  const duplex = createWebSocketStream(ws);

  duplex.on('data', async (data) => {
    let response: string = data.toString();
    const answer: string | void = await commandHandler(data.toString());

    if (answer) response += ' ' + answer;

    duplex._write(response, 'utf-8', async (error) => {
      if (error) console.log(error.message);
    });
  });

  duplex.on('error', () => {
    console.log('ERROR');
  });

  duplex.on('end', () => {
    console.log('Goodbye!');
    // duplex.destroy();
  });
});

wss.on('wsClientError', (error) => {
  console.log(error.message);
  wss.close();
});

wss.on('close', () => {
  wss.close();
});
