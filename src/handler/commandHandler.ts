import { down, left, mouse, Point, right, up } from '@nut-tree/nut-js';
import { drawRectangle } from './drawRectangle.js';
import { drawCircle } from './drawCircule.js';
import { printScreen } from './printScreen.js';
import { Duplex } from 'stream';
import { createReadStream, ReadStream } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const commandHandler = async (command: string, duplex: Duplex): Promise<void> => {
  const parseCommand: string[] = command.split(' ');
  const curCursorPosition: Point = await mouse.getPosition();

  switch (parseCommand[0]) {
    case 'mouse_up':
      await mouse.move(up(Number(parseCommand[1])));
      sendResponse(duplex, command);
      break;
    case 'mouse_down':
      await mouse.move(down(Number(parseCommand[1])));
      sendResponse(duplex, command);
      break;
    case 'mouse_left':
      await mouse.move(left(Number(parseCommand[1])));
      sendResponse(duplex, command);
      break;
    case 'mouse_right':
      await mouse.move(right(Number(parseCommand[1])));
      sendResponse(duplex, command);
      break;
    case 'mouse_position':
      const cursorPosition: string = `${curCursorPosition.x},${curCursorPosition.y}`;
      sendResponse(duplex, command, cursorPosition);
      break;
    case 'draw_square':
      await drawRectangle(parseCommand);
      sendResponse(duplex, command);
      break;
    case 'draw_rectangle':
      await drawRectangle(parseCommand);
      sendResponse(duplex, command);
      break;
    case 'draw_circle':
      await drawCircle(parseCommand);
      sendResponse(duplex, command);
      break;
    case 'prnt_scrn':
      const isDo: boolean = await printScreen();
      if (!isDo) break;
      const readStream: ReadStream = createReadStream(path.join(__dirname, 'print-screen.png'));
      let buffer = '';
      readStream
        .on('data', (chunk: Buffer) => {
          buffer += Buffer.from(chunk).toString('base64');
        })
        .on('end', () => {
          sendResponse(duplex, command, buffer);
        })
        .on('error', (error) => {
          console.log(error.message);
        });
      break;
    default:
      break;
  }
};

const sendPrintScreen = async (): Promise<Promise<string> | Promise<void>> => {};
const sendResponse = (duplex: Duplex, command: string, result?: string): void => {
  let response: string = command;
  if (result) response += ' ' + result;
  duplex._write(response, 'base64', (error) => {
    if (error) console.log(error.message);
  });
};
