import { mouse, Point, straightTo } from '@nut-tree/nut-js';

export const drawRectangle = async (parseCommand: string[]): Promise<void> => {
  const width: number = Number(parseCommand[1]);
  const length: number = parseCommand.length === 3 ? Number(parseCommand[2]) : width;
  const curCursorPosition: Point = await mouse.getPosition();
  const rUp: Point = new Point(curCursorPosition.x + width, curCursorPosition.y);
  await mouse.move(straightTo(rUp));
  const rDown: Point = new Point(curCursorPosition.x + width, curCursorPosition.y + length);
  await mouse.move(straightTo(rDown));
  const lDown: Point = new Point(curCursorPosition.x, curCursorPosition.y + length);
  await mouse.move(straightTo(lDown));
  const lUp: Point = new Point(curCursorPosition.x, curCursorPosition.y);
  await mouse.move(straightTo(lUp));
};
