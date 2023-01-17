import * as fs from 'fs';
import * as path from 'path';
import * as http from 'http';
import WebSocket, { Server, WebSocketServer } from 'ws';
import { mouse, Point } from '@nut-tree/nut-js';

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
wss.on('connection', (ws: WebSocket) => {
  ws.on('message', async (data) => {
    console.log(data.toString());
    const curPosition = await mouse.getPosition();
    await mouse.move([new Point(curPosition.x, curPosition.y + 10)]);
    ws.send(data.toString());
  });
});
