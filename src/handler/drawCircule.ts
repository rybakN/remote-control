import { mouse, Point } from '@nut-tree/nut-js';

export const drawCircle = async (parseCommand: string[]): Promise<void> => {
  const radius: number = Number(parseCommand[1]);
  const startPosition: Point = await mouse.getPosition();
  const centerCircle: Point = new Point(startPosition.x, startPosition.y + radius);
  const points: Point[] = [];

  for (let i = -90; i <= 270; i++) {
    const x: number = centerCircle.x + radius * Math.cos((i * Math.PI) / 180);
    const y: number = centerCircle.y + radius * Math.sin((i * Math.PI) / 180);
    await mouse.move([new Point(x, y)]);
  }
};
