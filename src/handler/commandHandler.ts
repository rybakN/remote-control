import { Button, down, left, mouse, Point, right, straightTo, up } from '@nut-tree/nut-js';
import { drawRectangle } from './drawRectangle.js';
import { drawCircle } from './drawCircule.js';

export const commandHandler = async (command: string): Promise<Promise<void> | Promise<string>> => {
  console.log(command);
  const parseCommand: string[] = command.split(' ');
  const curCursorPosition: Point = await mouse.getPosition();

  switch (parseCommand[0]) {
    case 'mouse_up':
      await mouse.move(up(Number(parseCommand[1])));
      break;
    case 'mouse_down':
      await mouse.move(down(Number(parseCommand[1])));
      break;
    case 'mouse_left':
      await mouse.move(left(Number(parseCommand[1])));
      break;
    case 'mouse_right':
      await mouse.move(right(Number(parseCommand[1])));
      break;
    case 'mouse_position':
      return `${curCursorPosition.x},${curCursorPosition.y}`;
    case 'draw_square':
      await drawRectangle(parseCommand);
      break;
    case 'draw_rectangle':
      await drawRectangle(parseCommand);
      break;
    case 'draw_circle':
      await drawCircle(parseCommand);
      break;
  }
};
